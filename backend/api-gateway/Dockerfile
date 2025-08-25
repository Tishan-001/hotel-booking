# api-gateway/Dockerfile
FROM node:18-alpine AS shared-builder

# Build shared types first
WORKDIR /shared
COPY shared-types/package*.json ./
RUN npm ci
COPY shared-types/ ./
RUN npm run build

# Main service build
FROM node:18-alpine AS app-builder

WORKDIR /app

# Copy shared types build
COPY --from=shared-builder /shared/dist /shared-types/dist
COPY --from=shared-builder /shared/package.json /shared-types/

# Copy service files
COPY api-gateway/package*.json ./
RUN npm ci --only=production

COPY api-gateway/ ./
RUN npm run build

# Final runtime image
FROM node:18-alpine

WORKDIR /app

# Copy built application
COPY --from=app-builder /app/dist ./dist
COPY --from=app-builder /app/node_modules ./node_modules
COPY --from=app-builder /app/package*.json ./

EXPOSE 7000

CMD ["npm", "start"]