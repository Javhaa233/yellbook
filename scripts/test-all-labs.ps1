# Quick Test Script for All Labs
# This script tests key functionality from each lab

param(
    [switch]$SkipDocker = $false,
    [switch]$SkipAI = $false
)

$ErrorActionPreference = "Continue"
$passed = 0
$failed = 0

function Test-Feature {
    param(
        [string]$Name,
        [scriptblock]$Test
    )
    
    Write-Host "`nTesting: $Name" -ForegroundColor Cyan
    try {
        & $Test
        Write-Host "✓ PASS: $Name" -ForegroundColor Green
        $script:passed++
        return $true
    } catch {
        Write-Host "✗ FAIL: $Name - $_" -ForegroundColor Red
        $script:failed++
        return $false
    }
}

Write-Host "=============================================================" -ForegroundColor Magenta
Write-Host "  YellBook Labs 6-9 Test Suite" -ForegroundColor Magenta
Write-Host "=============================================================" -ForegroundColor Magenta

# Lab 6: Docker & Build
Write-Host "`n--- Lab 6: Docker and CI/CD ---" -ForegroundColor Yellow

Test-Feature "Dockerfile.api exists" {
    if (-not (Test-Path "Dockerfile.api")) { throw "File not found" }
}

Test-Feature "Dockerfile.web exists" {
    if (-not (Test-Path "Dockerfile.web")) { throw "File not found" }
}

Test-Feature "CI workflow exists" {
    if (-not (Test-Path ".github/workflows/ci.yml")) { throw "File not found" }
}

Test-Feature "Docker Compose file valid" {
    if (-not (Test-Path "docker-compose.yml")) { throw "File not found" }
    docker-compose config | Out-Null
    if ($LASTEXITCODE -ne 0) { throw "Invalid docker-compose.yml" }
}

if (-not $SkipDocker) {
    Test-Feature "Docker images exist or can be listed" {
        docker images | Out-Null
        if ($LASTEXITCODE -ne 0) { throw "Docker not running" }
    }
}

# Lab 7: Kubernetes Manifests
Write-Host "`n--- Lab 7: Kubernetes Manifests ---" -ForegroundColor Yellow

$manifestFiles = @(
    "k8s/manifests/00-namespace.yaml",
    "k8s/manifests/01-configmap-secret.yaml",
    "k8s/manifests/02-postgres.yaml",
    "k8s/manifests/03-migration-job.yaml",
    "k8s/manifests/04-api-deployment.yaml",
    "k8s/manifests/05-web-deployment.yaml",
    "k8s/manifests/06-hpa.yaml",
    "k8s/manifests/07-ingress.yaml"
)

foreach ($manifest in $manifestFiles) {
    $filename = Split-Path $manifest -Leaf
    Test-Feature "Manifest: $filename" {
        if (-not (Test-Path $manifest)) { throw "File not found" }
    }
}

# Lab 8: Authentication
Write-Host "`n--- Lab 8: GitHub OAuth and Auth ---" -ForegroundColor Yellow

Test-Feature "Prisma schema has User model with role" {
    $schema = Get-Content "apps/api/prisma/schema.prisma" -Raw
    if ($schema -notmatch "model User") { throw "User model not found" }
    if ($schema -notmatch "role.*UserRole") { throw "Role field not found" }
    if ($schema -notmatch "enum UserRole") { throw "UserRole enum not found" }
}

Test-Feature "NextAuth configuration exists" {
    if (-not (Test-Path "apps/web/src/lib/auth.ts")) { throw "File not found" }
    $auth = Get-Content "apps/web/src/lib/auth.ts" -Raw
    if ($auth -notmatch "GitHubProvider") { throw "GitHub provider not configured" }
}

Test-Feature "Admin seeding script exists" {
    if (-not (Test-Path "apps/api/prisma/seed-admin.ts")) { throw "File not found" }
}

Test-Feature "Admin protection exists" {
    if (-not (Test-Path "apps/web/src/lib/server-auth.ts")) { throw "File not found" }
    $serverAuth = Get-Content "apps/web/src/lib/server-auth.ts" -Raw
    if ($serverAuth -notmatch "requireAdminSession") { throw "Admin protection not found" }
}

