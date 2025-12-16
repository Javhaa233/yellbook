# Web Login / Auth / Admin Flow (YellBook)

This document describes **everything related to web login/authentication** in the Next.js app, including:
- 3-type login selector (Admin / User / GitHub)
- NextAuth (GitHub OAuth) setup
- Role-based access control (USER vs ADMIN)
- Dev-only admin auto-grant flow
- Admin CRUD pages (Users + Businesses)
- Common errors and troubleshooting

---

## 1) Key URLs (Web)

### Public
- `/` — Home. If **not logged in**, shows the **3-choice login selector**.
- `/login` — Login page (3-choice selector).
- `/yellow-books` — Public yellow book listing.
- `/yellow-books/assistant` — AI Search UI.

### Admin (requires ADMIN)
- `/admin` — Admin dashboard.
- `/admin/users` — Manage user roles.
- `/admin/businesses` — Businesses CRUD list.
- `/admin/businesses/new` — Create business.
- `/admin/businesses/:id/edit` — Edit business.

### Dev-only helper
- `/grant-admin` — **DEV ONLY**. Upgrades the currently logged-in user to `ADMIN` and redirects to `/admin`.

---

## 2) Login UX (3 choices)

The login UI presents 3 options:

1. **Admin нэвтрэх**
   - Performs GitHub OAuth, then navigates to `/grant-admin`.
   - `/grant-admin` upgrades your DB role to `ADMIN` (only in development).
   - Finally redirects to `/admin`.

2. **User нэвтрэх**
   - Performs GitHub OAuth and redirects to `/yellow-books`.

3. **GitHub-ээр нэвтрэх**
   - Performs GitHub OAuth and redirects to `callbackUrl` if provided in query string, else `/yellow-books`.

Where it’s implemented:
- `apps/web/src/app/login/LoginClient.tsx`

---

## 3) Authentication: NextAuth (GitHub)

Web uses **NextAuth** with a **GitHub provider**.

### Environment variables
You need these configured (local and/or deployment):
- `GITHUB_ID`
- `GITHUB_SECRET`
- `NEXTAUTH_SECRET`

Notes:
- GitHub provider scope used: `read:user user:email`

Where configured:
- `apps/web/src/lib/auth.ts`

---

## 4) Database user creation & role model

### Prisma role model
- Prisma enum: `UserRole = USER | ADMIN`
- Default role is `USER`

Where defined:
- `apps/api/prisma/schema.prisma`

### Creating/upserting user on sign-in
On GitHub sign-in:
- If `user.email` exists, the web app upserts a DB user record.
- New users are created with `role: USER`.

Where implemented:
- `apps/web/src/lib/auth.ts` → `callbacks.signIn`

---

## 5) Session role & “why role updates now work immediately”

The session uses JWT strategy.

### What’s stored
- `token.id` = DB user id
- `token.role` = DB user role

### Refreshing role from DB (important)
To make role changes take effect **without forcing re-login**, the JWT callback refreshes `token.role` from DB on subsequent requests (when `token.id` exists).

Where implemented:
- `apps/web/src/lib/auth.ts` → `callbacks.jwt`

---

## 6) Role-based access control (RBAC)

### Server guard helpers
- `requireAuthSession()`
  - Redirects to `/login?callbackUrl=/yellow-books` if not logged in

- `requireAdminSession()`
  - Redirects to `/login?callbackUrl=/admin&error=insufficient_permissions` if:
    - not logged in, OR
    - logged in but role is not `ADMIN`

Where implemented:
- `apps/web/src/lib/server-auth.ts`

### Admin layout behavior
All routes under `/admin/*` go through the admin layout and call `requireAdminSession()`.

Where implemented:
- `apps/web/src/app/admin/layout.tsx`

---

## 7) DEV admin auto-grant flow (`/grant-admin`)

Goal: When you choose **“Admin нэвтрэх”**, you should be able to enter admin screens and do CRUD immediately.

Behavior:
- Requires you to be logged in (`requireAuthSession()`).
- If `NODE_ENV === "production"`, it will NOT grant admin.
- In development:
  - Updates DB user role to `ADMIN`.
  - Redirects to `/admin`.

Where implemented:
- `apps/web/src/app/grant-admin/page.tsx`

Security note:
- This is intentionally blocked in production.

---

## 8) Admin features (CRUD)

### 8.1 Manage Users (role change)
Route:
- `/admin/users`

Behavior:
- Lists users from Prisma.
- Allows setting role to `USER` or `ADMIN`.
- Prevents self-demote to `USER`.

Where implemented:
- UI: `apps/web/src/app/admin/users/page.tsx`
- API: `apps/web/src/app/api/admin/users/[userId]/role/route.ts`

### 8.2 Businesses CRUD (YellowBookEntry)
Routes:
- `/admin/businesses` (list)
- `/admin/businesses/new` (create)
- `/admin/businesses/:id/edit` (update)

API endpoints:
- `POST /api/admin/businesses` (create)
- `POST /api/admin/businesses/:id` (update)
- `POST /api/admin/businesses/:id/delete` (delete)

Where implemented:
- UI:
  - `apps/web/src/app/admin/businesses/page.tsx`
  - `apps/web/src/app/admin/businesses/new/page.tsx`
  - `apps/web/src/app/admin/businesses/[id]/edit/page.tsx`
- API:
  - `apps/web/src/app/api/admin/businesses/route.ts`
  - `apps/web/src/app/api/admin/businesses/[id]/route.ts`
  - `apps/web/src/app/api/admin/businesses/[id]/delete/route.ts`

---

## 9) Common issues & troubleshooting

### A) `/admin` redirects with `error=insufficient_permissions`
Meaning:
- You are logged in, but your DB role is not `ADMIN`.

Fix:
- In development: use **Admin нэвтрэх** (which routes through `/grant-admin`).
- Or go to `/admin/users` with an existing admin account and set your role to `ADMIN`.

### B) You became ADMIN but still can’t access `/admin`
Possible reasons:
- Session token still had old role.

Fix:
- This should be resolved now because the JWT callback refreshes role from DB.
- If it still happens, sign out and sign in again.

### C) API errors (AI Search / list fetch fails)
Web talks to the API using `NEXT_PUBLIC_BACKEND_URL`.
- Default: `http://localhost:3001`

If API is not running, web will log fetch errors.

Where base URL is defined:
- `apps/web/src/utils/trpc.ts`

---

## 10) Local run checklist

1. Start API
   - `npm run dev:api`
   - Expect API on `http://localhost:3001`

2. Start Web
   - `npm run dev:web`
   - Expect Web on `http://localhost:3000`

3. Open web
   - `http://localhost:3000/`
   - Choose login type (Admin/User/GitHub)

---

## 11) Production note (important)

In production, **/grant-admin is disabled**.
To have admin users in production, you must:
- Seed/admin-manage roles through DB (e.g., a seeded admin user), or
- Promote users via an existing admin account (`/admin/users`).
