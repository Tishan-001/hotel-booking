# Hotel Booking System 🏨

A full-stack microservices-based hotel booking application built with React, Node.js, Express, MongoDB, and deployed on Kubernetes.

## 🏗️ Architecture Overview

This application follows a microservices architecture with the following components:

### Backend Services
- **API Gateway** (Port 7000) - Routes requests to appropriate microservices
- **Auth Service** (Port 7001) - Handles authentication and token validation
- **User Service** (Port 7002) - Manages user registration, login, and profiles
- **Hotel Service** (Port 7003) - Manages hotel data, search, and listings
- **Booking Service** (Port 7004) - Handles booking creation and management
- **Notifications Service** (Port 7005) - Sends email notifications

### Frontend
- **React Application** (Port 3000) - User interface built with React, TypeScript, and Tailwind CSS

### Infrastructure
- **MongoDB** - Separate databases for users, hotels, and bookings
- **RabbitMQ** - Message queue for inter-service communication
- **Stripe** - Payment processing
- **Cloudinary** - Image storage and management

## 🚀 Features

- **User Authentication** - JWT-based authentication with secure sessions
- **Hotel Management** - Create, update, and manage hotel listings
- **Advanced Search** - Filter hotels by location, price, facilities, and ratings
- **Booking System** - Complete booking workflow with payment integration
- **Email Notifications** - Automated booking confirmation emails
- **Responsive Design** - Mobile-friendly interface
- **Image Upload** - Hotel image management with Cloudinary
- **Real-time Messaging** - Event-driven communication between services

## 🛠️ Technology Stack

### Frontend
- React 18 with TypeScript
- Tailwind CSS for styling
- React Query for state management
- React Router for navigation
- Stripe for payments
- React DatePicker

### Backend
- Node.js & Express
- TypeScript
- MongoDB with Mongoose
- JWT authentication
- Stripe payment processing
- RabbitMQ messaging
- Nodemailer for emails
- Cloudinary for image storage

### DevOps & Deployment
- Docker containerization
- Kubernetes orchestration
- Microservices architecture

## 📋 Prerequisites

- Node.js 18+
- Docker and Docker Compose
- Kubernetes cluster (for production deployment)
- MongoDB
- RabbitMQ

## 🔧 Environment Variables

Create a `.env` file in the backend directory with the following variables:

```env
# Service Configuration
API_GATEWAY_PORT=7000
AUTH_SERVICE_PORT=7001
USER_SERVICE_PORT=7002
HOTEL_SERVICE_PORT=7003
BOOKING_SERVICE_PORT=7004
NOTIFICATIONS_SERVICE_PORT=7005

# Database Connections
MONGODB_CONNECTION_STRING_USERS=mongodb://admin:password123@mongo-users:27017/users?authSource=admin
MONGODB_CONNECTION_STRING_HOTELS=mongodb://admin:password123@mongo-hotels:27017/hotels?authSource=admin
MONGODB_CONNECTION_STRING_BOOKINGS=mongodb://admin:password123@mongo-bookings:27017/bookings?authSource=admin

# Authentication
JWT_SECRET_KEY=your_jwt_secret_key_here

# External Services
STRIPE_API_KEY=sk_test_your_stripe_secret_key
VITE_STRIPE_PUB_KEY=pk_test_your_stripe_public_key

# Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret

# Email Configuration
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password

# RabbitMQ
RABBITMQ_URL=amqp://admin:password123@rabbitmq:5672
RABBITMQ_USER=admin
RABBITMQ_PASS=password123

# Application URLs
FRONTEND_URL=http://localhost:3000
BASE_URL=http://localhost:7000
```

## 🚀 Getting Started

