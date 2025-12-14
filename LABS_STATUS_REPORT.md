# Лабораторийн ажлуудын статус тайлан
## Огноо: 2025-12-14

---

## 🎯 **LAB 6: Docker + CI/CD + ECR** (5 оноо)

### ✅ Гүйцэтгэсэн (90/100 оноо)

#### 1. Dockerfiles (30/30 оноо) ✅
- ✅ `Dockerfile.api` - Multi-stage build, Node 20-alpine
- ✅ `Dockerfile.web` - Multi-stage build, Next.js 15
- ✅ Production-ready: non-root user, dumb-init, health checks
- ✅ Optimized: layer caching, .dockerignore configured

#### 2. Local Sanity (10/10 оноо) ✅
- ✅ `docker-compose up` ажиллана
- ✅ PostgreSQL 16 + Redis 7 containers
- ✅ API: http://localhost:3001/health
- ✅ Web: http://localhost:3000
- ✅ Database migrations автоматаар ажиллана

#### 3. ECR Repos + Policies (20/20 оноо) ✅
- ✅ `yellbook/api` repository үүссэн
- ✅ `yellbook/web` repository үүссэн
- ✅ Images pushed to ECR:
  - API: latest (461MB) - sha256:c47e4ca...
  - Web: latest (383MB) - sha256:d064a47...
- ✅ IAM user configured with ECR access
- ✅ Image scanning enabled

#### 4. CI Build/Push (20/30 оноо) ⚠️
- ✅ `.github/workflows/ci.yml` үүссэн
- ✅ Matrix build configured (api, web)
- ❌ **CI pipeline failing on web build** (needs fix)
- ✅ Manual Docker build + push амжилттай
- ⚠️ Need to fix: Environment variables for Next.js build

#### 5. Documentation (10/10 оноо) ✅
- ✅ `README_LAB6.md` - Architecture overview
- ✅ `ECR_SETUP.md` - ECR deployment steps
- ✅ `GITHUB_SECRETS_SETUP.md` - CI/CD setup
- ✅ Setup instructions бичигдсэн

#### 🎁 Bonus (+10 = +1 оноо)
- ✅ Matrix build implemented for api & web
- ⚠️ Works on push, but fails on pull_request

### 📊 Lab 6 Нийт оноо: **4.5/5.0 оноо**

**Дутуу зүйлс:**
1. ❌ CI/CD workflow web build failing
2. ❌ GitHub Actions run link (green) байхгүй
3. ⚠️ ECR images нь `:<sha>` tag-гүй (зөвхөн `latest`)

**Засах шаардлагатай:**
```bash
# 1. Fix CI/CD workflow env vars
# 2. Add git SHA tagging to images
# 3. Push green CI run
```

---

## 🎯 **LAB 7: EKS Deployment** (10 оноо)

### ⚠️ Хэсэгчлэн гүйцэтгэсэн (45/100 оноо)

#### 1. OIDC/Roles (10/20 оноо) ⚠️
- ✅ EKS Cluster created with CloudFormation
- ✅ Fargate profile configured
- ⚠️ OIDC provider created but not fully configured
- ❌ GitHub Actions OIDC не байна
- ❌ Service account IAM roles дутуу

#### 2. aws-auth/RBAC (0/10 оноо) ❌
- ❌ ConfigMap aws-auth configured байхгүй
- ❌ RBAC roles not defined
- ❌ Service account permissions дутуу

#### 3. Manifests (20/25 оноо) ⚠️
- ✅ `00-namespace.yaml` - deployed
- ✅ `01-configmap-secret.yaml` - deployed
- ✅ `02-postgres.yaml` - running (emptyDir storage)
- ⚠️ `03-migration-job.yaml` - completed but errors
- ❌ `04-api-deployment.yaml` - CrashLoopBackOff
- ❌ `05-web-deployment.yaml` - CrashLoopBackOff
- ✅ `06-hpa.yaml` - ready to deploy
- ❌ `07-ingress.yaml` - not deployed yet

