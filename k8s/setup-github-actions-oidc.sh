#!/bin/bash
set -euo pipefail

# Usage:
#   GITHUB_REPO="Javhaa233/yellbook" ./k8s/setup-github-actions-oidc.sh
# Defaults are set for this repository.

AWS_ACCOUNT_ID=$(aws sts get-caller-identity --query Account --output text)
GITHUB_REPO=${GITHUB_REPO:-"Javhaa233/yellbook"}

echo "Creating GitHub Actions OIDC IAM Role"
echo "AWS Account ID: ${AWS_ACCOUNT_ID}"
echo "GitHub repo: ${GITHUB_REPO}"

# Trust Policy JSON
cat > /tmp/github-actions-trust-policy.json << EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Principal": {
        "Federated": "arn:aws:iam::${AWS_ACCOUNT_ID}:oidc-provider/token.actions.githubusercontent.com"
      },
      "Action": "sts:AssumeRoleWithWebIdentity",
      "Condition": {
        "StringEquals": {
          "token.actions.githubusercontent.com:aud": "sts.amazonaws.com",
          "token.actions.githubusercontent.com:sub": "repo:${GITHUB_REPO}:ref:refs/heads/main"
        }
      }
    }
  ]
}
EOF

# Create IAM Role for GitHub Actions
aws iam create-role \
  --role-name github-actions-eks-deploy-role \
  --assume-role-policy-document file:///tmp/github-actions-trust-policy.json \
  2>/dev/null || echo "Role already exists"

# Attach ECR access
aws iam attach-role-policy \
  --role-name github-actions-eks-deploy-role \
  --policy-arn arn:aws:iam::aws:policy/AmazonEC2ContainerRegistryPowerUser \
  2>/dev/null || echo "ECR policy already attached"

# Attach EKS access
aws iam attach-role-policy \
  --role-name github-actions-eks-deploy-role \
  --policy-arn arn:aws:iam::aws:policy/AmazonEKSClusterPolicy \
  2>/dev/null || echo "EKS policy already attached"

# Create custom policy for EKS user access
cat > /tmp/eks-iam-policy.json << 'EOF'
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "eks:DescribeCluster",
        "eks:ListClusters",
        "eks:UpdateClusterConfig"
      ],
      "Resource": "*"
    },
    {
      "Effect": "Allow",
      "Action": [
        "iam:GetRole",
        "iam:PassRole"
      ],
      "Resource": "arn:aws:iam::${AWS_ACCOUNT_ID}:role/*"
    }
  ]
}
EOF

aws iam put-role-policy \
  --role-name github-actions-eks-deploy-role \
  --policy-name eks-deployment-policy \
  --policy-document file:///tmp/eks-iam-policy.json

echo "✅ GitHub Actions IAM Role created successfully"
echo "   ARN: arn:aws:iam::${AWS_ACCOUNT_ID}:role/github-actions-eks-deploy-role"
