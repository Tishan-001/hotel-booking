# api-gateway/Dockerfile
FROM node:18-alpine

WORKDIR /app

# Copy root package.json
COPY package.json package-lock.json* ./
COPY tsconfig.json ./

# Copy shared-types and api-gateway
COPY shared-types ./shared-types
COPY api-gateway ./api-gateway

# Install dependencies
RUN npm install --workspaces --if-present

# Build shared-types
WORKDIR /app/shared-types
RUN npm run build

# Build api-gateway
WORKDIR /app/api-gateway
RUN npm run build --workspace=api-gateway

# Expose port
EXPOSE 7000

# Start service
CMD ["npm", "start"]