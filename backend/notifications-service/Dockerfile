# notifications-service/Dockerfile
FROM node:18-alpine

WORKDIR /app

# Copy root package.json
COPY package.json package-lock.json* ./
COPY tsconfig.json ./

# Copy shared-types and notifications-service
COPY shared-types ./shared-types
COPY notifications-service ./notifications-service

# Install dependencies
RUN npm install --workspaces --if-present

# Build shared-types
WORKDIR /app/shared-types
RUN npm run build

# Build notifications-service
WORKDIR /app/notifications-service
RUN npm run build --workspace=notifications-service

# Expose port
EXPOSE 7005

# Start service
CMD ["npm", "start"]