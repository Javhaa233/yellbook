# Lab 6 Submission Guide - Yellbook EKS Deployment

**Student**: Javkhaa Azjargal  
**GitHub**: https://github.com/Javhaa233/yellbook  
**Date**: December 14, 2025

---

## 📋 Required Deliverables Checklist

### ✅ 1. Public HTTPS URL + Screenshot (20 pts - Ingress/TLS)
**Status**: Need to verify/create

**Steps to get your URL:**
```powershell
kubectl get ingress -n yellowbooks -o wide
```

**Expected output**: ALB DNS name like `xxxxx-123456789.ap-southeast-1.elb.amazonaws.com`

**TODO**:
1. Access the URL in browser
2. Take screenshot showing:
   - Full URL in address bar
   - **Padlock icon** (for HTTPS/TLS)
   - Working website with business listings
3. Save as: `screenshots/lab6-https-url.png`

---

### ✅ 2. GitHub Actions Run Link (20 pts - OIDC/Roles)
**Repository**: https://github.com/Javhaa233/yellbook  
**Workflow File**: `.github/workflows/ci.yml` ✅  
**Workflow**: `deploy-eks.yml` (for EKS deployment)

**Steps to get the link:**
1. Go to: https://github.com/Javhaa233/yellbook/actions
2. Find the most recent successful workflow run
3. Click on it to get the full URL
4. Screenshot showing:
   - ✅ Green checkmarks for all jobs
   - Build succeeded
   - Deploy succeeded (if using deploy workflow)

**Example link format**:  
`https://github.com/Javhaa233/yellbook/actions/runs/XXXXXXXXX`

---

### ✅ 3. kubectl get pods Screenshot (25 pts - Manifests)

**Command to run:**
```powershell
kubectl get pods -n yellowbooks
```

**Expected output** (all pods should show `Running` and `Ready`):
```
NAME                            READY   STATUS    RESTARTS   AGE
yellbook-api-xxxxxxxxxx-xxxxx   1/1     Running   0          10m
yellbook-api-xxxxxxxxxx-xxxxx   1/1     Running   0          10m
yellbook-web-xxxxxxxxxx-xxxxx   1/1     Running   0          10m
yellbook-web-xxxxxxxxxx-xxxxx   1/1     Running   0          10m
postgres-0                      1/1     Running   0          15m
```

**Screenshot requirements**:
- Show the full terminal output
- All pods in `Running` state
- At least 2 replicas for API and Web
- READY column showing `1/1`
- Save as: `screenshots/lab6-kubectl-pods.png`

**Additional verification commands**:
```powershell
# Check all resources
kubectl get all -n yellowbooks

# Check HPA (for 10 pts HPA requirement)
kubectl get hpa -n yellowbooks

# Check migration job (for 10 pts Migration requirement)
kubectl get jobs -n yellowbooks
```

---

### ✅ 4. Updated DEPLOY.md (5 pts - Documentation)

**File**: [DEPLOY.md](DEPLOY.md) ✅ Already exists

**Required sections**:
- [x] OIDC setup steps (Step 1: OIDC Provider)
- [x] Kubernetes manifests explanation
- [x] Ingress/TLS configuration
- [x] Migration job details
- [x] HPA setup

**Verify it's complete**:
- Open `DEPLOY.md`
- Check that it includes all the steps you followed
- Update any missing information

---

## 📊 Rubric Breakdown (100 pts)

### 1. **OIDC/Roles (20 pts)** ✅
**Files**: 
- `k8s/setup-oidc.sh` ✅
- `k8s/setup-iam-role.sh` ✅
- `k8s/github-actions-trust-policy.json` ✅

**Evidence**:
- IAM OIDC provider created for EKS cluster
- IAM role with ECR push permissions
- GitHub Actions can authenticate without AWS keys

**Verification command**:
```powershell
aws eks describe-cluster --name yellbook-eks --region ap-southeast-1 --query "cluster.identity.oidc.issuer"
```

---

### 2. **aws-auth/RBAC (10 pts)** ✅
**Files**: 
- `k8s/manifests/00-namespace.yaml` (ServiceAccount section) ✅

**Evidence**:
- ServiceAccount created in yellowbooks namespace
- IRSA (IAM Roles for Service Accounts) configured
- Pods can access AWS services (ECR for pulling images)

**Verification**:
```powershell
kubectl get serviceaccount -n yellowbooks
```

---

### 3. **Manifests (25 pts)** ✅
**Files**: All in `k8s/manifests/` ✅
- `00-namespace.yaml` - Namespace & ServiceAccount
- `01-configmap-secret.yaml` - Configuration
- `02-postgres.yaml` - PostgreSQL StatefulSet
- `03-migration-job.yaml` - Database migration
- `04-api-deployment.yaml` - API (2 replicas)
- `05-web-deployment.yaml` - Web (2 replicas)
- `06-hpa.yaml` - Autoscaling
- `07-ingress.yaml` - ALB Ingress

**Evidence**:
- All manifests properly structured
- Services exposed correctly
- Health checks configured
- Resource limits set

---

