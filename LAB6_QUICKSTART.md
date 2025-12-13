# Lab 6 Quick Start Guide

## Step 1: Install AWS CLI (5 minutes)

1. Download AWS CLI v2 installer:
   - Direct link: https://awscli.amazonaws.com/AWSCLIV2.msi
   - Or visit: https://aws.amazon.com/cli/

2. Run the installer (accept defaults)

3. **Restart PowerShell** after installation

4. Verify installation:
   ```powershell
   aws --version
   # Should show: aws-cli/2.x.x
   ```

---

## Step 2: Configure AWS Credentials (5 minutes)

1. Get your AWS credentials from AWS Console:
   - Go to: https://console.aws.amazon.com/iam/
   - Navigate to: Users → Your User → Security Credentials
   - Create Access Key if you don't have one

2. Configure AWS CLI:
   ```powershell
   aws configure
   ```
   
   Enter when prompted:
   - **AWS Access Key ID**: `<your-access-key-id>`
   - **AWS Secret Access Key**: `<your-secret-access-key>`
   - **Default region**: `ap-southeast-1`
   - **Default output format**: `json`

3. Test configuration:
   ```powershell
   aws sts get-caller-identity
   ```
   
   Should return your AWS account info.

---

## Step 3: Create ECR Repositories (5 minutes)

### Option A: Using the automated script
```powershell
cd c:\hicheel\web\yellbook
.\scripts\setup-ecr.ps1
```

### Option B: Manual creation via AWS CLI
```powershell
# Create API repository
aws ecr create-repository `
    --repository-name yellbook/api `
    --region ap-southeast-1 `
    --image-scanning-configuration scanOnPush=true `
    --encryption-configuration encryptionType=AES256

# Create Web repository
aws ecr create-repository `
    --repository-name yellbook/web `
    --region ap-southeast-1 `
    --image-scanning-configuration scanOnPush=true `
    --encryption-configuration encryptionType=AES256

# List repositories to verify
aws ecr describe-repositories --region ap-southeast-1
```

### Option C: Using AWS Console
1. Go to: https://console.aws.amazon.com/ecr/
2. Click **"Create repository"**
3. Repository name: `yellbook/api`
4. ✓ Enable **"Scan on push"**
5. Encryption: **AES256**
6. Click **"Create repository"**
7. Repeat for `yellbook/web`

---

## Step 4: Get AWS Account ID (1 minute)

```powershell
aws sts get-caller-identity --query Account --output text
```

Copy this number - you'll need it for GitHub secrets.

---

## Step 5: Configure GitHub Secrets (5 minutes)

1. Go to your GitHub repository:
   https://github.com/Javhaa233/yellbook/settings/secrets/actions

2. Click **"New repository secret"** for each:

   **Secret 1:**
   - Name: `AWS_ACCESS_KEY_ID`
   - Value: `<your-aws-access-key-id>`

   **Secret 2:**
   - Name: `AWS_SECRET_ACCESS_KEY`
   - Value: `<your-aws-secret-access-key>`

   **Secret 3:**
   - Name: `AWS_ACCOUNT_ID`
   - Value: `<your-account-id-from-step-4>`

   **Secret 4:**
   - Name: `AWS_REGION`
   - Value: `ap-southeast-1`

---

## Step 6: Test Docker Builds Locally (10 minutes)

```powershell
cd c:\hicheel\web\yellbook

# Build API image
docker build -f Dockerfile.api -t yellbook-api:test .

# Build Web image  
docker build -f Dockerfile.web -t yellbook-web:test .

# Verify images
docker images | findstr yellbook
```

---

## Step 7: Push to ECR Manually (Optional Test)

```powershell
# Get your account ID
$ACCOUNT_ID = aws sts get-caller-identity --query Account --output text

# Login to ECR
aws ecr get-login-password --region ap-southeast-1 | docker login --username AWS --password-stdin "$ACCOUNT_ID.dkr.ecr.ap-southeast-1.amazonaws.com"

# Tag images
docker tag yellbook-api:test "$ACCOUNT_ID.dkr.ecr.ap-southeast-1.amazonaws.com/yellbook/api:test"
docker tag yellbook-web:test "$ACCOUNT_ID.dkr.ecr.ap-southeast-1.amazonaws.com/yellbook/web:test"

# Push to ECR
docker push "$ACCOUNT_ID.dkr.ecr.ap-southeast-1.amazonaws.com/yellbook/api:test"
docker push "$ACCOUNT_ID.dkr.ecr.ap-southeast-1.amazonaws.com/yellbook/web:test"
```

