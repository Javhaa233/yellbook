# Setting up YellBook on a Completely Fresh Computer

## Prerequisites Installation (30-45 minutes)

### Step 1: Install Node.js (Required)
1. Go to https://nodejs.org/
2. Download **Node.js 20 LTS** (or latest)
3. Run installer, click "Next" through all steps
4. Verify installation:
   ```bash
   node --version   # Should show v20.x.x
   npm --version    # Should show 10.x.x
   ```

### Step 2: Install Git (Required)
1. Go to https://git-scm.com/download/win
2. Download Git installer
3. Run installer:
   - Select "Use Git from Git Bash and also from Windows Command Prompt"
   - Keep all other defaults
4. Verify:
   ```bash
   git --version    # Should show git version 2.x.x
   ```

### Step 3: Install Docker Desktop (Required)
1. Go to https://www.docker.com/products/docker-desktop/
2. Download Docker Desktop for Windows
3. Run installer
4. Restart computer when prompted
5. Open Docker Desktop and complete setup
6. Verify:
   ```bash
   docker --version        # Should show Docker version 24.x or higher
   docker-compose --version
   ```

### Step 4: Install VS Code (Recommended)
1. Go to https://code.visualstudio.com/
2. Download VS Code for Windows
3. Run installer
4. Install recommended extensions:
   - ESLint
   - Prettier
   - Prisma
   - Docker

### Step 5: Install AWS CLI (For deployment only)
1. Go to https://aws.amazon.com/cli/
2. Download AWS CLI MSI installer
3. Run installer
4. Verify:
   ```bash
   aws --version    # Should show aws-cli/2.x.x
   ```

---

## Project Setup (10 minutes)

### 1. Clone the repository
```bash
# Open PowerShell or Git Bash
cd C:\
mkdir projects
cd projects

git clone https://github.com/Javhaa233/yellbook.git
cd yellbook
```

### 2. Install dependencies
```bash
npm install
```

### 3. Setup environment variables

#### Create Web environment file (apps/web/.env.local)
```bash
# In PowerShell, from yellbook directory:
cd apps\web

# Create .env.local file - copy this content:
New-Item -Path .env.local -ItemType File
```

**Paste this into apps/web/.env.local:**
```
GITHUB_ID=Ov23liop79G4zXAGScKW
GITHUB_SECRET=Iv1.09f12bfb8a0e8b8c
NEXTAUTH_SECRET=generated-secret-key-here
NEXTAUTH_URL=http://localhost:3000
NEXT_PUBLIC_BACKEND_URL=http://localhost:3001
OPENAI_API_KEY=AIzaSyAoshWo51380CmS2wFMEQG5Rag-qDK21Y0
```

#### Create API enviDesktop
1. **Open Docker Desktop** from Start menu
2. Wait until Docker icon in system tray shows "Docker Desktop is running"
3. Verify in PowerShell:
   ```bash
   docker ps
   # Should show empty list (no errors)
   ```

### 5. Start Docker containers
```bash
# From yellbook directory
docker-compose up -d
```

**Expected output:**
```
✔ Network yellbook_default  Created
✔ Container yellbook-postgres-1  Started
✔ Container yellbook-redis-1     Started
```

**Verify containers are running:**
```bash
docker ps
# Should show 2 containers: postgres and redis
```

### 6. Run database migrations and seed
```bash
# Wait 10 seconds for database to fully start
Start-Sleep -Seconds 10

# Run migrations
npm run db:migrate

# Seed database with 25,000 businesses
npm run db:seed
```

**Expected output:**
```
✔ Migrations applied successfully
✔ Se8. Access the application

Open your browser and go to:
- 🌐 **Web App:** http://localhost:3000
- 🔧 **API Health Check:** http://localhost:3001/health
- 🔍 **AI Search Page:** http://localhost:3000/yellow-books/search

**Test OAuth Login:**
1. Go to http://localhost:3000
2. Click "Sign In"
3. Login with GitHub
4. You should see your GitHub avatar

**Test AI Search:**
1. Go to http://localhost:3000/yellow-books/search
2. Type: "restaurant in Ulaanbaatar"
3. Should return relevant businesses

✅ **If everything works - you're done!**
### 7. Start the application

**Terminal 1 - API Server:**
```bash
# Open PowerShell Terminal 1
cd C:\projects\yellbook
npm run start:api
```
**Wait for:** `Server listening at http://localhost:3001`

