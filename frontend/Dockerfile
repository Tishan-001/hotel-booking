FROM node:18-alpine

WORKDIR /app

# Copy package files first
COPY package.json package-lock.json* ./

RUN npm install

# Accept build arguments for Vite env vars
ARG VITE_API_BASE_URL
ARG VITE_STRIPE_PUB_KEY

# Make them available as env vars inside the container
ENV VITE_API_BASE_URL=$VITE_API_BASE_URL
ENV VITE_STRIPE_PUB_KEY=$VITE_STRIPE_PUB_KEY

# Copy everything else
COPY . .

# Build with env vars
RUN npm run build

# Serve static files
RUN npm install -g serve

EXPOSE 3000

CMD ["serve", "-s", "dist"]
