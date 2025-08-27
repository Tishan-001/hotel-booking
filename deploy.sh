#!/bin/bash

# Hotel Booking Application - Minikube Deployment Script
set -e

echo "🚀 Starting Hotel Booking App deployment on Minikube..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if minikube is running
check_minikube() {
    print_status "Checking Minikube status..."
    if ! minikube status >/dev/null 2>&1; then
        print_warning "Minikube is not running. Starting Minikube..."
        minikube start
        print_success "Minikube started successfully"
    else
        print_success "Minikube is already running"
    fi
}

# Enable required addons
enable_addons() {
    print_status "Enabling Minikube addons..."
    minikube addons enable ingress
    minikube addons enable dashboard
    minikube addons enable metrics-server
    print_success "Addons enabled"
}

# Create namespace
create_namespace() {
    print_status "Creating namespace..."
    kubectl apply -f k8s/namespace.yaml
    print_success "Namespace created"
}

# Deploy secrets
deploy_secrets() {
    print_status "Deploying secrets..."
    kubectl apply -f k8s/secrets.yaml
    print_success "Secrets deployed"
}

# Deploy configmap
deploy_configmap() {
    print_status "Deploying ConfigMap..."
    kubectl apply -f k8s/configmap.yaml
    print_success "ConfigMap deployed"
}

# Deploy databases and message queue
deploy_infrastructure() {
    print_status "Deploying MongoDB instances and RabbitMQ..."
    kubectl apply -f k8s/mongodb.yaml
    print_success "Infrastructure deployed"
    
    print_status "Waiting for databases to be ready..."
    kubectl wait --for=condition=ready pod -l app=mongo-users -n hotel-booking --timeout=300s
    kubectl wait --for=condition=ready pod -l app=mongo-hotels -n hotel-booking --timeout=300s
    kubectl wait --for=condition=ready pod -l app=mongo-bookings -n hotel-booking --timeout=300s
    kubectl wait --for=condition=ready pod -l app=rabbitmq -n hotel-booking --timeout=300s
    print_success "Infrastructure is ready"
}

# Deploy microservices
deploy_services() {
    print_status "Deploying microservices..."
    kubectl apply -f k8s/microservices.yaml
    print_success "Microservices deployed"
    
    print_status "Waiting for microservices to be ready..."
    sleep 30  # Give services time to start
    kubectl wait --for=condition=ready pod -l app=api-gateway -n hotel-booking --timeout=300s
    kubectl wait --for=condition=ready pod -l app=auth-service -n hotel-booking --timeout=300s
    print_success "Microservices are ready"
}

# Deploy frontend
deploy_frontend() {
    print_status "Deploying frontend..."
    kubectl apply -f k8s/frontend.yml
    print_success "Frontend deployed"
    
    print_status "Waiting for frontend to be ready..."
    kubectl wait --for=condition=ready pod -l app=frontend -n hotel-booking --timeout=300s
    print_success "Frontend is ready"
}

# Get service URLs
get_urls() {
    print_status "Getting service URLs..."
    
    # Get Minikube IP
    MINIKUBE_IP=$(minikube ip)
    
    # Get NodePort for frontend
    FRONTEND_PORT=$(kubectl get service frontend -n hotel-booking -o jsonpath='{.spec.ports[0].nodePort}')
    API_GATEWAY_PORT=$(kubectl get service api-gateway -n hotel-booking -o jsonpath='{.spec.ports[0].nodePort}')
    
    echo ""
    print_success "🎉 Deployment completed successfully!"
    echo ""
    echo "📱 Application URLs:"
    echo "   Frontend:     http://$MINIKUBE_IP:$FRONTEND_PORT"
    echo "   API Gateway:  http://$MINIKUBE_IP:$API_GATEWAY_PORT"
    echo ""
    echo "🔍 Useful commands:"
    echo "   View pods:    kubectl get pods -n hotel-booking"
    echo "   View logs:    kubectl logs -f deployment/api-gateway -n hotel-booking"
    echo "   Port forward: kubectl port-forward service/frontend 3000:3000 -n hotel-booking"
    echo "   Dashboard:    minikube dashboard"
    echo ""
}

# Status check function
check_status() {
    print_status "Checking deployment status..."
    
    echo ""
    echo "📊 Pod Status:"
    kubectl get pods -n hotel-booking -o wide
    
    echo ""
    echo "🔧 Services:"
    kubectl get services -n hotel-booking
    
    echo ""
    echo "📈 Resource Usage:"
    kubectl top pods -n hotel-booking 2>/dev/null || print_warning "Metrics not available yet"
}

# Cleanup function
cleanup() {
    print_warning "Cleaning up hotel-booking namespace..."
    kubectl delete namespace hotel-booking --ignore-not-found=true
    print_success "Cleanup completed"
}

# Port forwarding helper
port_forward() {
    print_status "Setting up port forwarding..."
    echo "Access your application at:"
    echo "  Frontend: http://localhost:3000"
    echo "  API Gateway: http://localhost:7000"
    echo "  RabbitMQ Management: http://localhost:15672"
    echo ""
    echo "Press Ctrl+C to stop port forwarding"
    
    # Run port forwards in background
    kubectl port-forward service/frontend 3000:3000 -n hotel-booking &
    kubectl port-forward service/api-gateway 7000:7000 -n hotel-booking &
    kubectl port-forward service/rabbitmq 15672:15672 -n hotel-booking &
    
    # Wait for user to stop
    wait
}

# Main function
main() {
    case "${1:-deploy}" in
        "deploy")
            check_minikube
            enable_addons
            create_namespace
            deploy_secrets
            deploy_configmap
            deploy_infrastructure
            deploy_services
            deploy_frontend
            get_urls
            ;;
        "status")
            check_status
            ;;
        "cleanup")
            cleanup
            ;;
        "port-forward")
            port_forward
            ;;
        "urls")
            get_urls
            ;;
        *)
            echo "Usage: $0 {deploy|status|cleanup|port-forward|urls}"
            echo ""
            echo "Commands:"
            echo "  deploy       - Deploy the entire application"
            echo "  status       - Check deployment status"
            echo "  cleanup      - Remove all resources"
            echo "  port-forward - Set up local port forwarding"
            echo "  urls         - Show application URLs"
            exit 1
            ;;
    esac
}

main "$@"