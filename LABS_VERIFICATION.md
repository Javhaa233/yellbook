# Labs 6-9 Verification Guide

## Lab 6: Docker & ECR ✅

### Implemented Features
- ✅ Multi-stage Dockerfiles (API & Web)
- ✅ GitHub Actions CI/CD with matrix builds
- ✅ Build on push and pull_request
- ✅ Conditional ECR push on main branch
- ✅ Security scanning with Trivy
- ✅ Health checks

### Verification Steps

#### 1. Test Docker Builds Locally
```powershell
# Build API
docker build -f Dockerfile.api -t yellbook-api:test .

# Build Web
docker build -f Dockerfile.web -t yellbook-web:test .

# Verify images
docker images | findstr yellbook
```

#### 2. Install AWS CLI
```powershell
# Download from: https://awscli.amazonaws.com/AWSCLIV2.msi
# After install:
aws --version
aws configure
```

#### 3. Create ECR Repositories
```powershell
# Run setup script
.\scripts\setup-ecr.ps1

# OR manually:
aws ecr create-repository --repository-name yellbook/api --region ap-southeast-1
aws ecr create-repository --repository-name yellbook/web --region ap-southeast-1
```

#### 4. Configure GitHub Secrets
Go to: https://github.com/Javhaa233/yellbook/settings/secrets/actions

Add:
- `AWS_ACCESS_KEY_ID`
- `AWS_SECRET_ACCESS_KEY`
- `AWS_ACCOUNT_ID`
- `AWS_REGION` = `ap-southeast-1`

#### 5. Trigger CI/CD
```powershell
git commit --allow-empty -m "Trigger CI/CD"
git push origin main
```

Watch: https://github.com/Javhaa233/yellbook/actions

---

## Lab 7: EKS Deployment

### Requirements
- [ ] Set up EKS cluster
- [ ] Configure OIDC for GitHub Actions
- [ ] Deploy with Kubernetes manifests
- [ ] Set up Ingress with TLS
- [ ] Run migration job
- [ ] Configure HPA

### Files Already Prepared
- ✅ `k8s/manifests/00-namespace.yaml`
- ✅ `k8s/manifests/01-configmap-secret.yaml`
- ✅ `k8s/manifests/02-postgres.yaml`
- ✅ `k8s/manifests/03-migration-job.yaml`
- ✅ `k8s/manifests/04-api-deployment.yaml`
- ✅ `k8s/manifests/05-web-deployment.yaml`
- ✅ `k8s/manifests/06-hpa.yaml`
- ✅ `k8s/manifests/07-ingress.yaml`

### Verification Steps

#### 1. Create EKS Cluster
```bash
# Option A: Using CloudFormation
aws cloudformation create-stack \
  --stack-name yellbook-eks \
  --template-body file://k8s/eks-cluster-cloudformation.yaml \
  --capabilities CAPABILITY_IAM

# Option B: Using eksctl
eksctl create cluster -f k8s/cluster-config.yaml
```

#### 2. Set up OIDC
```bash
cd k8s
./setup-oidc.sh
./setup-github-actions-oidc.sh
```

#### 3. Deploy to EKS
```bash
# Apply all manifests
kubectl apply -f k8s/manifests/

# Check status
kubectl get pods -n yellowbooks
kubectl get svc -n yellowbooks
kubectl get ingress -n yellowbooks
```

#### 4. Verify Deployment
```bash
kubectl get pods -n yellowbooks
# All pods should be Running/Completed

kubectl logs -n yellowbooks -l app=migration-job
# Migration should complete successfully

kubectl get hpa -n yellowbooks
# HPA should show targets
```

---

## Lab 8: GitHub OAuth ✅

### Implemented Features
- ✅ NextAuth.js configuration
- ✅ GitHub OAuth provider
- ✅ User role enum (USER, ADMIN)
- ✅ Admin seeding script
- ✅ Server-side admin protection
- ✅ Role-based access control

### Verification Steps

#### 1. Create GitHub OAuth App
1. Go to: https://github.com/settings/developers
2. Click "New OAuth App"
3. Fill in:
   - Application name: `YellBook`
   - Homepage URL: `http://localhost:3000`
   - Authorization callback URL: `http://localhost:3000/api/auth/callback/github`
4. Copy Client ID and Secret

#### 2. Configure Environment Variables
```bash
# Add to apps/web/.env.local
GITHUB_ID=your_github_client_id
GITHUB_SECRET=your_github_client_secret
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_generated_secret

# Generate secret:
openssl rand -base64 32
```

#### 3. Seed Admin User
```powershell
cd apps/api
npx tsx prisma/seed-admin.ts
```

#### 4. Test Authentication
```powershell
# Start services
npm run dev:api
npm run dev:web

# Open browser
# http://localhost:3000/login
# Sign in with GitHub
# Try accessing http://localhost:3000/admin
```

#### 5. Verify Admin Protection
- Regular user should NOT access `/admin`
- Admin user (admin@yellbook.com) SHOULD access `/admin`
- Check role in session: `session.user.role`

### Files Modified/Created
- ✅ `apps/api/prisma/schema.prisma` - Added UserRole enum, role field
- ✅ `apps/web/src/lib/auth.ts` - NextAuth configuration
- ✅ `apps/web/src/lib/server-auth.ts` - Admin protection
- ✅ `apps/api/prisma/seed-admin.ts` - Admin seeding
- ✅ `apps/web/src/app/admin/layout.tsx` - Protected layout
- ✅ `apps/web/src/app/login/LoginClient.tsx` - Login UI

