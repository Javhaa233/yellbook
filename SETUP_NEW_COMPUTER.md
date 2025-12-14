# Setting up YellBook on a Brand New Computer
## (No programming tools installed - Complete beginner guide)

---

## ⚠️ READ THIS FIRST

This computer needs:
- ✅ Windows 10 or 11
- ✅ Internet connection
- ✅ Administrator access (ability to install programs)
- ⏱️ **1-2 hours total setup time**

---

## Part 1: Install Required Software (45-60 minutes)

### Before You Start - Open PowerShell

**PowerShell is where you type commands. Here's how to open it:**

1. Click **Windows Start button** (bottom left)
2. Type: `powershell`
3. You'll see **"Windows PowerShell"** appear
4. **Right-click** on it
5. Select **"Run as administrator"**
6. Click **"Yes"** when asked for permission
7. You'll see a blue window with white text - this is PowerShell!

**Keep this window open!** You'll use it throughout this guide.

---

## Step 1: Install Node.js (JavaScript Runtime) - 10 minutes

**What is Node.js?** It's the software that runs JavaScript code on your computer (not just in browser).

**Installation Steps:**

1. **Open your web browser** (Chrome, Edge, Firefox)
2. **Go to:** https://nodejs.org/
3. You'll see a green button that says **"Download Node.js (LTS)"**
4. Click the **green button** (it will say something like "20.11.0 LTS")
5. **Wait** for the file to download (about 30 MB)
6. **Find** the downloaded file:
---

## Step 2: Install Git (Version Control) - 10 minutes

**What is Git?** It's software that downloads code from GitHub and tracks changes.

**Installation Steps:**

1. **Open browser** and go to: https://git-scm.com/download/win
2. The download should **start automatically**
   - If not, click the blue **"Click here to download manually"** link
3. **Wait** for download (about 50 MB)
4. **Find** the file: `Git-2.x.x-64-bit.exe` in Downloads
5. **Double-click** to run installer
6. **Important screens:**
   - **"Select Components"** - keep all checkboxes as they are, click Next
   - **"Choosing the default editor"** - select "Use Notepad", click Next
   - **"Adjusting PATH environment"** - select **"Git from the command line and also from 3rd-party software"** ⚠️ IMPORTANT!
   - **"Choosing HTTPS transport"** - keep default, click Next
   - **"Configuring line endings"** - keep default, click Next
   - All other screens - just click **Next**
7. Click **"Install"**
8. **Wait 2-3 minutes**
9. **Uncheck** "View Release Notes"
10. Click **"Finish"**

**Verify Installation:**

1. **Close** and **re-open** PowerShell (as administrator)
2. Type and press Enter:
   ```powershell
   git --version
   ```
3. Should see: `git version 2.43.0` or similar

**✅ If you see version - SUCCESS!**fy Installation:**

---

## Step 3: Install Docker Desktop (Container Platform) - 15 minutes

**What is Docker?** It runs PostgreSQL database and Redis cache in isolated containers.

**Important:** Your computer needs Windows 10/11 Pro, Enterprise, or Education. If you have Windows Home, you need to enable WSL2 first.

**Installation Steps:**

1. **Open browser** and go to: https://www.docker.com/products/docker-desktop/
2. Click the big blue button: **"Download for Windows"**
3. **Wait** for download (about 600 MB - may take 5-10 minutes)
4. **Find** file: `Docker Desktop Installer.exe` in Downloads
5. **Double-click** to run installer
6. **Check** the box: "Use WSL 2 instead of Hyper-V" (if shown)
7. Click **"OK"**
8. **Wait 5-10 minutes** for installation
9. You'll see: **"Installation succeeded"**
10. Click **"Close and restart"**
11. **Your computer will RESTART** - this is normal!

**After Computer Restarts:**

