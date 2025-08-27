# booking-service/Dockerfile
FROM node:18-alpine

WORKDIR /app

# Copy root package.json
COPY package.json package-lock.json* ./
COPY tsconfig.json ./

# Copy shared-types and booking-service
COPY shared-types ./shared-types
COPY booking-service ./booking-service

# Install dependencies
RUN npm install --workspaces --if-present

# Build shared-types
WORKDIR /app/shared-types
RUN npm run build

# Build booking-service
WORKDIR /app/booking-service
RUN npm run build --workspace=booking-service

# Expose port
EXPOSE 7004

# Start service
CMD ["npm", "start"]