---

## Lab 9: AI Search ✅

### Implemented Features
- ✅ Embedding field in YellowBookEntry
- ✅ Offline embedding script
- ✅ AI search endpoint with Redis cache
- ✅ Cosine similarity search
- ✅ Assistant UI page

### Verification Steps

#### 1. Get OpenAI API Key
1. Go to: https://platform.openai.com/api-keys
2. Create new key
3. Add to `.env`:
```bash
OPENAI_API_KEY=sk-...
```

#### 2. Generate Embeddings
```powershell
cd apps/api
npx tsx prisma/scripts/embed-businesses.ts
```

This will:
- Load all businesses from database
- Generate embeddings using OpenAI API
- Store embeddings in database
- Show progress

#### 3. Test AI Search API
```powershell
# Start API
npm run dev:api

# Test endpoint
curl -X POST http://localhost:3001/api/ai/yellow-books/search \
  -H "Content-Type: application/json" \
  -d '{"query": "coffee shop near central"}'
```

#### 4. Test UI
```powershell
# Start web
npm run dev:web

# Open browser
http://localhost:3000/yellow-books/assistant

# Try queries:
# - "where can I get coffee?"
# - "hospitals in Ulaanbaatar"
# - "best restaurants"
```

#### 5. Verify Redis Caching
```powershell
# Connect to Redis
docker exec -it yellbook-redis redis-cli

# Check keys
KEYS ai-search:*

# Get cached result
GET "ai-search:coffee shop"
```

### Files Implemented
- ✅ `apps/api/prisma/schema.prisma` - embedding field
- ✅ `apps/api/src/app/routes/ai-search.ts` - Search endpoint
- ✅ `apps/api/prisma/scripts/embed-businesses.ts` - Embedding script
- ✅ `apps/web/src/app/yellow-books/assistant/page.tsx` - UI

---

## Complete Verification Checklist

### Lab 6 (100 points + 10 bonus)
- [ ] Dockerfiles build successfully locally
- [ ] AWS CLI installed and configured
- [ ] ECR repositories created
- [ ] GitHub secrets configured
- [ ] CI/CD runs successfully (green)
- [ ] Images pushed to ECR with SHA tags
- [ ] Screenshots captured

### Lab 7 (100 points)
- [ ] EKS cluster created
- [ ] OIDC configured
- [ ] All manifests deployed
- [ ] Pods running successfully
- [ ] Ingress with TLS configured
- [ ] Migration job completed
- [ ] HPA configured
- [ ] Public HTTPS URL works

### Lab 8 (5 points)
- [ ] GitHub OAuth app created
- [ ] Environment variables configured
- [ ] Admin user seeded
- [ ] Login works
- [ ] Admin routes protected
- [ ] Regular users blocked from admin
- [ ] Admin users can access admin panel

### Lab 9 (5 points)
- [ ] OpenAI API key configured
- [ ] Embeddings generated for all businesses
- [ ] AI search API works
- [ ] Redis caching works
- [ ] Assistant UI works
- [ ] Search returns relevant results

---

## Quick Test Commands

### Full Stack Local Test
```powershell
# Start all services
docker-compose up -d

# Run migrations
cd apps/api
npx prisma migrate deploy

# Seed data
npx tsx prisma/seed.ts
npx tsx prisma/seed-admin.ts

# Generate embeddings
npx tsx prisma/scripts/embed-businesses.ts

# Start dev servers
npm run dev:api   # Terminal 1
npm run dev:web   # Terminal 2

# Test endpoints
# http://localhost:3000 - Web app
# http://localhost:3001/api/hello - API health
# http://localhost:3000/login - OAuth login
# http://localhost:3000/admin - Admin panel (after login as admin)
# http://localhost:3000/yellow-books/assistant - AI search
```

### Environment Variables Checklist
```bash
# .env (root)
POSTGRES_PASSWORD=yellbook
NEXTAUTH_SECRET=<generate with: openssl rand -base64 32>
JWT_SECRET=<generate with: openssl rand -base64 32>

# apps/web/.env.local
GITHUB_ID=<your_github_oauth_client_id>
GITHUB_SECRET=<your_github_oauth_secret>
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=<same as root .env>
NEXT_PUBLIC_BACKEND_URL=http://localhost:3001

# apps/api/.env
DATABASE_URL=postgresql://yellbook:yellbook@127.0.0.1:5432/yellbook
OPENAI_API_KEY=<your_openai_api_key>
REDIS_HOST=127.0.0.1
REDIS_PORT=6379
```

---

## Troubleshooting

### Docker Build Fails
- Check Docker Desktop is running
- Run `docker system prune` to clean up
- Ensure enough disk space

### AWS CLI Issues
- Verify installation: `aws --version`
- Configure credentials: `aws configure`
- Test: `aws sts get-caller-identity`

### GitHub OAuth Fails
- Verify callback URL matches exactly
- Check GITHUB_ID and GITHUB_SECRET
- Ensure NEXTAUTH_SECRET is set

### AI Search Not Working
- Verify OPENAI_API_KEY is valid
- Check embeddings exist: `SELECT COUNT(*) FROM "YellowBookEntry" WHERE embedding IS NOT NULL;`
- Verify Redis is running: `docker ps | findstr redis`

### EKS Deployment Issues
- Check AWS credentials and region
- Verify ECR images are pushed
- Check pod logs: `kubectl logs -n yellowbooks <pod-name>`
- Describe pod: `kubectl describe pod -n yellowbooks <pod-name>`