### 4. **Ingress/TLS (20 pts)** ✅
**File**: `k8s/manifests/07-ingress.yaml` ✅

**Evidence**:
- AWS ALB Ingress Controller installed
- HTTPS/TLS configured
- Certificate from AWS Certificate Manager
- Routes configured for / and /api

**Check Ingress**:
```powershell
kubectl describe ingress yellbook-ingress -n yellowbooks
```

---

### 5. **Migration Job (10 pts)** ✅
**File**: `k8s/manifests/03-migration-job.yaml` ✅

**Evidence**:
- Prisma migration job runs automatically
- Database schema created
- Job completes successfully before API starts

**Check migration job**:
```powershell
kubectl get jobs -n yellowbooks
kubectl logs job/yellbook-migration -n yellowbooks
```

---

### 6. **HPA (10 pts)** ✅
**File**: `k8s/manifests/06-hpa.yaml` ✅

**Evidence**:
- Horizontal Pod Autoscaler configured
- Min replicas: 2
- Max replicas: 10
- Target CPU utilization: 80%

**Check HPA**:
```powershell
kubectl get hpa -n yellowbooks
kubectl describe hpa yellbook-api-hpa -n yellowbooks
kubectl describe hpa yellbook-web-hpa -n yellowbooks
```

---

### 7. **Documentation (5 pts)** ✅
**Files**:
- `DEPLOY.md` ✅ - Complete deployment guide
- `k8s/README.md` ✅ - Kubernetes setup
- `k8s/QUICKSTART.md` ✅ - Quick reference

---

## 🚀 Quick Commands to Gather Evidence

### Run these commands and take screenshots:

```powershell
# 1. Get all pods (for screenshot requirement)
kubectl get pods -n yellowbooks

# 2. Get Ingress URL
kubectl get ingress -n yellowbooks -o wide

# 3. Verify HPA
kubectl get hpa -n yellowbooks

# 4. Check migration job
kubectl get jobs -n yellowbooks

# 5. Verify all resources
kubectl get all -n yellowbooks

# 6. Check OIDC provider
aws eks describe-cluster --name yellbook-eks --region ap-southeast-1 --query "cluster.identity.oidc.issuer"

# 7. Get service accounts
kubectl get serviceaccount -n yellowbooks

# 8. Check ALB controller
kubectl get pods -n kube-system | findstr aws-load-balancer
```

---

## 📸 Screenshot Checklist

Create a `screenshots/` folder and save:

1. **lab6-https-url.png** - Browser showing HTTPS URL with padlock
2. **lab6-kubectl-pods.png** - Terminal with `kubectl get pods -n yellowbooks`
3. **lab6-github-actions.png** - GitHub Actions successful run
4. **lab6-hpa.png** - HPA status
5. **lab6-ingress.png** - Ingress details
6. **lab6-all-resources.png** - All Kubernetes resources

---

## 📝 Submission Template

```
Lab 6: EKS Deployment - Yellbook

Student: Javkhaa Azjargal
GitHub: https://github.com/Javhaa233/yellbook

1. Public HTTPS URL: https://[YOUR-ALB-DNS].ap-southeast-1.elb.amazonaws.com
   Screenshot: [Attach lab6-https-url.png]
   - Shows padlock icon ✅
   - Website loads successfully ✅

2. GitHub Actions: https://github.com/Javhaa233/yellbook/actions/runs/[RUN-ID]
   Screenshot: [Attach lab6-github-actions.png]
   - Build succeeded ✅
   - Deploy succeeded ✅

3. kubectl get pods:
   Screenshot: [Attach lab6-kubectl-pods.png]
   - All pods Running ✅
   - Multiple replicas ✅

4. Documentation: 
   - DEPLOY.md: https://github.com/Javhaa233/yellbook/blob/main/DEPLOY.md ✅
   - Includes OIDC, manifests, Ingress/TLS, Migration, HPA ✅

Rubric Verification:
✅ OIDC/Roles (20 pts) - IAM OIDC provider configured
✅ aws-auth/RBAC (10 pts) - ServiceAccount with IRSA
✅ Manifests (25 pts) - All 8 manifests deployed
✅ Ingress/TLS (20 pts) - ALB with HTTPS certificate
✅ Migration Job (10 pts) - Prisma migration job successful
✅ HPA (10 pts) - Autoscaling configured (2-10 replicas)
✅ Documentation (5 pts) - Complete DEPLOY.md

Total: 100 pts
```

---

## ⚡ Next Steps

1. **Verify EKS cluster is running**:
   ```powershell
   kubectl cluster-info
   kubectl get nodes
   ```

2. **Get your Ingress URL**:
   ```powershell
   kubectl get ingress -n yellowbooks
   ```

3. **Test the URL in browser** and take screenshot

4. **Gather all evidence** using commands above

5. **Create screenshots folder** and organize all images

6. **Submit to your professor** with the template above

---

**Need help?** Check these files:
- [DEPLOY.md](DEPLOY.md) - Full deployment guide
- [LAB7_STATUS.md](LAB7_STATUS.md) - Current status
- [LAB7_VERIFICATION.md](LAB7_VERIFICATION.md) - Detailed verification
