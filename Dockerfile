# Development Dockerfile for SenseNet client with hot reload
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Copy everything (dockerignore excludes unwanted files)
COPY . .

# Install dependencies
RUN yarn install

# Build packages (required for the app to work)
RUN yarn build

# Expose port
EXPOSE 8080

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=60s --retries=3 \
    CMD wget --no-verbose --tries=1 --spider http://localhost:8080/ || exit 1

# Default command (overridden in docker-compose for hot reload)
CMD ["yarn", "snapp", "start"]
