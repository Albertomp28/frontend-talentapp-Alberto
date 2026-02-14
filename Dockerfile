# ========================================
# TALENT APP FRONTEND DOCKERFILE
# ========================================
# Multi-stage build for optimal image size and caching
# Supports BuildKit features for faster builds

# ========================================
# STAGE 1: Dependencies (Development)
# ========================================
# Separate stage for dependencies to maximize cache hits
FROM node:20-alpine AS dependencies

WORKDIR /app

# Install build dependencies for native modules
RUN apk add --no-cache python3 make g++

# Copy package files first for better caching
COPY package.json package-lock.json ./

# Install all dependencies (dev + prod)
RUN npm ci --omit=optional && npm cache clean --force

# ========================================
# STAGE 2: Development
# ========================================
FROM node:20-alpine AS development

WORKDIR /app

# Copy dependencies from previous stage
COPY --from=dependencies /app/node_modules ./node_modules

# Copy source code
COPY . .

# Install wget for healthcheck
RUN apk add --no-cache wget

# Vite dev server port
EXPOSE 5173

# Start development server with hot reload
# --host 0.0.0.0 allows access from outside the container
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]

# ========================================
# STAGE 3: Build
# ========================================
FROM node:20-alpine AS build

WORKDIR /app

# Copy production dependencies only
COPY package.json package-lock.json ./
RUN npm ci --omit=dev && npm cache clean --force

# Copy source code
COPY . .

# Build the application
RUN npm run build

# ========================================
# STAGE 4: Production (Nginx)
# ========================================
FROM nginx:alpine AS production

# Install curl for health checks
RUN apk add --no-cache curl

# Copy nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy custom nginx configuration for health endpoint
RUN echo 'location /health { access_log off; return 200 "healthy\n"; }' >> /etc/nginx/conf.d/default.conf

# Copy built assets from build stage
COPY --from=build /app/dist /usr/share/nginx/html

# Create non-root user for security
RUN addgroup -g 1001 -S nginx-user && \
    adduser -S -D -H -u 1001 -h /usr/share/nginx/html -s /sbin/nologin -G nginx-user -g nginx-user nginx-user

# Set proper permissions
RUN chown -R nginx-user:nginx-user /usr/share/nginx/html && \
    chown -R nginx-user:nginx-user /var/cache/nginx && \
    chown -R nginx-user:nginx-user /var/log/nginx && \
    touch /var/run/nginx.pid && \
    chown -R nginx-user:nginx-user /var/run/nginx.pid

# Switch to non-root user
USER nginx-user

# Expose HTTP port
EXPOSE 80

# Health check
HEALTHCHECK --interval=30s --timeout=10s --retries=3 --start-period=5s \
    CMD curl -f http://localhost/health || exit 1

# Start nginx
CMD ["nginx", "-g", "daemon off;"]
