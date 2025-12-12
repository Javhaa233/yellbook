# Lab 7 EKS Deployment - Current Status

**Date:** December 7, 2025  
**Lab Status:** DEPLOYING - Fargate Stack (Fixed Dependencies)  
**Estimated Completion:** 10-15 minutes (EKS Cluster creating)  

## ✅ Current Deployment Progress

### Stack Attempt #3 (Active Now)
**Status:** `CREATE_IN_PROGRESS`  
**Start Time:** 2025-12-07T04:52 UTC  
**Template:** `eks-fargate-cloudformation.yaml`

**Resources Status:**
| Resource | Status | Notes |
|----------|--------|-------|
| VPC | ✅ CREATE_COMPLETE | 10.0.0.0/16 |
| Public Subnets | ✅ CREATE_COMPLETE | 2 × /24 with IGW |
| Private Subnets | ✅ CREATE_COMPLETE | 2 × /24 with NAT |
| Security Groups | ✅ CREATE_COMPLETE | Cluster + Fargate |
| IAM Roles | ✅ CREATE_COMPLETE | Cluster + Pod Execution |
| **EKS Cluster** | ⏳ CREATE_IN_PROGRESS | ~10-15 min |
| Fargate Profiles | ⏳ PENDING | Waits for cluster |
| Route Tables | ⏳ PENDING | Waits for cluster |

### Recent Fixes Applied
**Problem (Attempt #2):** Both Fargate profiles created simultaneously → race condition → `CREATE_FAILED`

**Solution:** Sequential dependencies in CloudFormation template
- `FargateProfileKubeSystem` creates first
- `FargateProfileYellowbooks` creates after

**Why Fargate (not EC2)?**
- ✅ No EC2 vCPU quota needed (quota was 0.0)
- ✅ Serverless container orchestration
- ✅ Auto-scaling by pods
- ✅ Reduced costs

## 📋 Next Steps (Auto-Execute When Ready)

### Monitor Stack Progress
```powershell
aws cloudformation describe-stacks --stack-name yellbook-eks-stack --region ap-southeast-1 --query 'Stacks[0].StackStatus' --output text
```

### When CREATE_COMPLETE:
```powershell
# Step 1: Update kubeconfig
aws eks update-kubeconfig --name yellbook-eks --region ap-southeast-1

# Step 2: Run post-deployment setup
./k8s/post-stack-setup.ps1
```

## 🎯 Lab 7 Progress

| Item | Points | Status |
|------|--------|--------|
| OIDC/IAM Roles | 20 | ✅ Ready |
| aws-auth/RBAC | 10 | ✅ Ready |
| K8s Manifests | 25 | ✅ Ready |
| Ingress/TLS | 20 | ✅ Ready |
| DB Migration | 10 | ✅ Ready |
| HPA | 10 | ✅ Ready |
| Documentation | 5 | ✅ Ready |
| **EKS Cluster (Fargate)** | - | ⏳ **IN_PROGRESS** |
| **Total** | **100** | **~95%** |

---

**Last Updated:** 2025-12-07T04:52 UTC  
**Status:** Background monitoring running  
