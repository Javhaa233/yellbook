# Lab 7 Verification Checklist

Use this checklist to verify all Lab 7 requirements are met before submission.

## ✅ Pre-Deployment (Completed)

- [x] CloudFormation template created: `k8s/eks-cluster-cloudformation.yaml`
- [x] OIDC provider setup script: `k8s/setup-oidc.sh`
- [x] GitHub Actions OIDC role setup: `k8s/setup-github-actions-oidc.sh`
- [x] GitHub OIDC provider created in AWS IAM ✅
- [x] GitHub Actions role created with trust policy ✅
- [x] All 7 K8s manifests created and ready for deployment
- [x] Comprehensive DEPLOY.md documentation
- [x] CI/CD pipeline from Lab 6 still passing ✅

## ⏳ In Progress - EKS Cluster Creation

- [ ] CloudFormation stack status: `CREATE_COMPLETE`
- [ ] EKS cluster exists and is operational
- [ ] 2 EC2 nodes running in cluster (or 1 if using t3.small)
- [ ] Security groups properly configured
- [ ] VPC and subnets created

## ✅ To Complete After Cluster Ready

### Step 1: Cluster Connectivity
- [ ] kubeconfig updated: `aws eks update-kubeconfig --name yellbook-eks --region ap-southeast-1`
- [ ] `kubectl cluster-info` returns healthy cluster
- [ ] `kubectl get nodes` shows 1-2 nodes in `Ready` state

### Step 2: ALB Controller
- [ ] ALB Ingress Controller installed in kube-system
- [ ] `kubectl get pods -n kube-system -l app.kubernetes.io/name=aws-load-balancer-controller` shows running pods
- [ ] Controller has proper IAM permissions via IRSA

### Step 3: Namespace & RBAC
- [ ] Namespace `yellowbooks` created
- [ ] ServiceAccount `yellowbooks-sa` exists with IRSA annotation
- [ ] Service account has correct IAM role annotation:
  ```bash
  kubectl get sa yellowbooks-sa -n yellowbooks -o yaml | grep eks.amazonaws.com/role-arn
  ```

### Step 4: Database
- [ ] PostgreSQL pod `postgres-0` is `Running` and `Ready`
- [ ] PVC `postgres-data` is `Bound` with 20Gi storage
- [ ] Database service is accessible

### Step 5: Database Migration
- [ ] Migration job completed successfully
- [ ] `kubectl get job -n yellowbooks` shows successful job
- [ ] Database schema is initialized (check with migration logs)

### Step 6: API Deployment
 - [ ] Deployment `api` exists with 2 replicas
 - [ ] Both API pods are `Running` and `Ready`
 - [ ] API service `api` created and accessible internally
 - [ ] API health checks passing
 - [ ] Logs show no errors: `kubectl logs -f deployment/api -n yellowbooks`

### Step 7: Web Deployment
 - [ ] Deployment `web` exists with 2 replicas
 - [ ] Both Web pods are `Running` and `Ready`
 - [ ] Web service `web` created and accessible internally
 - [ ] Web health checks passing
 - [ ] Logs show no errors: `kubectl logs -f deployment/web -n yellowbooks`

### Step 8: HPA Configuration
 - [ ] HPA exists for API deployment (`api-hpa`)
 - [ ] HPA exists for Web deployment (`web-hpa`)
 - [ ] `kubectl get hpa -n yellowbooks` shows both with proper targets:
    - Min replicas: 2
    - Max replicas: 5
    - CPU target: 70%
    - Memory target: 80%

### Step 9: ALB Ingress
 - [ ] Ingress resource `yellowbooks-ingress` created in `yellowbooks` namespace
 - [ ] ALB provisioned and has DNS name
 - [ ] `kubectl get ingress -n yellowbooks -o wide` shows ALB DNS
 - [ ] Host routing works (per manifest):
    - `yellowbooks.<your-domain>` → web service
    - `api.yellowbooks.<your-domain>` → api service
 - [ ] ACM certificate attached (HTTPS configured)

