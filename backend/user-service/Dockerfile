# user-service/Dockerfile
FROM node:18-alpine

WORKDIR /app

# Copy root package.json
COPY package.json package-lock.json* ./
COPY tsconfig.json ./

# Copy shared-types and user-service
COPY shared-types ./shared-types
COPY user-service ./user-service

# Install dependencies
RUN npm install --workspaces --if-present

# Build shared-types
WORKDIR /app/shared-types
RUN npm run build

# Build user-service
WORKDIR /app/user-service
RUN npm run build --workspace=user-service

# Expose port
EXPOSE 7002

# Start service
CMD ["npm", "start"]