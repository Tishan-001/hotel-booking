# auth-service/Dockerfile
FROM node:18-alpine

WORKDIR /app

# Copy workspace files from root context
COPY shared-types ./shared-types
COPY auth-service ./auth-service

# Build shared types
WORKDIR /app/shared-types
RUN npm ci && npm run build

# Build main service
WORKDIR /app/auth-service
RUN npm ci --only=production
RUN npm run build

EXPOSE 7004

CMD ["npm", "start"]