### Local Development

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd hotel-booking-system
   ```

2. **Install dependencies for all services**
   ```bash
   # Backend services
   cd backend
   npm install --workspaces

   # Frontend
   cd ../frontend
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp backend/.env.example backend/.env
   # Edit the .env file with your configuration
   ```

4. **Start MongoDB and RabbitMQ (using Docker)**
   ```bash
   docker run -d --name mongodb -p 27017:27017 -e MONGO_INITDB_ROOT_USERNAME=admin -e MONGO_INITDB_ROOT_PASSWORD=password123 mongo:7
   docker run -d --name rabbitmq -p 5672:5672 -p 15672:15672 -e RABBITMQ_DEFAULT_USER=admin -e RABBITMQ_DEFAULT_PASS=password123 rabbitmq:3.12-management
   ```

5. **Start all services**
   ```bash
   # Terminal 1 - API Gateway
   cd backend/api-gateway
   npm run dev

   # Terminal 2 - Auth Service
   cd backend/auth-service
   npm run dev

   # Terminal 3 - User Service
   cd backend/user-service
   npm run dev

   # Terminal 4 - Hotel Service
   cd backend/hotel-service
   npm run dev

   # Terminal 5 - Booking Service
   cd backend/booking-service
   npm run dev

   # Terminal 6 - Notifications Service
   cd backend/notifications-service
   npm run dev

   # Terminal 7 - Frontend
   cd frontend
   npm run dev
   ```

6. **Access the application**
   - Frontend: http://localhost:3000
   - API Gateway: http://localhost:7000
   - RabbitMQ Management: http://localhost:15672 (admin/password123)

### Docker Deployment

1. **Build Docker images**
   ```bash
   # Build all service images
   docker build -t hotel-booking:api-gateway ./backend/api-gateway
   docker build -t hotel-booking:auth-service ./backend/auth-service
   docker build -t hotel-booking:user-service ./backend/user-service
   docker build -t hotel-booking:hotel-service ./backend/hotel-service
   docker build -t hotel-booking:booking-service ./backend/booking-service
   docker build -t hotel-booking:notifications-service ./backend/notifications-service
   docker build -t hotel-booking:frontend ./frontend
   ```

### Kubernetes Deployment

1. **Create namespace and secrets**
   ```bash
   kubectl apply -f k8s/namespace.yaml
   kubectl apply -f k8s/secrets.yaml
   kubectl apply -f k8s/configmap.yaml
   ```

2. **Deploy infrastructure (MongoDB, RabbitMQ)**
   ```bash
   kubectl apply -f k8s/mongodb.yaml
   ```

3. **Deploy microservices**
   ```bash
   kubectl apply -f k8s/microservices.yaml
   ```

4. **Deploy frontend**
   ```bash
   kubectl apply -f k8s/frontend.yml
   ```

5. **Check deployment status**
   ```bash
   kubectl get pods -n hotel-booking
   kubectl get services -n hotel-booking
   ```

## 📁 Project Structure

```
hotel-booking-system/
├── backend/
│   ├── api-gateway/          # API Gateway service
│   ├── auth-service/         # Authentication service
│   ├── user-service/         # User management service
│   ├── hotel-service/        # Hotel management service
│   ├── booking-service/      # Booking management service
│   ├── notifications-service/ # Email notification service
│   └── shared-types/         # Shared TypeScript types
├── frontend/                 # React frontend application
└── k8s/                     # Kubernetes deployment files
```

## 🔗 API Endpoints

### Authentication
- `POST /api/auth/validate-token` - Validate JWT token
- `POST /api/auth/logout` - Logout user

### Users
- `POST /api/users/register` - Register new user
- `POST /api/users/login` - User login
- `GET /api/users/me` - Get current user profile

### Hotels
- `GET /api/hotels` - Get all hotels
- `GET /api/hotels/search` - Search hotels with filters
- `GET /api/hotels/:id` - Get hotel by ID
- `POST /api/my-hotels` - Create new hotel (authenticated)
- `GET /api/my-hotels` - Get user's hotels (authenticated)
- `PUT /api/my-hotels/:id` - Update hotel (authenticated)

### Bookings
- `POST /api/hotels/:hotelId/bookings/payment-intent` - Create payment intent
- `POST /api/hotels/:hotelId/bookings` - Create booking
- `GET /api/my-bookings` - Get user's bookings (authenticated)

### Notifications
- `POST /api/notifications/booking-confirmation` - Send booking confirmation email
- `GET /api/notifications/test-connection` - Test email service

## 🔐 Authentication Flow

1. User registers/logs in through the frontend
2. User service validates credentials and returns JWT token
3. Token is stored in HTTP-only cookies
4. API Gateway validates tokens for protected routes
5. User ID is passed to downstream services via headers

## 📬 Messaging System

The application uses RabbitMQ for asynchronous communication:

- **Booking Created Events** - When a booking is created, an event is published
- **Email Notifications** - Notifications service consumes booking events and sends confirmation emails

## 🎨 Frontend Features

- **Responsive Design** - Works on desktop and mobile devices
- **Hotel Search** - Advanced filtering by location, price, facilities
- **Image Gallery** - Hotel image carousel
- **Payment Integration** - Stripe payment processing
- **Form Validation** - Client and server-side validation
- **Toast Notifications** - User feedback for actions
- **Protected Routes** - Authentication-based route protection

## 📊 Monitoring

- **Health Checks** - Each service exposes health endpoints
- **Kubernetes Probes** - Liveness and readiness probes configured
- **RabbitMQ Management** - Queue monitoring via management UI
- **Application Logs** - Structured logging across all services