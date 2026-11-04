# Docker Setup for SenseNet Client

This guide explains how to run the SenseNet client application using Docker.

## 🚀 Quick Start

### Development (with hot reload)
```bash
docker-compose -f docker-compose.dev.yml up -d
```
- **URL**: http://localhost:8080
- **Hot reload**: ✅ File changes are instantly reflected
- **Use case**: Active development

### Production
```bash
docker-compose -f docker-compose.prod.yml up -d
```
- **URL**: http://localhost:8080
- **Hot reload**: ❌ Static built files
- **Use case**: Testing production builds, deployment

## 📁 Files Overview

| File | Purpose |
|------|---------|
| `Dockerfile` | Single Docker image for both dev and prod |
| `docker-compose.dev.yml` | Development setup with volume mounts |
| `docker-compose.prod.yml` | Production setup without volume mounts |
| `.dockerignore` | Excludes unnecessary files from build context |

## 🔧 How It Works

### Development Mode
- **Volume mounting**: Your local code is mounted into the container
- **File watching**: Changes trigger automatic rebuilds
- **Command**: `yarn snapp start` (webpack dev server with hot reload)

### Production Mode
- **Built files**: Uses pre-built static files inside the container  
- **No volumes**: Container is self-contained
- **Command**: `yarn snapp start` (same command, but runs webpack dev server on built files)

## 🛠️ Common Commands

```bash
# Start development
docker-compose -f docker-compose.dev.yml up -d

# Stop development
docker-compose -f docker-compose.dev.yml down

# Rebuild and start (after dependency changes)
docker-compose -f docker-compose.dev.yml up --build -d

# View logs
docker-compose -f docker-compose.dev.yml logs -f

# Start production
docker-compose -f docker-compose.prod.yml up -d
```

## 🐳 Docker Images

Automatic builds are available on DockerHub:

```bash
# Latest development build
docker pull sensenetcsp/sn-client:feature-docker-containerization

# Specific commit
docker pull sensenetcsp/sn-client:feature-docker-containerization-abc1234

# Production (when merged to main)
docker pull sensenetcsp/sn-client:latest
```

## ⚙️ Configuration

### Environment Variables
Both compose files support these environment variables:

- `NODE_ENV`: `development` or `production`
- `AUTH_TYPE`: `SNAuth` or `IdentityServer`
- `CHOKIDAR_USEPOLLING`: `true` (dev only, for file watching)
- `WATCHPACK_POLLING`: `true` (dev only, for webpack)

### Port Configuration
- **Default**: Port 8080 for both dev and prod
- **Customizable**: Change the host port in docker-compose files

## 🔍 Troubleshooting

### Container won't start
```bash
# Check logs
docker-compose -f docker-compose.dev.yml logs

# Rebuild from scratch
docker-compose -f docker-compose.dev.yml down
docker-compose -f docker-compose.dev.yml up --build
```

### Hot reload not working
- Ensure you're using the dev compose file
- Restart the container if file watching stops working

### Port already in use
```bash
# Change the port in docker-compose file
ports:
  - "3000:8080"  # Use port 3000 instead of 8080
```

## 📦 Build Process

The Docker build process:
1. **Copy source code** (excluding files in `.dockerignore`)
2. **Install dependencies** with `yarn install`
3. **Build packages** with `yarn build`
4. **Start application** with `yarn snapp start`

## 🚀 CI/CD

GitHub Actions automatically builds and pushes Docker images when:
- Code is pushed to `feature/docker-containerization`
- Pull requests target `develop`, `main`, or `feature/sn-auth-package-extraimprovements`

Images are tagged based on branch names and commit SHAs for easy identification.