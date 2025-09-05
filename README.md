# Hotel Booking System - Microservices Architecture

A comprehensive hotel booking platform built with microservices architecture, featuring user management, hotel listings, booking system, and email notifications.

## 🏗️ Architecture Overview

This application follows a microservices architecture with the following components:

- **API Gateway** (Port 7000) - Central entry point routing requests to appropriate services
- **Auth Service** (Port 7001) - JWT token validation and authentication
- **User Service** (Port 7002) - User registration, login, and profile management  
- **Hotel Service** (Port 7003) - Hotel CRUD operations and search functionality
- **Booking Service** (Port 7004) - Stripe payment integration and booking management
- **Notifications Service** (Port 7005) - Email notifications via RabbitMQ messaging
- **Frontend** (Port 3000) - React.js web application with TypeScript

### Supporting Infrastructure
- **MongoDB** - Separate databases for users, hotels, and bookings
- **RabbitMQ** - Message queue for asynchronous communication
- **Cloudinary** - Image storage and management
- **Stripe** - Payment processing

## 🚀 Quick Start

### Prerequisites
- Docker and Docker Compose
- Node.js 18+ (for local development)
- Kubernetes cluster (for K8s deployment)
- Minikube (for local Kubernetes testing)

### Option 1: Docker Compose (Recommended)

1. **Clone the repository**
```bash
git clone https://github.com/Tishan-001/hotel-booking.git
cd hotel-booking-system
```

2. **Set up environment variables**
```bash
cp .env.example .env
# Edit .env with your API keys (Stripe, Cloudinary, SMTP credentials)
```

3. **Start all services**
```bash
docker-compose up --build
```

4. **Access the application**
- Frontend: http://localhost:3000
- API Gateway: http://localhost:7000
- RabbitMQ Management: http://localhost:15672

### Option 2: Kubernetes Deployment

#### For Production Kubernetes Cluster

1. **Create namespace and secrets**
```bash
kubectl apply -f k8s/namespace.yaml
kubectl apply -f k8s/secrets.yaml
kubectl apply -f k8s/configmap.yaml
```

2. **Deploy databases**
```bash
kubectl apply -f k8s/databases/
```

3. **Deploy services**
```bash
kubectl apply -f k8s/auth-service/
kubectl apply -f k8s/user-service/
kubectl apply -f k8s/hotel-service/
kubectl apply -f k8s/booking-service/
kubectl apply -f k8s/notifications-service/
kubectl apply -f k8s/api-gateway/
kubectl apply -f k8s/rabbitmq/
kubectl apply -f k8s/frontend/
```

4. **Get external IPs**
```bash
kubectl get services -n hotel-booking
```

#### For Minikube Testing

We provide automated deployment scripts for Minikube testing:

**Windows:**
```batch
# Deploy the entire application
deploy.bat deploy

# Check deployment status
deploy.bat status

# Set up port forwarding for local access
deploy.bat port-forward

# Clean up all resources
deploy.bat cleanup

# Get application URLs
deploy.bat urls
```

**Linux/Mac:**
```bash
# Deploy the entire application
./deploy.sh deploy

# Check deployment status
./deploy.sh status

# Set up port forwarding for local access
./deploy.sh port-forward

# Clean up all resources
./deploy.sh cleanup

# Get application URLs
./deploy.sh urls
```

The deployment script will:
- Start Minikube if not running
- Enable necessary addons
- Deploy all services in correct order
- Wait for all components to be ready
- Provide access URLs

**Access URLs after deployment:**
- Frontend: `http://[MINIKUBE_IP]:[FRONTEND_PORT]`
- API Gateway: `http://[MINIKUBE_IP]:[API_GATEWAY_PORT]`
- RabbitMQ Management: `http://[MINIKUBE_IP]:[RABBITMQ_PORT]`

### Option 3: Local Development

1. **Install dependencies for each service**
```bash
# Backend services
cd backend/api-gateway && npm install
cd ../auth-service && npm install
cd ../user-service && npm install
cd ../hotel-service && npm install
cd ../booking-service && npm install
cd ../notifications-service && npm install

# Frontend
cd ../../frontend && npm install
```