**Pods Status:**
```
postgres-7c89db674b-fcvm2   1/1   Running    ✅
db-migration-h8qnq          0/1   Completed  ⚠️
api-764bf49494-r8rwn        0/1   CrashLoop  ❌
web-7c54c4944-hqbnd         0/1   CrashLoop  ❌
```

#### 4. Ingress/TLS (0/20 оноо) ❌
- ✅ ALB Controller installed
- ❌ Ingress resource not deployed
- ❌ Route53 domain not configured
- ❌ TLS certificate not configured
- ❌ Public HTTPS URL байхгүй

#### 5. Migration Job (5/10 оноо) ⚠️
- ✅ Migration job deployed
- ⚠️ Job completed but with errors
- ⚠️ Database schema created
- ❌ Seed data not loaded

#### 6. HPA (0/10 оноо) ❌
- ⚠️ HPA manifest ready but not deployed
- ❌ Metrics server not configured
- ❌ Autoscaling not working

#### 7. Documentation (5/5 оноо) ✅
- ✅ `LAB7_README.md` - Complete guide
- ✅ `k8s/README.md` - Deployment steps
- ✅ `DEPLOY.md` - Deployment guide

### 📊 Lab 7 Нийт оноо: **4.5/10 оноо**

**Дутуу зүйлс:**
1. ❌ **Public HTTPS URL байхгүй** (0 оноо)
2. ❌ **Pods not Running** - CrashLoopBackOff
3. ❌ **Ingress/TLS not configured**
4. ❌ **GitHub Actions deploy workflow байхгүй**

**Засах шаардлагатай:**
```bash
# 1. Fix API/Web pod crashes (dotenv issue)
# 2. Deploy Ingress with ALB
# 3. Configure Route53 domain
# 4. Setup TLS certificate
# 5. Create deploy workflow
```

---

## 🎯 **LAB 8: OAuth Implementation** (5 оноо)

### ✅ Бүрэн гүйцэтгэсэн (100/100 оноо) - Локал дээр

#### 1. GitHub OAuth App (✅ Completed)
- ✅ GitHub OAuth App created
  - Client ID: `Ov23liop79G4zXAGScKW`
  - Callback URL: `http://localhost:3000/api/auth/callback/github`
- ✅ `.env.local` configured:
  ```
  GITHUB_ID=Ov23liop79G4zXAGScKW
  GITHUB_SECRET=<secret>
  NEXTAUTH_SECRET=<generated>
  ```

#### 2. NextAuth Implementation (✅ Completed)
- ✅ NextAuth route: `apps/web/src/app/api/auth/[...nextauth]/route.ts`
- ✅ Auth config: `apps/web/src/lib/auth.ts`
- ✅ Server-side auth: `apps/web/src/lib/server-auth.ts`
- ✅ GitHub provider configured
- ✅ Sign in/out working

#### 3. Role-based Access Control (✅ Completed)
- ✅ User model updated with `role` field:
  ```prisma
  enum UserRole {
    USER
    ADMIN
  }
  model User {
    role UserRole @default(USER)
  }
  ```
- ✅ Admin user seeded: `prisma/seed-admin.ts`
- ✅ Migration applied: `20251207025038_add_auth_models`

#### 4. Middleware/Guards (✅ Completed)
- ✅ API Guards implemented in `apps/api/src/app/guards/`
- ✅ Role-based route protection working
- ✅ Admin routes protected
- ✅ SSR guard implemented

#### 5. CSRF Protection (✅ Completed)
- ✅ NextAuth built-in CSRF protection enabled
- ✅ Cookie-backed mutations protected
- ✅ Session management secure

### 📊 Lab 8 Нийт оноо: **5.0/5.0 оноо** ✅

**Deliverables:**
- ✅ GitHub OAuth working locally
- ✅ Admin user seeded and tested
- ✅ Role-based access working
- ⚠️ **Needs screenshots for submission**
- ⚠️ **Not deployed to EKS yet**

---

## 🎯 **LAB 9: AI Search Implementation** (5 оноо)

### ✅ Бүрэн гүйцэтгэсэн (100/100 оноо) - Локал дээр

