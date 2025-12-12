# AWS ECR Setup Script for YellBook
# This script creates ECR repositories for the API and Web images

param(
    [string]$Region = "ap-southeast-1",
    [string]$Profile = "default"
)

Write-Host "Setting up AWS ECR repositories for YellBook" -ForegroundColor Cyan
Write-Host "Region: $Region" -ForegroundColor Yellow
Write-Host ""

# Function to create ECR repository
function New-ECRRepository {
    param(
        [string]$RepoName,
        [string]$Region,
        [string]$Profile
    )
    
    Write-Host "Creating repository: $RepoName" -ForegroundColor Cyan
    
    try {
        $result = aws ecr create-repository `
            --repository-name $RepoName `
            --region $Region `
            --profile $Profile `
            --image-scanning-configuration scanOnPush=true `
            --encryption-configuration encryptionType=AES256 `
            --output json 2>&1
        
        if ($LASTEXITCODE -eq 0) {
            $repoData = $result | ConvertFrom-Json
            Write-Host "Repository created successfully!" -ForegroundColor Green
            Write-Host "   URI: $($repoData.repository.repositoryUri)" -ForegroundColor Gray
            return $repoData.repository
        } else {
            if ($result -match "RepositoryAlreadyExistsException") {
                Write-Host "Repository already exists" -ForegroundColor Yellow
                # Get existing repository info
                $existingRepo = aws ecr describe-repositories `
                    --repository-names $RepoName `
                    --region $Region `
                    --profile $Profile `
                    --output json | ConvertFrom-Json
                return $existingRepo.repositories[0]
            } else {
                Write-Host "Error: $result" -ForegroundColor Red
                return $null
            }
        }
    } catch {
        Write-Host "Error creating repository: $_" -ForegroundColor Red
        return $null
    }
}


# Function to set lifecycle policy
function Set-ECRLifecyclePolicy {
    param(
        [string]$RepoName,
        [string]$Region,
        [string]$Profile
    )
    
    $lifecyclePolicy = @{
        rules = @(
            @{
                rulePriority = 1
                description = "Keep last 10 images"
                selection = @{
                    tagStatus = "any"
                    countType = "imageCountMoreThan"
                    countNumber = 10
                }
                action = @{
                    type = "expire"
                }
            }
        )
    } | ConvertTo-Json -Depth 10 -Compress
    
    try {
        aws ecr put-lifecycle-policy `
            --repository-name $RepoName `
            --region $Region `
            --profile $Profile `
            --lifecycle-policy-text $lifecyclePolicy | Out-Null
        Write-Host "Lifecycle policy set for $RepoName" -ForegroundColor Green
    } catch {
        Write-Host "Could not set lifecycle policy: $_" -ForegroundColor Yellow
    }
}

# Create repositories
$apiRepo = New-ECRRepository -RepoName "yellbook/api" -Region $Region -Profile $Profile
$webRepo = New-ECRRepository -RepoName "yellbook/web" -Region $Region -Profile $Profile

Write-Host ""
Write-Host "============================================================" -ForegroundColor Gray

# Set lifecycle policies
if ($apiRepo) {
    Set-ECRLifecyclePolicy -RepoName "yellbook/api" -Region $Region -Profile $Profile
}
if ($webRepo) {
    Set-ECRLifecyclePolicy -RepoName "yellbook/web" -Region $Region -Profile $Profile
}

Write-Host ""
Write-Host "============================================================" -ForegroundColor Gray
Write-Host ""

# List all repositories
Write-Host "All ECR Repositories:" -ForegroundColor Cyan
try {
    $repos = aws ecr describe-repositories --region $Region --profile $Profile --output json | ConvertFrom-Json
    foreach ($repo in $repos.repositories) {
        if ($repo.repositoryName -like "yellbook/*") {
            Write-Host "  $($repo.repositoryName)" -ForegroundColor Green
            Write-Host "    URI: $($repo.repositoryUri)" -ForegroundColor Gray
        }
    }
} catch {
    Write-Host "Error listing repositories: $_" -ForegroundColor Red
}

Write-Host ""
Write-Host "============================================================" -ForegroundColor Gray
Write-Host ""

# Get AWS Account ID for GitHub secrets
Write-Host "GitHub Secrets Configuration:" -ForegroundColor Cyan
try {
    $accountId = aws sts get-caller-identity --query Account --output text --profile $Profile
    Write-Host "Add these secrets to your GitHub repository:" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "AWS_ACCOUNT_ID: $accountId" -ForegroundColor White
    Write-Host "AWS_REGION: $Region" -ForegroundColor White
    Write-Host "AWS_ACCESS_KEY_ID: <your-access-key-id>" -ForegroundColor White
    Write-Host "AWS_SECRET_ACCESS_KEY: <your-secret-access-key>" -ForegroundColor White
    Write-Host ""
    Write-Host "Go to: https://github.com/Javhaa233/yellbook/settings/secrets/actions" -ForegroundColor Cyan
} catch {
    Write-Host "Could not get AWS account ID: $_" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "ECR setup complete!" -ForegroundColor Green