2. **Start infrastructure services**
```bash
docker-compose up mongodb rabbitmq
```

3. **Start each service in separate terminals**
```bash
# Terminal 1 - API Gateway
cd backend/api-gateway && npm run dev

# Terminal 2 - Auth Service  
cd backend/auth-service && npm run dev

# Terminal 3 - User Service
cd backend/user-service && npm run dev

# Terminal 4 - Hotel Service
cd backend/hotel-service && npm run dev

# Terminal 5 - Booking Service
cd backend/booking-service && npm run dev

# Terminal 6 - Notifications Service
cd backend/notifications-service && npm run dev

# Terminal 7 - Frontend
cd frontend && npm run dev
```

## 🔧 Configuration

### Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
# Database URLs
MONGODB_CONNECTION_STRING_USERS=mongodb://admin:password123@localhost:27017/users?authSource=admin
MONGODB_CONNECTION_STRING_HOTELS=mongodb://admin:password123@localhost:27017/hotels?authSource=admin
MONGODB_CONNECTION_STRING_BOOKINGS=mongodb://admin:password123@localhost:27017/bookings?authSource=admin

# JWT Secret
JWT_SECRET_KEY=your-super-secret-jwt-key

# Service URLs
AUTH_SERVICE_URL=http://localhost:7001
USER_SERVICE_URL=http://localhost:7002
HOTEL_SERVICE_URL=http://localhost:7003
BOOKING_SERVICE_URL=http://localhost:7004
NOTIFICATIONS_SERVICE_URL=http://localhost:7005
BASE_URL=http://localhost:7000

# Frontend
FRONTEND_URL=http://localhost:3000
VITE_API_BASE_URL=http://localhost:7000

# Stripe (Test Keys)
STRIPE_API_KEY=sk_test_your_stripe_secret_key
STRIPE_PUB_KEY=pk_test_your_stripe_publishable_key
VITE_STRIPE_PUB_KEY=pk_test_your_stripe_publishable_key

# Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# SMTP (Gmail example)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password

