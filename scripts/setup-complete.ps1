# Complete Setup Script for YellBook Labs 6-9
# Run this script to set up everything locally

Write-Host "===========================================================" -ForegroundColor Cyan
Write-Host "  YellBook Complete Setup - Labs 6-9" -ForegroundColor Cyan
Write-Host "===========================================================" -ForegroundColor Cyan
Write-Host ""

# Check prerequisites
Write-Host "Checking prerequisites..." -ForegroundColor Yellow

# Check Node.js
try {
    $nodeVersion = node --version
    Write-Host "✓ Node.js: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "✗ Node.js not found. Please install Node.js 20.x" -ForegroundColor Red
    exit 1
}

# Check Docker
try {
    $dockerVersion = docker --version
    Write-Host "✓ Docker: $dockerVersion" -ForegroundColor Green
} catch {
    Write-Host "✗ Docker not found. Please install Docker Desktop" -ForegroundColor Red
    exit 1
}

# Check if Docker is running
try {
    docker ps | Out-Null
    Write-Host "✓ Docker daemon is running" -ForegroundColor Green
} catch {
    Write-Host "✗ Docker daemon not running. Please start Docker Desktop" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "===========================================================" -ForegroundColor Cyan
Write-Host "  Step 1: Install Dependencies" -ForegroundColor Cyan
Write-Host "===========================================================" -ForegroundColor Cyan

npm install
if ($LASTEXITCODE -ne 0) {
    Write-Host "✗ npm install failed" -ForegroundColor Red
    exit 1
}
Write-Host "✓ Dependencies installed" -ForegroundColor Green

Write-Host ""
Write-Host "===========================================================" -ForegroundColor Cyan
Write-Host "  Step 2: Start Database & Redis" -ForegroundColor Cyan
Write-Host "===========================================================" -ForegroundColor Cyan

docker-compose up -d db redis
if ($LASTEXITCODE -ne 0) {
    Write-Host "✗ Failed to start Docker services" -ForegroundColor Red
    exit 1
}

Write-Host "Waiting for database to be ready..."
Start-Sleep -Seconds 10

docker-compose ps
Write-Host "✓ Database and Redis started" -ForegroundColor Green

Write-Host ""
Write-Host "===========================================================" -ForegroundColor Cyan
Write-Host "  Step 3: Run Database Migrations" -ForegroundColor Cyan
Write-Host "===========================================================" -ForegroundColor Cyan

Set-Location apps/api
npx prisma generate --schema prisma/schema.prisma
npx prisma migrate deploy --schema prisma/schema.prisma

if ($LASTEXITCODE -ne 0) {
    Write-Host "✗ Migrations failed" -ForegroundColor Red
    Set-Location ..\..
    exit 1
}
Write-Host "✓ Migrations completed" -ForegroundColor Green

Write-Host ""
Write-Host "===========================================================" -ForegroundColor Cyan
Write-Host "  Step 4: Seed Database" -ForegroundColor Cyan
Write-Host "===========================================================" -ForegroundColor Cyan

Write-Host "Seeding sample data..." -ForegroundColor Yellow
npx tsx prisma/seed.ts

Write-Host "Seeding admin user..." -ForegroundColor Yellow
npx tsx prisma/seed-admin.ts

Write-Host "✓ Database seeded" -ForegroundColor Green

Set-Location ..\..

Write-Host ""
Write-Host "===========================================================" -ForegroundColor Cyan
Write-Host "  Step 5: Generate Embeddings (Lab 9)" -ForegroundColor Cyan
Write-Host "===========================================================" -ForegroundColor Cyan

$openaiKey = [Environment]::GetEnvironmentVariable("OPENAI_API_KEY")
if (-not $openaiKey) {
    Write-Host "⚠ OPENAI_API_KEY not set. Skipping embeddings." -ForegroundColor Yellow
    Write-Host "  To enable AI search later, set OPENAI_API_KEY and run:" -ForegroundColor Yellow
    Write-Host "  cd apps/api && npx tsx prisma/scripts/embed-businesses.ts" -ForegroundColor Yellow
} else {
    Write-Host "Generating embeddings (this may take a few minutes)..." -ForegroundColor Yellow
    Set-Location apps/api
    npx tsx prisma/scripts/embed-businesses.ts
    Set-Location ..\..
    Write-Host "✓ Embeddings generated" -ForegroundColor Green
}

Write-Host ""
Write-Host "===========================================================" -ForegroundColor Cyan
Write-Host "  Step 6: Build Docker Images (Lab 6)" -ForegroundColor Cyan
Write-Host "===========================================================" -ForegroundColor Cyan

Write-Host "Building API image..." -ForegroundColor Yellow
docker build -f Dockerfile.api -t yellbook-api:local .
if ($LASTEXITCODE -ne 0) {
    Write-Host "✗ API image build failed" -ForegroundColor Red
    exit 1
}
Write-Host "✓ API image built" -ForegroundColor Green

Write-Host "Building Web image..." -ForegroundColor Yellow
docker build -f Dockerfile.web -t yellbook-web:local .
if ($LASTEXITCODE -ne 0) {
    Write-Host "✗ Web image build failed" -ForegroundColor Red
    exit 1
}
Write-Host "✓ Web image built" -ForegroundColor Green

Write-Host ""
Write-Host "===========================================================" -ForegroundColor Cyan
Write-Host "  Setup Complete!" -ForegroundColor Cyan
Write-Host "===========================================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Yellow
Write-Host ""
Write-Host "1. Start development servers:" -ForegroundColor White
Write-Host "   Terminal 1: npm run dev:api" -ForegroundColor Gray
Write-Host "   Terminal 2: npm run dev:web" -ForegroundColor Gray
Write-Host ""
Write-Host "2. Access the application:" -ForegroundColor White
Write-Host "   Web:        http://localhost:3000" -ForegroundColor Gray
Write-Host "   API:        http://localhost:3001" -ForegroundColor Gray
Write-Host "   Login:      http://localhost:3000/login" -ForegroundColor Gray
Write-Host "   Admin:      http://localhost:3000/admin (after login as admin)" -ForegroundColor Gray
Write-Host "   AI Search:  http://localhost:3000/yellow-books/assistant" -ForegroundColor Gray
Write-Host ""
Write-Host "3. Admin credentials:" -ForegroundColor White
Write-Host "   Email: admin@yellbook.com" -ForegroundColor Gray
Write-Host "   (Login via GitHub OAuth, then the admin role will be applied)" -ForegroundColor Gray
Write-Host ""
Write-Host "4. Test Docker Compose:" -ForegroundColor White
Write-Host "   docker-compose up -d" -ForegroundColor Gray
Write-Host "   docker-compose ps" -ForegroundColor Gray
Write-Host ""
Write-Host "5. For Lab 6 ECR setup:" -ForegroundColor White
Write-Host "   - Install AWS CLI: https://awscli.amazonaws.com/AWSCLIV2.msi" -ForegroundColor Gray
Write-Host "   - Run: .\scripts\setup-ecr.ps1" -ForegroundColor Gray
Write-Host "   - Configure GitHub secrets" -ForegroundColor Gray
Write-Host "   - Push to trigger CI/CD" -ForegroundColor Gray
Write-Host ""
Write-Host "6. For Lab 7 EKS deployment:" -ForegroundColor White
Write-Host "   - See k8s/README.md for instructions" -ForegroundColor Gray
Write-Host ""
Write-Host "Documentation:" -ForegroundColor Yellow
Write-Host "   - LAB6_CHECKLIST.md    - Lab 6 completion guide" -ForegroundColor Gray
Write-Host "   - LABS_VERIFICATION.md - All labs verification guide" -ForegroundColor Gray
Write-Host "   - ECR_SETUP.md         - AWS ECR setup instructions" -ForegroundColor Gray
Write-Host ""
Write-Host "===========================================================" -ForegroundColor Cyan