1. **Docker Desktop** will open automatically
2. You'll see **"Docker Subscription Service Agreement"**
3. Click **"Accept"**
4. **Choose:** "Use recommended settings"
5. Click **"Finish"**
6. **Wait** for "Docker Desktop is running" message (1-2 minutes)
7. You'll see a 🐋 whale icon in your system tray (bottom-right)

**Verify Installation:**

1. **Open PowerShell** (as administrator)
2. Type and press Enter:
   ```powershell
   docker --version
---

## Step 4: Install VS Code (Code Editor) - OPTIONAL but Recommended - 5 minutes

**What is VS Code?** A text editor for code. Makes it easier to view and edit files.

**You can skip this if you want to use Notepad.**

**Installation Steps:**

---

## ✅ CHECKPOINT: Prerequisites Complete!

**Before moving on, make sure all commands work:**

Open PowerShell and run these commands:
```powershell
node --version     # Should show v20.x.x
npm --version      # Should show 10.x.x  
git --version      # Should show git version 2.x.x
docker --version   # Should show Docker version 24.x.x
docker ps          # Should show empty table (no errors)
```

**If ANY command fails:**
1. Restart your computer
2. Open PowerShell again
3. Try the commands again
4. If still failing, re-install that specific software

---

# Part 2: Download and Setup Project (15 minutes)

**Now we'll download the YellBook project code from GitHub.**

---

## Step 5: Create a Folder for Projects

**In PowerShell, type these commands one by one:**

```powershell
# Go to C: drive
cd C:\

# Create a folder called "projects"
mkdir projects

# Go into that folder
cd projects

# Check where you are (should show C:\projects)
pwd
```

**You should see:** `C:\projects`

---

## Step 6: Download the Project from GitHub

**In PowerShell, type this command:**

```powershell
git clone https://github.com/Javhaa233/yellbook.git
```

**What you'll see:**
```
Cloning into 'yellbook'...
remote: Counting objects: 100% (1234/1234)
remote: Compressing objects: 100% (567/567)
Receiving objects: 100% (1234/1234), 5.67 MiB | 2.34 MiB/s, done.
```

**This takes 1-2 minutes depending on your internet speed.**

**When done, type:**
```powershell
cd yellbook
```

**You're now inside the project folder!**

---

## Step 7: Install Project Dependencies

**This downloads all the libraries and packages the project needs.**

**In PowerShell, type:**
```powershell
npm install
```

**What you'll see:**
```
npm WARN deprecated ...
added 2456 packages in 3m
```

**⏱️ This takes 5-10 minutes!** Go get coffee ☕

**When done, you'll see your command prompt again.**Download Git installer
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

---

## Step 13: Open the Application in Your Browser

**Now the app is running! Let's test it.**

1. **Open** your web browser (Chrome, Edge, Firefox)
2. **Go to:** http://localhost:3000

**You should see the YellBook homepage!**

---

### Test 1: Basic Homepage
- ✅ You should see businesses listed
- ✅ You can click on a business to see details
- ✅ Navigation menu at the top works

### Test 2: OAuth Login
1. Click **"Sign In"** button (top right)
2. Click **"Sign in with GitHub"**
3. **Log in with your GitHub account**
4. You should be **redirected back** to the website
5. You should see **your GitHub avatar** in the top right

### Test 3: AI Search
1. **Go to:** http://localhost:3000/yellow-books/search
2. **Type:** "restaurant in Ulaanbaatar"
3. Press **Enter**
4. You should see **a list of restaurants**

### Test 4: API Health Check
1. **Go to:** http://localhost:3001/health
2. You should see: `{"status":"ok"}`

---

## 🎉 SUCCESS! Everything is Working!

**Your YellBook application is now running!**

To stop the servers:
- Go to each PowerShell window
- Press **Ctrl + C**
- Type **Y** and press Enter

To start again later:
1. Start Docker Desktop
2. Run `npm run start:api` in Terminal 1
3. Run `npm run start:web` in Terminal 2

---

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