# RabbitMQ
RABBITMQ_URL=amqp://admin:password123@localhost:5672
RABBITMQ_USER=admin
RABBITMQ_PASS=password123
```

## 🧪 Testing the Application

### Core Features to Test

1. **User Registration & Login**
   - Navigate to http://localhost:3000
   - Register a new account
   - Login with credentials

2. **Hotel Management**
   - Login and go to "My Hotels"
   - Add a new hotel with images
   - Edit existing hotels

3. **Hotel Search & Booking**
   - Use search bar to find hotels
   - Filter by location, price, facilities
   - Make a test booking with Stripe test card: `4242 4242 4242 4242`

4. **Email Notifications**
   - Complete a booking
   - Check email for booking confirmation

5. **View Bookings**
   - Go to "My Bookings" to see reservation history

### Test Accounts (Available after sample data setup)
- **User**: john.doe@example.com / password123
- **Hotel Owner**: hotel.owner@example.com / password123

### Test Payment Cards
- **Success**: 4242 4242 4242 4242
- **Decline**: 4000 0000 0000 0002
- **Authentication Required**: 4000 0025 0000 3155

## 🏗️ System Architecture & Database Schema
![System Architecture & Database Schema ](./images/system_architecture_&_database_schema.png)

## 🎯 API Endpoints

### Authentication
- `POST /api/users/register` - User registration
- `POST /api/users/login` - User login
- `GET /api/users/me` - Get current user
- `POST /api/auth/logout` - Logout user

### Hotels
- `GET /api/hotels` - Get all hotels
- `GET /api/hotels/search` - Search hotels with filters
- `GET /api/hotels/:id` - Get hotel by ID
- `POST /api/my-hotels` - Create hotel (authenticated)
- `GET /api/my-hotels` - Get user's hotels (authenticated)
- `PUT /api/my-hotels/:id` - Update hotel (authenticated)

### Bookings
- `POST /api/hotels/:hotelId/bookings/payment-intent` - Create payment intent
- `POST /api/hotels/:hotelId/bookings` - Create booking
- `GET /api/my-bookings` - Get user's bookings (authenticated)

## 🔍 Health Checks

- API Gateway: http://localhost:7000/health
- Notifications Service: http://localhost:7005/notifications/test-connection

## 🐳 Docker Images

Pre-built images are available on Docker Hub:
- `tishan001/hotel-booking:frontend-latest`
- `tishan001/hotel-booking:api-gateway-latest`
- `tishan001/hotel-booking:auth-service-latest`
- `tishan001/hotel-booking:user-service-latest`
- `tishan001/hotel-booking:hotel-service-latest`
- `tishan001/hotel-booking:booking-service-latest`
- `tishan001/hotel-booking:notifications-service-latest`

## 🛠️ Development

### Tech Stack
- **Backend**: Node.js, Express.js, TypeScript
- **Frontend**: React.js, TypeScript, Tailwind CSS
- **Databases**: MongoDB
- **Message Queue**: RabbitMQ
- **Payment**: Stripe
- **File Upload**: Cloudinary
- **Orchestration**: Docker, Kubernetes

### Project Structure
```
hotel-booking-system/
├── backend/
│   ├── api-gateway/
│   ├── auth-service/
│   ├── user-service/
│   ├── hotel-service/
│   ├── booking-service/
│   ├── notifications-service/
│   ├── shared-types/
│   └── docker-compose.yml
├── frontend/
├── k8s/
├── deploy.sh / deploy.bat
└── README.md
```

## 🔧 Minikube Deployment Details

The automated deployment scripts handle the complete deployment process:

### Deployment Process
1. **Infrastructure Setup**
   - Checks and starts Minikube if needed
   - Enables required addons (ingress, dashboard, metrics-server)
   - Creates namespace and applies configurations

2. **Database Deployment**
   - Deploys Persistent Volume Claims
   - Deploys MongoDB instances for users, hotels, and bookings
   - Waits for databases to be ready

3. **Message Queue**
   - Deploys RabbitMQ with management interface
   - Configures proper credentials and access

4. **Microservices Deployment**
   - Deploys all backend services in correct order
   - Waits for each service to be healthy
   - Configures service-to-service communication

5. **Frontend Deployment**
   - Deploys React frontend with proper API configuration
   - Exposes service through NodePort

### Useful Minikube Commands
```bash
# View Kubernetes dashboard
minikube dashboard

# Establishes a network route on the host machine
minikube tunnel

# Check pod status
kubectl get pods -n hotel-booking

# View service logs
kubectl logs -f deployment/api-gateway -n hotel-booking

# Check resource usage
kubectl top pods -n hotel-booking

# Port forward for local access
kubectl port-forward service/frontend 3000:3000 -n hotel-booking
kubectl port-forward service/api-gateway 7000:7000 -n hotel-booking
```

## 🚨 Troubleshooting

### Common Issues

1. **Port conflicts**: Make sure ports 3000, 7000-7005, 5672, 15672, 27017 are available
2. **Environment variables**: Verify all required env vars are set correctly
3. **MongoDB connection**: Ensure MongoDB containers are running and healthy
4. **RabbitMQ**: Check RabbitMQ is accessible at the configured URL
5. **Stripe**: Use test API keys for development
6. **Minikube**: Ensure Minikube has sufficient resources (4GB RAM minimum)

### Logs
```bash
# Docker Compose
docker-compose logs [service-name]

# Kubernetes
kubectl logs -f deployment/[service-name] -n hotel-booking

# Minikube
minikube logs
```

### Minikube Troubleshooting
```bash
# Restart Minikube
minikube stop
minikube start

# Check Minikube status
minikube status

# Get Minikube IP
minikube ip

# SSH into Minikube
minikube ssh
```

---

## 🎯 Quick Start Summary

**For immediate testing:**
1. Ensure Docker, Kubernetes, and Minikube are installed
2. Clone the repository
3. Run `./deploy.sh deploy` (Linux/Mac) or `deploy.bat deploy` (Windows)
4. Run `minikube tunnel`
5. Access the application at the provided URLs
6. Use test accounts and Stripe test cards for testing

**For development:**
1. Use Docker Compose for local development: `docker-compose up --build`
2. Access at http://localhost:3000
3. Use provided test accounts for immediate access