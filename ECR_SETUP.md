# AWS ECR Setup Guide

This guide walks you through setting up Amazon Elastic Container Registry (ECR) for the YellBook project.

## Prerequisites

- AWS Account (use AWS Educate or regular AWS account)
- AWS CLI installed and configured
- Docker installed locally

## Step 1: Install AWS CLI

### Windows
```powershell
# Download and install AWS CLI from:
# https://awscli.amazonaws.com/AWSCLIV2.msi

# Verify installation
aws --version
```

### macOS
```bash
brew install awscli
aws --version
```

### Linux
```bash
curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip"
unzip awscliv2.zip
sudo ./aws/install
aws --version
```

## Step 2: Configure AWS CLI

```bash
aws configure
```

Enter your AWS credentials:
- AWS Access Key ID: `<your-access-key>`
- AWS Secret Access Key: `<your-secret-key>`
- Default region: `ap-southeast-1` (or your preferred region)
- Default output format: `json`

## Step 3: Create ECR Repositories

### Option A: Using PowerShell Script (Windows)

```powershell
cd c:\hicheel\web\yellbook
.\scripts\setup-ecr.ps1
```

### Option B: Using Python Script

```bash
cd scripts
python setup_ecr.py
```

### Option C: Manual Creation via AWS CLI

```bash
# Create API repository
aws ecr create-repository \
    --repository-name yellbook/api \
    --region ap-southeast-1 \
    --image-scanning-configuration scanOnPush=true \
    --encryption-configuration encryptionType=AES256

# Create Web repository
aws ecr create-repository \
    --repository-name yellbook/web \
    --region ap-southeast-1 \
    --image-scanning-configuration scanOnPush=true \
    --encryption-configuration encryptionType=AES256

# List repositories
aws ecr describe-repositories --region ap-southeast-1
```

### Option D: Using AWS Console

1. Go to [AWS ECR Console](https://console.aws.amazon.com/ecr/)
2. Click "Create repository"
3. Enter repository name: `yellbook/api`
4. Enable "Scan on push"
5. Select "AES256" encryption
6. Click "Create repository"
7. Repeat for `yellbook/web`

## Step 4: Set Lifecycle Policy (Optional)

To automatically delete old images and save storage costs:

```bash
# For API repository
aws ecr put-lifecycle-policy \
    --repository-name yellbook/api \
    --region ap-southeast-1 \
    --lifecycle-policy-text '{
  "rules": [{
    "rulePriority": 1,
    "description": "Keep last 10 images",
    "selection": {
      "tagStatus": "any",
      "countType": "imageCountMoreThan",
      "countNumber": 10
    },
    "action": {
      "type": "expire"
    }
  }]
}'

# For Web repository
aws ecr put-lifecycle-policy \
    --repository-name yellbook/web \
    --region ap-southeast-1 \
    --lifecycle-policy-text '{
  "rules": [{
    "rulePriority": 1,
    "description": "Keep last 10 images",
    "selection": {
      "tagStatus": "any",
      "countType": "imageCountMoreThan",
      "countNumber": 10
    },
    "action": {
      "type": "expire"
    }
  }]
}'
```

## Step 5: Get Repository URIs

```bash
aws ecr describe-repositories \
    --repository-names yellbook/api yellbook/web \
    --region ap-southeast-1 \
    --query 'repositories[*].[repositoryName,repositoryUri]' \
    --output table
```

Example output:
```
--------------------------------------------------------------------
|                      DescribeRepositories                        |
+----------------+-------------------------------------------------+
|  yellbook/api  |  123456789012.dkr.ecr.ap-southeast-1.amazonaws.com/yellbook/api  |
|  yellbook/web  |  123456789012.dkr.ecr.ap-southeast-1.amazonaws.com/yellbook/web  |
+----------------+-------------------------------------------------+
```

## Step 6: Configure GitHub Secrets

1. Get your AWS Account ID:
```bash
aws sts get-caller-identity --query Account --output text
```

2. Go to your GitHub repository:
   - https://github.com/Javhaa233/yellbook/settings/secrets/actions

3. Add the following secrets:
   - `AWS_ACCESS_KEY_ID`: Your AWS access key
   - `AWS_SECRET_ACCESS_KEY`: Your AWS secret key
   - `AWS_ACCOUNT_ID`: Your AWS account ID (from step 1)
   - `AWS_REGION`: `ap-southeast-1` (or your chosen region)

## Step 7: Test Local Docker Build and Push

```bash
# Login to ECR
aws ecr get-login-password --region ap-southeast-1 | docker login --username AWS --password-stdin <your-account-id>.dkr.ecr.ap-southeast-1.amazonaws.com

# Build and tag API image
docker build -f Dockerfile.api -t yellbook-api:test .
docker tag yellbook-api:test <your-account-id>.dkr.ecr.ap-southeast-1.amazonaws.com/yellbook/api:test

# Push to ECR
docker push <your-account-id>.dkr.ecr.ap-southeast-1.amazonaws.com/yellbook/api:test

# Build and tag Web image
docker build -f Dockerfile.web -t yellbook-web:test .
docker tag yellbook-web:test <your-account-id>.dkr.ecr.ap-southeast-1.amazonaws.com/yellbook/web:test

# Push to ECR
docker push <your-account-id>.dkr.ecr.ap-southeast-1.amazonaws.com/yellbook/web:test
```

## Step 8: Verify Images in ECR

```bash
# List images in API repository
aws ecr list-images --repository-name yellbook/api --region ap-southeast-1

# List images in Web repository
aws ecr list-images --repository-name yellbook/web --region ap-southeast-1

# Get detailed image info
aws ecr describe-images --repository-name yellbook/api --region ap-southeast-1
aws ecr describe-images --repository-name yellbook/web --region ap-southeast-1
```

## Troubleshooting

### Error: AWS CLI not found
- Ensure AWS CLI is installed and added to PATH
- Restart your terminal after installation

### Error: Unable to authenticate
- Run `aws configure` and enter valid credentials
- Verify credentials: `aws sts get-caller-identity`

### Error: Repository already exists
- This is safe to ignore if you're re-running the script
- The script will use the existing repository

### Error: Denied access to ECR
- Ensure your AWS user/role has ECR permissions
- Attach `AmazonEC2ContainerRegistryFullAccess` policy to your IAM user

## Cost Considerations

⚠️ **Important**: ECR charges for storage and data transfer. To minimize costs:

- Use lifecycle policies to delete old images
- Delete unused repositories when done
- Use AWS Educate credits if available
- Monitor usage in AWS Cost Explorer

## Cleanup (After Project Completion)

```bash
# Delete all images in repositories
aws ecr batch-delete-image \
    --repository-name yellbook/api \
    --region ap-southeast-1 \
    --image-ids "$(aws ecr list-images --repository-name yellbook/api --region ap-southeast-1 --query 'imageIds[*]' --output json)"

aws ecr batch-delete-image \
    --repository-name yellbook/web \
    --region ap-southeast-1 \
    --image-ids "$(aws ecr list-images --repository-name yellbook/web --region ap-southeast-1 --query 'imageIds[*]' --output json)"

# Delete repositories
aws ecr delete-repository --repository-name yellbook/api --region ap-southeast-1 --force
aws ecr delete-repository --repository-name yellbook/web --region ap-southeast-1 --force
```

## Next Steps

After ECR is set up:
1. ✅ Push code to GitHub
2. ✅ GitHub Actions will automatically build and push images
3. 📸 Take screenshots of ECR images with sha tags
4. 📝 Update README with CI badge and ECR info
5. 🚀 Ready for EKS deployment (Lab 7)
