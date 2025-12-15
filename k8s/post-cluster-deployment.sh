#!/bin/bash

# Post EKS Cluster Creation Deployment Script
# Run this after CloudFormation stack creation is complete

set -e

CLUSTER_NAME="yellbook-eks"
REGION="ap-southeast-1"
AWS_ACCOUNT_ID=$(aws sts get-caller-identity --query Account --output text)
NAMESPACE="yellowbooks"
APP_DOMAIN="yellbook.example.com"  # Update with actual domain

echo "=========================================="
echo "Post-EKS Creation Deployment"
echo "=========================================="

# Step 1: Wait for cluster to be ready
echo "⏳ Waiting for EKS cluster to be ready..."
aws eks wait cluster-active \
  --name "$CLUSTER_NAME" \
  --region "$REGION"

echo "✅ EKS cluster is ready!"

# Step 2: Update kubeconfig
echo "📋 Updating kubeconfig..."
aws eks update-kubeconfig \
  --name "$CLUSTER_NAME" \
  --region "$REGION"

# Step 3: Verify cluster connectivity
echo "🔍 Verifying cluster connectivity..."
kubectl cluster-info
kubectl get nodes

# Step 4: Create namespace
echo "📦 Creating namespace..."
kubectl create namespace "$NAMESPACE" || true

# Step 5: Setup OIDC for ServiceAccounts (if not already done)
echo "🔑 Setting up IRSA for yellowbooks namespace..."

# Get OIDC provider endpoint
OIDC_ENDPOINT=$(aws eks describe-cluster \
  --name "$CLUSTER_NAME" \
  --region "$REGION" \
  --query 'cluster.identity.oidc.issuer' \
  --output text)

OIDC_ID=$(echo "$OIDC_ENDPOINT" | cut -d '/' -f 5)

echo "OIDC ID: $OIDC_ID"

# Step 6: Create IAM role for yellowbooks ServiceAccount
echo "🔐 Creating IAM role for yellowbooks service account..."

TRUST_POLICY=$(cat <<EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Principal": {
        "Federated": "arn:aws:iam::${AWS_ACCOUNT_ID}:oidc-provider/oidc.eks.${REGION}.amazonaws.com/id/${OIDC_ID}"
      },
      "Action": "sts:AssumeRoleWithWebIdentity",
      "Condition": {
        "StringEquals": {
          "oidc.eks.${REGION}.amazonaws.com/id/${OIDC_ID}:sub": "system:serviceaccount:${NAMESPACE}:yellowbooks-sa"
        }
      }
    }
  ]
}
EOF
)

aws iam create-role \
  --role-name YellbooksEKSRole \
  --assume-role-policy-document "$TRUST_POLICY" \
  --region "$REGION" || echo "Role already exists"

# Attach policies for ECR access
aws iam attach-role-policy \
  --role-name YellbooksEKSRole \
  --policy-arn arn:aws:iam::aws:policy/AmazonEC2ContainerRegistryReadOnly \
  --region "$REGION" || echo "ECR policy already attached"

# Step 7: Create ECR secret for private image pull
echo "🔐 Creating ECR secret..."

# Get ECR credentials
aws ecr get-login-password --region "$REGION" | \
  kubectl create secret docker-registry ecr-secret \
  --docker-server="${AWS_ACCOUNT_ID}.dkr.ecr.${REGION}.amazonaws.com" \
  --docker-username=AWS \
  --docker-password=$(aws ecr get-login-password --region "$REGION") \
  -n "$NAMESPACE" || echo "Secret already exists"

# Step 8: Deploy application manifests
echo "📱 Deploying application manifests..."

for manifest in k8s/manifests/*.yaml; do
  echo "Applying $(basename $manifest)..."
  kubectl apply -f "$manifest" -n "$NAMESPACE"
  sleep 2
done

# Step 9: Wait for deployments
echo "⏳ Waiting for deployments to be ready..."
kubectl wait --for=condition=available --timeout=300s \
  deployment/api deployment/web \
  -n "$NAMESPACE" || echo "Deployments taking longer than expected"

# Step 10: Get ingress details
echo "🌐 Checking Ingress status..."
sleep 5
kubectl get ingress -n "$NAMESPACE" -o wide

# Step 11: Get all pods status
echo "📊 Checking pod status..."
kubectl get pods -n "$NAMESPACE"

# Step 12: Check services
echo "🔌 Checking services..."
kubectl get svc -n "$NAMESPACE"

echo ""
echo "=========================================="
echo "✅ Application deployment complete!"
echo "=========================================="
echo ""
echo "📋 Next steps:"
echo "1. Get ALB DNS name: kubectl get ingress -n $NAMESPACE"
echo "2. Create Route53 record pointing to ALB"
echo "3. Configure ACM certificate"
echo "4. Monitor HPA: kubectl get hpa -n $NAMESPACE"
echo "5. Check logs: kubectl logs -f -n $NAMESPACE <pod-name>"
echo ""
echo "🎯 Application URLs (after DNS setup):"
echo "   Web: https://${APP_DOMAIN}"
echo "   API: https://api.${APP_DOMAIN}"
