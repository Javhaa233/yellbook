import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";

/**
 * Server-side guard to protect admin pages
 * Usage: const session = await requireAdminSession()
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function requireAdminSession(): Promise<any> {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login?callbackUrl=/admin");
  }

  const user = session.user as any;
  if (user?.role !== "ADMIN") {
    redirect("/login?callbackUrl=/admin&error=insufficient_permissions");
  }

  return session;
}

/**
 * Get session on server side (returns null if not authenticated)
 */
export async function getAuthSession() {
  return await getServerSession(authOptions);
}

/**
 * Guard for authenticated users only (any role)
 */
export async function requireAuthSession() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login?callbackUrl=/yellow-books");
  }

  return session;
}