**Terminal 2 - Web Server:**
```bash
# Open PowerShell Terminal 2
cd C:\projects\yellbook
npm run start:web
```
**Wait for:** `✓ Ready in 5sGo back to root:**
```bash
cd ..\..
``` Common Issues

### ❌ "npm: command not found"
**Problem:** Node.js not installed or not in PATH
**Solution:**
1. Reinstall Node.js from https://nodejs.org/
2. **Check "Add to PATH" during installation**
3. Close and reopen PowerShell
4. Verify: `node --version`

### ❌ "docker: command not found"
**Problem:** Docker Desktop not running
**Solution:**
1. Open Docker Desktop from Start menu
2. Wait for green "Docker Desktop is running" status
3. Try again: `docker ps`

### ❌ Port 3000 or 3001 already in use
**Problem:** Another app is using these ports
**Solution:**
```powershell
# Find and kill process on port 3000
netstat -ano | findstr :3000
# Note the PID number
taskkill /PID <pid_number> /F

# Same for 3001
netstat -ano | findstr :3001
taskkill /PID <pid_number> /F
```

### ❌ "Cannot connect to database"
**Problem:** PostgreSQL container not running
**Solution:**
```bash
# Check container status
docker ps

# If not running, restart
docker-compose down
docker-compose up -d

# Wait 10 seconds, then check logs
docker-compose logs postgres
```

### ❌ "npm install" fails
**Problem:** Network issues or corrupted cache
**Solution:**
```bash
# Clear npm cache
npm cache clean --force

# Delete node_modules
Remove-Item -Recurse -Force node_modules
Remove-Item -Force package-lock.json

# Reinstall
npm install
```

### ❌ "Migration failed"
**Problem:** Database not ready or connection string wrong
**Solution:**
```bash
# Check DATABASE_URL in apps/api/.env
# Should be: postgresql://yellbook:yellbook@127.0.0.1:5432/yellbook

# Restart database
docker-compose restart postgres

# Wait 10 seconds
Start-Sleep -Seconds 10

# Try migration again
npm run db:migrate
```

### ❌ "ENOENT: no such file or directory"
**Problem:** Missing .env files
**Solution:**
1. Make sure you created both:
   - `apps/web/.env.local`
   - `apps/api/.env`
2. Check file names are **exactly** as shown (no .txt extension)
3. Use Notepad or VS Code to create them

### ❌ Can't access http://localhost:3000
**Problem:** Web server not started or crashed
**Solution:**
```bash
# Check if process is running
Get-Process -Name node -ErrorAction SilentlyContinue

# Check terminal for error messages
# Common issue: PORT 3000 in use
# Kill and restart:
npm run start:web
```

### ❌ "GitHub OAuth login fails"
**Problem:** Wrong callback URL or credentials
**Solution:**
1. Go to https://github.com/settings/developers
2. Click your OAuth App
3. Check "Authorization callback URL" is: `http://localhost:3000/api/auth/callback/github`
4. Copy Client ID and Secret again
5. Update `apps/web/.env.local`

### ❌ "AI Search returns no results"
**Problem:** Embeddings not generated
**Solution:**
```bash
# Check if businesses have embeddings
# Open http://localhost:3001/health

# Generate embeddings (takes 1-2 hours for 25,000 businesses)
cd apps/api
npx ts-node prisma/scripts/embed-businesses.ts
```

### 🆘 Still having issues?
1. **Check all prerequisites are installed:**
   - Node.js 20+: `node --version`
   - Docker: `docker --version`
   - Git: `git --version`

2. **Restart everything:**
   ```bash
   # Stop all
   docker-compose down
   # Kill node processes
   Get-Process -Name node | Stop-Process -Force
   
   # Start fresh
   docker-compose up -d
   Start-Sleep -Seconds 10
   npm run start:api    # Terminal 1
   npm run start:web    # Terminal 2
   ```

3. **Check the logs:**
   ```bash
   # Docker logs
   docker-compose logs
   
   # Look for errors in terminal output
   If you want to deploy to AWS on the new computer, you need:

### 1. Configure AWS CLI
```bash
aws configure
# Enter:
# AWS Access Key ID: <get from original computer>
# AWS Secret Access Key: <get from original computer>
# Default region: ap-southeast-1
```

**Note:** Get AWS credentials from original computer or contact team member.

### 2. Login to ECR
```bash
aws ecr get-login-password --region ap-southeast-1 | \
  docker login --username AWS --password-stdin \
  619425981538.dkr.ecr.ap-southeast-1.amazonaws.com
```

### 3. Build and push Docker images
```bash
docker build -f Dockerfile.api -t 619425981538.dkr.ecr.ap-southeast-1.amazonaws.com/yellbook/api:latest .
docker build -f Dockerfile.web -t 619425981538.dkr.ecr.ap-southeast-1.amazonaws.com/yellbook/web:latest .

