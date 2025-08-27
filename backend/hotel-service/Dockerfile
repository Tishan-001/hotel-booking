# hotel-service/Dockerfile
FROM node:18-alpine

WORKDIR /app

# Copy root package.json
COPY package.json package-lock.json* ./
COPY tsconfig.json ./

# Copy shared-types and hotel-service
COPY shared-types ./shared-types
COPY hotel-service ./hotel-service

# Install dependencies
RUN npm install --workspaces --if-present

# Build shared-types
WORKDIR /app/shared-types
RUN npm run build

# Build hotel-service
WORKDIR /app/hotel-service
RUN npm run build --workspace=hotel-service

# Expose port
EXPOSE 7003

# Start service
CMD ["npm", "start"]