### Step 10: Route53 & DNS
- [ ] Route53 ALIAS record created pointing to ALB DNS
- [ ] DNS resolves: `nslookup yellbook.example.com`
- [ ] Domain accessible in browser

### Step 11: HTTPS & TLS
- [ ] ACM certificate properly attached to ingress
- [ ] Browser shows 🔒 padlock icon when accessing https://yellbook.example.com
- [ ] Certificate details show correct domain
- [ ] No SSL/TLS warnings

### Step 12: End-to-End Testing
- [ ] Can access web app at https://yellbook.example.com
- [ ] Web app loads without errors
- [ ] Can navigate to yellow books section
- [ ] Search functionality works
- [ ] API responds to requests from web app
- [ ] Database queries execute successfully

## 📋 Lab 7 Rubric - Final Verification

| Rubric Item | Points | Evidence | Status |
|-------------|--------|----------|--------|
| **OIDC/IAM Roles** | 20 | GitHub OIDC provider ARN + Pod service account IRSA | ✅ |
| **aws-auth/RBAC** | 10 | ServiceAccount with IRSA annotation in 00-namespace.yaml | ✅ |
| **K8s Manifests** | 25 | 7 manifest files deployed successfully | ⏳ |
| **Ingress/TLS** | 20 | ALB Ingress created, Route53 record, HTTPS padlock screenshot | ⏳ |
| **DB Migration** | 10 | Job completes, database initialized, schema exists | ⏳ |
| **HPA** | 10 | Both deployments have HPA, proper min/max/targets | ⏳ |
| **Documentation** | 5 | DEPLOY.md + k8s/README.md comprehensive setup guides | ✅ |
| **Total** | **100** | | |

## 📸 Screenshots Needed for Submission

1. **Cluster Status**
   ```bash
   kubectl get nodes -o wide
   kubectl get pods -n yellowbooks
   ```

2. **HTTPS Access**
   - Browser screenshot showing 🔒 padlock at https://yellbook.example.com
   - Include URL bar

3. **HPA Status**
   ```bash
   kubectl get hpa -n yellowbooks
   kubectl top pods -n yellowbooks
   ```

4. **Ingress Status**
   ```bash
   kubectl get ingress -n yellowbooks -o wide
   kubectl describe ingress yellowbooks-ingress -n yellowbooks
   ```

5. **GitHub Actions Deploy Success**
   - Screenshot of .github/workflows/deploy-eks.yml successful run

## 🔄 Deployment Automation

Run automatic deployment once cluster is ready:

```bash
# Option 1: PowerShell automation (Windows)
pwsh k8s/deploy-eks-auto.ps1

# Option 2: Manual steps
cd k8s
bash setup-alb-controller.sh
bash post-cluster-deployment.sh
```

## 🚨 Troubleshooting

### Pod not starting
```bash
kubectl describe pod <pod-name> -n yellowbooks
kubectl logs <pod-name> -n yellowbooks
```

### Ingress not provisioning ALB
```bash
kubectl describe ingress yellbook-ingress -n yellowbooks
kubectl logs -n kube-system deployment/aws-load-balancer-controller
```

### Database connection failing
```bash
kubectl logs postgres-0 -n yellowbooks
kubectl logs -f job/prisma-migration -n yellowbooks
```

### HPA not scaling
```bash
kubectl describe hpa <hpa-name> -n yellowbooks
kubectl get events -n yellowbooks
```

## ✅ Final Submission Checklist

Before submitting, verify:

- [ ] EKS cluster is fully operational
- [ ] All pods are Running and Ready
- [ ] Application is accessible via HTTPS with padlock
- [ ] Database migrations completed successfully
- [ ] HPA is actively monitoring metrics
- [ ] ALB Ingress is properly routing traffic
- [ ] GitHub Actions deploy workflow passes
- [ ] All required screenshots captured
- [ ] DEPLOY.md and k8s/README.md documentation complete
- [ ] Repository pushed to GitHub with all commits
- [ ] Lab 6 CI/CD still passing
- [ ] No errors in pod logs

**Lab 7 Grade: ___/100**

---

**Submission Deadline:** Check course requirements  
**Repository:** https://github.com/Baterdene23/yellbook
