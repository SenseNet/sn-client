# Dockerfile for SenseNet client
FROM node:20-alpine

# Install serve for static file serving
RUN yarn global add serve

# Set working directory
WORKDIR /app

# Copy everything (dockerignore excludes unwanted files)
COPY . .

# Install dependencies
RUN HUSKY=0 yarn install --frozen-lockfile

# Build the app bundle in production mode (the snapp webpack config resolves workspace packages from src)
RUN NODE_ENV=production yarn snapp build

# Expose port
EXPOSE 8080

# Health check (start-period is short since static server starts instantly)
HEALTHCHECK --interval=30s --timeout=3s --start-period=15s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:8080/ || exit 1

# Serve pre-built static files (fast startup, SPA mode with -s flag)
CMD ["serve", "-s", "apps/sensenet/build", "-l", "8080"]
