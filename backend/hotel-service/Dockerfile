# hotel-service/Dockerfile
FROM node:18-alpine

WORKDIR /app

# Copy workspace files from root context
COPY shared-types ./shared-types
COPY hotel-service ./hotel-service

# Build shared types
WORKDIR /app/shared-types
RUN npm ci && npm run build

# Build main service
WORKDIR /app/hotel-service
RUN npm ci --only=production
RUN npm run build

EXPOSE 7003

CMD ["npm", "start"]