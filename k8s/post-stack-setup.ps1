#!/usr/bin/env pwsh
<#
.SYNOPSIS
    Post-EKS-stack setup: updates kubeconfig, waits for cluster readiness, and deploys application
.DESCRIPTION
    Runs after CloudFormation stack reaches CREATE_COMPLETE
    - Updates kubeconfig
    - Waits for API server to be ready
    - Applies Kubernetes manifests
    - Checks pod status
#>

param(
    [string]$ClusterName = "yellbook-eks",
    [string]$Region = "ap-southeast-1",
    [string]$Namespace = "yellowbooks"
)

$ErrorActionPreference = "Stop"

Write-Host "`n=== EKS POST-STACK SETUP ===" -ForegroundColor Cyan
Write-Host "Cluster: $ClusterName | Region: $Region | Namespace: $Namespace`n" -ForegroundColor White

# Step 1: Update kubeconfig
Write-Host "1️⃣  Updating kubeconfig..." -ForegroundColor Yellow
try {
    aws eks update-kubeconfig --name $ClusterName --region $Region
    Write-Host "✅ Kubeconfig updated" -ForegroundColor Green
} catch {
    Write-Host "❌ Failed to update kubeconfig: $_" -ForegroundColor Red
    exit 1
}

# Step 2: Wait for API server to be ready
Write-Host "`n2️⃣  Waiting for Kubernetes API server..." -ForegroundColor Yellow
$maxAttempts = 60
for ($i = 1; $i -le $maxAttempts; $i++) {
    try {
        $info = kubectl cluster-info 2>$null
        if ($info) {
            Write-Host "✅ API server is ready" -ForegroundColor Green
            break
        }
    } catch {
        # Ignore errors until server is ready
    }
    
    if ($i % 10 -eq 0) {
        Write-Host "   ⏳ Attempt $i/$maxAttempts..." -ForegroundColor Cyan
    }
    Start-Sleep -Seconds 5
}

if ($i -gt $maxAttempts) {
    Write-Host "❌ API server did not become ready within $(($maxAttempts * 5) / 60) minutes" -ForegroundColor Red
    exit 1
}

# Step 3: Check nodes
Write-Host "`n3️⃣  Checking Fargate nodes..." -ForegroundColor Yellow
$nodes = kubectl get nodes --output=json 2>$null | ConvertFrom-Json | Select-Object -ExpandProperty items | Select-Object -ExpandProperty metadata | Select-Object name
Write-Host "   Nodes found: $($nodes.Count)" -ForegroundColor Cyan
foreach ($node in $nodes) {
    Write-Host "   - $($node.name)" -ForegroundColor Green
}

# Step 4: Create namespace
Write-Host "`n4️⃣  Creating namespace '$Namespace'..." -ForegroundColor Yellow
kubectl create namespace $Namespace --dry-run=client -o yaml | kubectl apply -f - 2>$null
Write-Host "✅ Namespace ready" -ForegroundColor Green

# Step 5: Apply manifests
Write-Host "`n5️⃣  Applying Kubernetes manifests..." -ForegroundColor Yellow
$manifestDir = Split-Path -Parent $PSCommandPath
$manifests = @(
    "00-namespace.yaml",
    "01-configmap-secret.yaml",
    "02-postgres.yaml",
    "03-migration-job.yaml",
    "04-api-deployment.yaml",
    "05-web-deployment.yaml",
    "06-hpa.yaml",
    "07-ingress.yaml"
)

foreach ($manifest in $manifests) {
    $path = Join-Path $manifestDir $manifest
    if (Test-Path $path) {
        Write-Host "   Applying $manifest..." -ForegroundColor Cyan
        kubectl apply -f $path -n $Namespace 2>$null
    } else {
        Write-Host "   ⚠️  Skipping $manifest (not found)" -ForegroundColor Yellow
    }
}

# Step 6: Monitor pod status
Write-Host "`n6️⃣  Checking pod status..." -ForegroundColor Yellow
Start-Sleep -Seconds 5
$pods = kubectl get pods -n $Namespace --output=json 2>$null | ConvertFrom-Json | Select-Object -ExpandProperty items
Write-Host "   Pods deployed: $($pods.Count)" -ForegroundColor Cyan
foreach ($pod in $pods) {
    $name = $pod.metadata.name
    $ready = $pod.status.conditions | Where-Object type -eq "Ready" | Select-Object -ExpandProperty status
    $status = $pod.status.phase
    $icon = if ($ready -eq "True") { "✅" } else { "⏳" }
    Write-Host "   $icon $name ($status)" -ForegroundColor $(if ($ready -eq "True") { "Green" } else { "Yellow" })
}

# Step 7: Summary
Write-Host "`n=== SETUP COMPLETE ===" -ForegroundColor Green
Write-Host "Cluster: $ClusterName (ap-southeast-1)" -ForegroundColor Cyan
Write-Host "Namespace: $Namespace" -ForegroundColor Cyan
Write-Host "`nNext steps:" -ForegroundColor Yellow
Write-Host "  1. Monitor pod creation:" -ForegroundColor White
Write-Host "     kubectl get pods -n $Namespace -w" -ForegroundColor Cyan
Write-Host "  2. Check Ingress:" -ForegroundColor White
Write-Host "     kubectl get ingress -n $Namespace" -ForegroundColor Cyan
Write-Host "  3. View logs:" -ForegroundColor White
Write-Host "     kubectl logs -f deployment/yellbook-api -n $Namespace" -ForegroundColor Cyan
Write-Host ""