#### 1. Embedding Field (✅ Completed)
- ✅ Prisma model updated:
  ```prisma
  model YellowBookEntry {
    embedding  Float[]   @default([])
    embeddedAt DateTime?
  }
  ```
- ✅ Migration applied successfully

#### 2. Offline Embedding Script (✅ Completed)
- ✅ Script: `apps/api/prisma/scripts/embed-businesses.ts`
- ✅ Using Google Gemini API: `text-embedding-004`
- ✅ Rate limiting implemented (20s delay)
- ✅ Batch processing: 1000 businesses per run
- ✅ API Key configured: `OPENAI_API_KEY=AIzaSy...`

#### 3. AI Search Endpoint (✅ Completed)
- ✅ Route: `POST /api/ai/yellow-books/search`
  - File: `apps/api/src/app/routes/ai-search.ts`
- ✅ Service: `apps/api/src/app/services/ai-search.service.ts`
- ✅ Vector similarity search implemented
- ✅ Returns top 10 relevant businesses

#### 4. Redis Caching (✅ Completed)
- ✅ Redis 7 configured: `localhost:6379`
- ✅ Cache TTL: 1 hour
- ✅ Query results cached
- ✅ Environment variables set

#### 5. UI Page (✅ Completed)
- ✅ Page: `/yellow-books/search`
- ✅ AI-powered search interface
- ✅ Real-time search results
- ✅ Responsive design

### 📊 Lab 9 Нийт оноо: **5.0/5.0 оноо** ✅

**Deliverables:**
- ✅ Embeddings generated for businesses
- ✅ AI search working locally
- ✅ Redis caching working
- ✅ UI page functional
- ⚠️ **Needs screenshots for submission**
- ⚠️ **Not deployed to EKS yet**

---

## 📊 **Нийт дүн: 19.0 / 25.0 оноо (76%)**

### ✅ Гүйцэтгэсэн:
- **Lab 6**: 4.5/5.0 ✅
- **Lab 7**: 4.5/10.0 ⚠️
- **Lab 8**: 5.0/5.0 ✅ (локал)
- **Lab 9**: 5.0/5.0 ✅ (локал)

### 🔧 Засах шаардлагатай:

#### **Яаралтай (Lab 7 дуусгах):**
1. ❌ **API/Web pods fix** - CrashLoopBackOff засах
   - Dotenv dependency issue
   - Plugins directory path issue
2. ❌ **Deploy Ingress** - Public URL гаргах
3. ❌ **Route53 + TLS** - HTTPS domain setup

#### **Сайжруулах (Lab 6):**
1. ⚠️ **CI/CD pipeline fix** - Green build status
2. ⚠️ **Git SHA tagging** - ECR images with :<sha>
3. ⚠️ **Badge update** - README CI badge

#### **Submission requirements:**
1. 📸 **Screenshots needed:**
   - ECR images with tags
   - kubectl get pods (all Ready)
   - Public HTTPS URL with padlock
   - Lab 8 OAuth demo (local)
   - Lab 9 AI search demo (local)

2. 🔗 **Links needed:**
   - GitHub repo: ✅ https://github.com/Javhaa233/yellbook
   - CI run (green): ❌ Need green build
   - Deploy run: ❌ Need deploy workflow

---

## 🎯 Дараагийн алхам:

### Option A: Бүгдийг EKS дээр ажиллуулах (3-4 цаг)
1. Fix API/Web crashes
2. Deploy working pods
3. Setup Ingress + TLS
4. Full deployment working online

### Option B: Lab 7 хэсэгчлэн + Labs 8&9 локал (30 минут)
1. Show EKS cluster + Postgres running
2. Demo Labs 8 & 9 locally with screenshots
3. Submit with partial Lab 7 credit (4.5/10)

**Би танд Option B санал болгож байна:**
- Lab 6: 4.5 ✅
- Lab 7: 4.5 (cluster + manifests ready)
- Lab 8: 5.0 (working locally)
- Lab 9: 5.0 (working locally)
- **Total: 19/25 = 76% (Давах)**

Та ямар option сонгох вэ?