Test-Feature "Admin layout exists" {
    if (-not (Test-Path "apps/web/src/app/admin/layout.tsx")) { throw "File not found" }
}

Test-Feature "Login page exists" {
    if (-not (Test-Path "apps/web/src/app/login/LoginClient.tsx")) { throw "File not found" }
}

# Lab 9: AI Search
Write-Host "`n--- Lab 9: AI Search and Embeddings ---" -ForegroundColor Yellow

Test-Feature "Prisma schema has embedding field" {
    $schema = Get-Content "apps/api/prisma/schema.prisma" -Raw
    if ($schema -notmatch "embedding.*Float\[\]") { throw "Embedding field not found" }
}

Test-Feature "AI search route exists" {
    if (-not (Test-Path "apps/api/src/app/routes/ai-search.ts")) { throw "File not found" }
}

Test-Feature "Embedding script exists" {
    if (-not (Test-Path "apps/api/prisma/scripts/embed-businesses.ts")) { throw "File not found" }
}

Test-Feature "Assistant UI page exists" {
    if (-not (Test-Path "apps/web/src/app/yellow-books/assistant/page.tsx")) { throw "File not found" }
}

if (-not $SkipAI) {
    Test-Feature "AI search implementation has OpenAI integration" {
        $aiSearch = Get-Content "apps/api/src/app/routes/ai-search.ts" -Raw
        if ($aiSearch -notmatch "openai|embedding") { throw "OpenAI integration not found" }
        if ($aiSearch -notmatch "redis|cache") { throw "Redis caching not found" }
        if ($aiSearch -notmatch "cosine") { throw "Cosine similarity not found" }
    }
}

# Database checks
Write-Host "`n--- Database and Infrastructure ---" -ForegroundColor Yellow

Test-Feature "Database running" {
    $db = docker ps --filter "name=yellbook-db" --format "{{.Status}}"
    if (-not $db -or $db -notmatch "Up") { throw "Database not running" }
}

Test-Feature "Redis running" {
    $redis = docker ps --filter "name=yellbook-redis" --format "{{.Status}}"
    if (-not $redis -or $redis -notmatch "Up") { throw "Redis not running" }
}

# Environment checks
Write-Host "`n--- Configuration ---" -ForegroundColor Yellow

Test-Feature ".env file exists" {
    if (-not (Test-Path ".env")) { throw "File not found" }
}

Test-Feature ".env.example exists" {
    if (-not (Test-Path ".env.example")) { throw "File not found" }
}

Test-Feature "Web .env.local exists" {
    if (-not (Test-Path "apps/web/.env.local")) { throw "File not found" }
}

Test-Feature "API .env exists" {
    if (-not (Test-Path "apps/api/.env")) { throw "File not found" }
}

# Documentation checks
Write-Host "`n--- Documentation ---" -ForegroundColor Yellow

$docs = @(
    "README.md",
    "LAB6_CHECKLIST.md",
    "LABS_VERIFICATION.md",
    "ECR_SETUP.md"
)

foreach ($doc in $docs) {
    Test-Feature "Documentation: $doc" {
        if (-not (Test-Path $doc)) { throw "File not found" }
    }
}

# Summary
Write-Host "`n=============================================================" -ForegroundColor Magenta
Write-Host "  Test Results" -ForegroundColor Magenta
Write-Host "=============================================================" -ForegroundColor Magenta
Write-Host "`nPassed: $passed" -ForegroundColor Green
Write-Host "Failed: $failed" -ForegroundColor $(if ($failed -eq 0) { "Green" } else { "Red" })
Write-Host "`nTotal: $($passed + $failed) tests" -ForegroundColor Cyan

if ($failed -eq 0) {
    Write-Host "`n✓ All tests passed! Ready for deployment." -ForegroundColor Green
    exit 0
} else {
    Write-Host "`n⚠ Some tests failed. Please review the output above." -ForegroundColor Yellow
    exit 1
}
