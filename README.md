# YellBook - Монголын Шар Ном

![CI Status](https://github.com/Javhaa233/yellbook/actions/workflows/ci.yml/badge.svg)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![Node.js](https://img.shields.io/badge/node-20.x-green.svg)](https://nodejs.org/)
[![Docker](https://img.shields.io/badge/docker-ready-blue.svg)](https://docker.com/)

ШАР НОМ цахим систем - Монголын байгууллагуудын мэдээллийн сан

## 📋 Project Overview

Nx monorepo архитектур ашиглан:
- **Frontend**: Next.js 15 App Router (React 19)
- **Backend**: Fastify + Prisma ORM
- **Database**: PostgreSQL 16
- **Cache**: Redis 7
- **Containerization**: Docker multi-stage builds
- **Registry**: AWS ECR
- **CI/CD**: GitHub Actions with Matrix build
- **Auth**: NextAuth.js with GitHub OAuth
- **AI**: OpenAI embeddings + semantic search

## 🎯 Lab 6 Deliverables

### ✅ Dockerfiles (30 points)
- **Dockerfile.api** - Fastify API with Prisma multi-stage build
- **Dockerfile.web** - Next.js frontend optimized build  
- Both use `node:20-alpine` base for minimal size
- Production-optimized with layer caching
- Health checks included

### ✅ GitHub Actions CI/CD (30 points)
- **Workflow**: [`.github/workflows/ci.yml`](.github/workflows/ci.yml)
- **Matrix Strategy**: Parallel builds for API and Web
- **Stages**:
  1. **Lint & Build**: ESLint, TypeScript, Nx build
  2. **Docker Build & Push**: Multi-architecture support
  3. **Security Scan**: Trivy vulnerability scanning
  4. **Health Check**: ECR image verification

### ✅ AWS ECR Repositories (20 points)
- **Region**: `ap-southeast-1`
- **API Repository**: `<account-id>.dkr.ecr.ap-southeast-1.amazonaws.com/yellbook/api`
- **Web Repository**: `<account-id>.dkr.ecr.ap-southeast-1.amazonaws.com/yellbook/web`
- **Image Scanning**: Enabled on push
- **Lifecycle Policy**: Keep last 10 images
- **Tags**: Git SHA + `latest`

### ✅ Local Sanity Check (10 points)
```bash
# Build images locally
docker build -f Dockerfile.api -t yellbook-api:local .
docker build -f Dockerfile.web -t yellbook-web:local .

# Run full stack
docker-compose up -d

# Verify services
docker-compose ps
# db, redis, api, web should all be healthy
```

### ✅ Documentation (10 points)
- ✅ README with badges and instructions
- ✅ ECR setup guide: [ECR_SETUP.md](ECR_SETUP.md)
- ✅ GitHub secrets configuration
- ✅ CI/CD workflow documentation

### 🎁 Bonus: Matrix Build Strategy (+10 points)
- ✅ Separate matrix jobs for `api` and `web`
- ✅ Runs on both `push` and `pull_request` events
- ✅ Conditional ECR push only on main branch
- ✅ PR builds test without pushing to registry

## 🐳 ECR Images

Latest images available in AWS ECR:

| Service | Repository | Tag Format | Latest |
|---------|-----------|-----------|--------|
| **API** | `yellbook/api` | `<git-sha>`, `latest` | [View ECR](https://console.aws.amazon.com/ecr/) |
| **Web** | `yellbook/web` | `<git-sha>`, `latest` | [View ECR](https://console.aws.amazon.com/ecr/) |

### Pull Images
```bash
# Login to ECR
aws ecr get-login-password --region ap-southeast-1 | docker login --username AWS --password-stdin <account-id>.dkr.ecr.ap-southeast-1.amazonaws.com

# Pull API image
docker pull <account-id>.dkr.ecr.ap-southeast-1.amazonaws.com/yellbook/api:latest

# Pull Web image
docker pull <account-id>.dkr.ecr.ap-southeast-1.amazonaws.com/yellbook/web:latest
```

## 🚀 CI/CD Workflow

[![CI/CD Pipeline](https://github.com/Javhaa233/yellbook/actions/workflows/ci.yml/badge.svg)](https://github.com/Javhaa233/yellbook/actions)

**Latest Run**: [View Actions](https://github.com/Javhaa233/yellbook/actions)

Pipeline Stages:
- ✅ **lint-and-build**: ESLint + TypeScript + Nx build
- ✅ **docker-build-push**: Multi-stage Docker builds + ECR push
- ✅ **docker-build-pr**: PR validation (build only, no push)
- ✅ **security-scan**: Trivy vulnerability scanning
- ✅ **health-check**: ECR image metadata verification

## 📦 Getting Started

### Prerequisites

- Node.js 20+
- Docker & Docker Compose
- AWS CLI configured with ECR credentials
- PostgreSQL 16 (or use docker-compose)

### Development

```bash
# Install dependencies
npm install

# Run dev server
npx nx dev @yellbook/web &
npx nx dev @yellbook/api &

# Watch and lint
npx nx lint
npx nx typecheck
```

### Build & Deploy

```bash
# Build for production
npx nx build @yellbook/api
npx nx build @yellbook/web

# Docker build
docker build -f Dockerfile.api -t yellbook/api:latest .
docker build -f Dockerfile.web -t yellbook/web:latest .

# Push to ECR
docker tag yellbook/api:latest 754029048634.dkr.ecr.ap-southeast-1.amazonaws.com/yellbook/api:latest
docker push 754029048634.dkr.ecr.ap-southeast-1.amazonaws.com/yellbook/api:latest

docker tag yellbook/web:latest 754029048634.dkr.ecr.ap-southeast-1.amazonaws.com/yellbook/web:latest
docker push 754029048634.dkr.ecr.ap-southeast-1.amazonaws.com/yellbook/web:latest
```

### Docker Compose

```bash
# Start services
docker-compose up -d

# Check status
docker-compose ps

# View logs
docker-compose logs -f api
docker-compose logs -f web

# Stop services
docker-compose down
```

## Architecture

```
yellbook/
├── apps/
│   ├── api/              # Fastify backend
│   │   ├── src/
│   │   ├── prisma/       # Database schema & migrations
│   │   └── Dockerfile.api
│   └── web/              # Next.js frontend
│       ├── src/app/
│       ├── src/components/
│       └── Dockerfile.web
├── libs/
│   ├── types/            # Shared TypeScript types
│   └── config/           # Shared configuration
├── .github/
│   └── workflows/ci.yml  # CI/CD pipeline
└── docker-compose.yml
```

## Repository Links

- **GitHub**: https://github.com/Javhaa233/yellbook
- **CI/CD Workflow**: https://github.com/Javhaa233/yellbook/actions/workflows/ci.yml
- **ECR Registry**: https://console.aws.amazon.com/ecr/repositories
npx nx show project yellbook
```

These targets are either [inferred automatically](https://nx.dev/concepts/inferred-tasks?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects) or defined in the `project.json` or `package.json` files.

[More about running tasks in the docs &raquo;](https://nx.dev/features/run-tasks?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects)

## Add new projects

While you could add new projects to your workspace manually, you might want to leverage [Nx plugins](https://nx.dev/concepts/nx-plugins?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects) and their [code generation](https://nx.dev/features/generate-code?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects) feature.

Use the plugin's generator to create new projects.

To generate a new application, use:

```sh
npx nx g @nx/next:app demo
```

To generate a new library, use:

```sh
npx nx g @nx/react:lib mylib
```

You can use `npx nx list` to get a list of installed plugins. Then, run `npx nx list <plugin-name>` to learn about more specific capabilities of a particular plugin. Alternatively, [install Nx Console](https://nx.dev/getting-started/editor-setup?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects) to browse plugins and generators in your IDE.

[Learn more about Nx plugins &raquo;](https://nx.dev/concepts/nx-plugins?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects) | [Browse the plugin registry &raquo;](https://nx.dev/plugin-registry?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects)


[Learn more about Nx on CI](https://nx.dev/ci/intro/ci-with-nx#ready-get-started-with-your-provider?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects)

## Install Nx Console

Nx Console is an editor extension that enriches your developer experience. It lets you run tasks, generate code, and improves code autocompletion in your IDE. It is available for VSCode and IntelliJ.

[Install Nx Console &raquo;](https://nx.dev/getting-started/editor-setup?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects)

## Useful links

Learn more:

- [Learn more about this workspace setup](https://nx.dev/nx-api/next?utm_source=nx_project&amp;utm_medium=readme&amp;utm_campaign=nx_projects)
- [Learn about Nx on CI](https://nx.dev/ci/intro/ci-with-nx?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects)
- [Releasing Packages with Nx release](https://nx.dev/features/manage-releases?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects)
- [What are Nx plugins?](https://nx.dev/concepts/nx-plugins?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects)

And join the Nx community:
- [Discord](https://go.nx.dev/community)
- [Follow us on X](https://twitter.com/nxdevtools) or [LinkedIn](https://www.linkedin.com/company/nrwl)
- [Our Youtube channel](https://www.youtube.com/@nxdevtools)
- [Our blog](https://nx.dev/blog?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects)