---

## Step 8: Trigger CI/CD Pipeline (2 minutes)

```powershell
cd c:\hicheel\web\yellbook

# Commit the API key change
git add .env apps/web/.env.local
git commit -m "Add Gemini API key for Lab 9"

# Trigger CI/CD
git push origin main
```

---

## Step 9: Monitor CI/CD Run (5 minutes)

1. Go to: https://github.com/Javhaa233/yellbook/actions

2. Watch the workflow run:
   - ✓ `lint-and-build` job
   - ✓ `docker-build-push (api)` job
   - ✓ `docker-build-push (web)` job
   - ✓ `security-scan` job
   - ✓ `health-check` job

3. Wait for all jobs to turn green ✓

---

## Step 10: Verify ECR Images (3 minutes)

### Via AWS Console:
1. Go to: https://console.aws.amazon.com/ecr/
2. Region: **ap-southeast-1**
3. Click on `yellbook/api`
4. You should see images with tags like:
   - `<git-sha>` (e.g., `1a3f439`)
   - `latest`
5. Repeat for `yellbook/web`

### Via AWS CLI:
```powershell
# List API images
aws ecr describe-images --repository-name yellbook/api --region ap-southeast-1

# List Web images
aws ecr describe-images --repository-name yellbook/web --region ap-southeast-1
```

---

## Step 11: Capture Screenshots (5 minutes)

### Screenshot 1: GitHub Actions Success
- URL: https://github.com/Javhaa233/yellbook/actions
- Show: Latest workflow run with all green checkmarks
- File name: `lab6-ci-success.png`

### Screenshot 2: ECR API Repository
- URL: https://console.aws.amazon.com/ecr/
- Show: `yellbook/api` with images and SHA tags visible
- File name: `lab6-ecr-api.png`

### Screenshot 3: ECR Web Repository
- URL: https://console.aws.amazon.com/ecr/
- Show: `yellbook/web` with images and SHA tags visible
- File name: `lab6-ecr-web.png`

### Screenshot 4: README Badge
- URL: https://github.com/Javhaa233/yellbook
- Show: README with green CI/CD badge
- File name: `lab6-readme-badge.png`

---

## Troubleshooting

### AWS CLI not found after installation
```powershell
# Restart PowerShell, then try:
& "C:\Program Files\Amazon\AWSCLIV2\aws.exe" --version

# If that works, add to PATH or use full path
```

### ECR login fails
```powershell
# Verify credentials
aws sts get-caller-identity

# Try login again with explicit region
aws ecr get-login-password --region ap-southeast-1 | docker login --username AWS --password-stdin <account-id>.dkr.ecr.ap-southeast-1.amazonaws.com
```

### Docker build fails
```powershell
# Clean up Docker
docker system prune -a

# Ensure Docker Desktop is running
docker ps

# Try build again
docker build -f Dockerfile.api -t yellbook-api:test .
```

### CI/CD fails
- Check GitHub Actions logs for specific errors
- Verify all 4 GitHub secrets are set correctly
- Ensure ECR repositories exist
- Check AWS credentials are valid

---

## Lab 6 Deliverables Checklist

- [ ] Repo link: https://github.com/Javhaa233/yellbook
- [ ] CI run link (green): https://github.com/Javhaa233/yellbook/actions/runs/<run-id>
- [ ] ECR screenshot: API repository with SHA tags
- [ ] ECR screenshot: Web repository with SHA tags
- [ ] README badge showing green CI status

---

## Expected Time: ~45 minutes total

- AWS CLI setup: 10 min
- ECR creation: 5 min  
- GitHub secrets: 5 min
- Docker builds: 10 min
- CI/CD run: 10 min
- Screenshots: 5 min

---

## After Lab 6 is Complete

You'll have:
- ✅ 110/220 points (50%)
- ✅ Docker images in AWS ECR
- ✅ Automated CI/CD pipeline
- ✅ Ready for Lab 7 (EKS deployment)

Next: Deploy to Kubernetes (Lab 7)