docker push 619425981538.dkr.ecr.ap-southeast-1.amazonaws.com/yellbook/api:latest
docker push 619425981538.dkr.ecr.ap-southeast-1.amazonaws.com/yellbook/web:latest
```

---

## Troubleshooting

### Port conflicts
If ports 3000, 3001, 5432, 6379 are in use:
```bash
# Kill processes on those ports
lsof -ti:3000 | xargs kill -9
lsof -ti:3001 | xargs kill -9
```

### Docker not running
```bash
# Windows
Start-Process "C:\Program Files\Docker\Docker\Docker Desktop.exe"

# Mac/Linux
docker daemon
```

### Database connection refused
```bash
# Make sure postgres is running
docker-compose ps
docker-compose logs postgres
```

### Missing dependencies
```bash
# Reinstall everything
rm -rf node_modules package-lock.json
npm install
```

---

## Important Files to Know

```
yellbook/
├── apps/
│   ├── api/           # Fastify backend
│   │   ├── src/
│   │   │   ├── main.ts            # Entry point
│   │   │   ├── app/
│   │   │   │   ├── routes/        # API routes
│   │   │   │   ├── services/      # Business logic (AI search)
│   │   │   │   └── guards/        # Auth guards (role-based)
│   │   │   └── generated/         # Auto-generated (trpc, prisma)
│   │   └── prisma/
│   │       ├── schema.prisma      # Database schema (with role, embedding)
│   │       ├── seed.ts            # Seed 25,000 businesses
│   │       └── scripts/
│   │           └── embed-businesses.ts  # Generate embeddings
│   │
│   └── web/           # Next.js frontend
│       ├── src/
│       │   ├── app/
│       │   │   ├── api/auth/      # NextAuth routes
│       │   │   ├── [pages]/       # ISR/SSG/SSR pages
│       │   │   └── yellow-books/search  # AI search page
│       │   ├── lib/
│       │   │   ├── auth.ts        # Auth config
│       │   │   └── server-auth.ts # Server-side auth
│       │   └── components/        # Reusable components
│       └── .env.local             # Environment variables
│
├── docker-compose.yml            # Local development setup
├── Dockerfile.api                # API Docker build
├── Dockerfile.web                # Web Docker build
├── k8s/                          # Kubernetes manifests
│   ├── manifests/
│   │   ├── 00-namespace.yaml
│   │   ├── 01-configmap-secret.yaml
│   │   ├── 02-postgres.yaml
│   │   ├── 03-migration-job.yaml
│   │   ├── 04-api-deployment.yaml
│   │   ├── 05-web-deployment.yaml
│   │   ├── 06-hpa.yaml
│   │   └── 07-ingress.yaml
│   └── eks-cluster-cloudformation.yaml  # EKS setup
│
├── LABS_STATUS_REPORT.md         # Detailed lab status
├── README.md                     # Project overview
└── LABS_VERIFICATION.md          # Lab requirements checklist
```

---

## Lab Submission Checklist

### Lab 6 (Docker + CI/CD)
- [ ] GitHub repo link: https://github.com/Javhaa233/yellbook
- [ ] ECR images visible: ✅
- [ ] CI workflow ready (but needs green build)
- [ ] README badge added

### Lab 7 (EKS Deployment)
- [ ] EKS cluster status: ✅ CREATE_COMPLETE
- [ ] Kubernetes manifests deployed
- [ ] Screenshots of kubectl get pods
- [ ] DEPLOY.md documentation

### Lab 8 (OAuth)
- [ ] GitHub OAuth configured: ✅
- [ ] Admin user seeded: ✅
- [ ] Role-based access working: ✅
- [ ] Screenshots of login flow

### Lab 9 (AI Search)
- [ ] Embeddings generated: ✅
- [ ] AI search endpoint working: ✅
- [ ] Redis cache configured: ✅
- [ ] Search page functional: ✅
- [ ] Screenshots of search results

---

## Key Secrets to Save

**DO NOT commit these to GitHub!**

Copy these from your original computer or team member:
- **GITHUB_SECRET** - from GitHub OAuth App settings
- **AWS_SECRET_ACCESS_KEY** - from AWS IAM console
- **NEXTAUTH_SECRET** - generate fresh: `openssl rand -base64 32`
- **OPENAI_API_KEY** - Google Gemini API key (contact team)

---

## Questions?
- Check README.md for architecture overview
- Check LABS_STATUS_REPORT.md for current status
- Check individual LAB*_README.md files for detailed info
