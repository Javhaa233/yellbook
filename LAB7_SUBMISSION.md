# Lab 7 Submission — YellBook (EKS + Route53 + Ingress/TLS)

## Deliverables

### 1) Public HTTPS URL + screenshot (padlock visible)
- URL: <PASTE_HTTPS_URL>
- Screenshot: browser address bar showing 🔒 padlock + full `https://...` URL

### 2) GitHub Actions run link (build + deploy succeeded)
- Deploy workflow: https://github.com/Javhaa233/yellbook/actions/workflows/deploy-eks.yml
- Paste the successful run link here: <PASTE_GREEN_DEPLOY_RUN_URL>

### 3) `kubectl get pods -n yellowbooks` screenshot (Ready pods)
- Command used:
  ```bash
  kubectl get pods -n yellowbooks
  ```
- Screenshot shows pods in `READY` state (e.g., `1/1`, `2/2` etc.)

### 4) Updated DEPLOY.md
- File: DEPLOY.md
- Must include: OIDC steps, aws-auth/RBAC, manifests apply order, Ingress/TLS + Route53

## Notes (fill after deploy)
- AWS Account ID: <AWS_ACCOUNT_ID>
- AWS Region: ap-southeast-1
- EKS Cluster Name: yellbook-eks
- Domain:
  - Web: yellowbooks.<your-domain>
  - API: api.yellowbooks.<your-domain>
- ACM Certificate ARN (ap-southeast-1): <CERT_ARN>
- ALB DNS (from `kubectl get ingress -n yellowbooks -o wide`): <ALB_DNS>

