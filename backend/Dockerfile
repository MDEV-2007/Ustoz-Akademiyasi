# ==========================================
# Ustoz Akademiyasi Backend - Multi-stage Dockerfile
# ==========================================

# 1. Base stage
FROM node:20-alpine AS base
WORKDIR /app
RUN apk add --no-cache libc6-compat openssl

# 2. Dependencies stage
FROM base AS dependencies
COPY package*.json ./
COPY prisma ./prisma/
RUN npm ci

# 3. Build stage
FROM base AS builder
WORKDIR /app
COPY --from=dependencies /app/node_modules ./node_modules
COPY package*.json tsconfig*.json nest-cli.json ./
COPY prisma ./prisma/
COPY src ./src
RUN npx prisma generate
RUN npm run build
RUN npm prune --production

# 4. Production Runner stage
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=4000

# Install OpenSSL for Prisma engine
RUN apk add --no-cache openssl

# Create uploads directory and non-root user permissions
RUN mkdir -p /app/uploads && chown -R node:node /app

COPY --from=builder --chown=node:node /app/package*.json ./
COPY --from=builder --chown=node:node /app/node_modules ./node_modules
COPY --from=builder --chown=node:node /app/dist ./dist
COPY --from=builder --chown=node:node /app/prisma ./prisma
COPY --from=builder --chown=node:node /app/swagger-spec.json ./

USER node

EXPOSE 4000

HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:4000/api/v1/health/live || exit 1

CMD ["node", "dist/src/main.js"]
