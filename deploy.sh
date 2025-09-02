#!/bin/bash

echo "🚀 Starting Hotel Booking App deployment on Minikube..."
echo

main() {
    case "$1" in
        "")
            deploy
            ;;
        "deploy")
            deploy
            ;;
        "status")
            status
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
            echo
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

deploy() {
    check_minikube
    enable_addons
    create_namespace
    deploy_secrets
    deploy_configmap
    deploy_infrastructure
    deploy_microservices
    deploy_frontend
    get_urls
}

status() {
    check_status
}

cleanup() {
    cleanup_resources
}

port_forward() {
    port_forwarding
}

get_urls() {
    get_urls_info
}

check_minikube() {
    echo "[INFO] Checking Minikube status..."
    if minikube status >/dev/null 2>&1; then
        echo "[SUCCESS] Minikube is already running"
    else
        echo "[WARNING] Minikube is not running. Starting Minikube..."
        minikube start
        echo "[SUCCESS] Minikube started successfully"
    fi
}

enable_addons() {
    echo "[INFO] Enabling Minikube addons..."
    minikube addons enable ingress >/dev/null 2>&1
    minikube addons enable dashboard >/dev/null 2>&1
    minikube addons enable metrics-server >/dev/null 2>&1
    echo "[SUCCESS] Addons enabled"
}

create_namespace() {
    echo "[INFO] Creating namespace..."
    kubectl apply -f k8s/namespace.yaml
    echo "[SUCCESS] Namespace created"
}

deploy_secrets() {
    echo "[INFO] Deploying secrets..."
    kubectl apply -f k8s/secrets.yaml
    echo "[SUCCESS] Secrets deployed"
}

deploy_configmap() {
    echo "[INFO] Deploying ConfigMap..."
    kubectl apply -f k8s/configmap.yaml
    echo "[SUCCESS] ConfigMap deployed"
}

deploy_infrastructure() {
    echo "[INFO] Deploying infrastructure components..."

    echo "[INFO] Deploying Persistent Volume Claims..."
    kubectl apply -f k8s/databases/pvc.yaml
    echo "[SUCCESS] PVCs deployed"

    echo "[INFO] Waiting for PVCs to be bound..."
    sleep 10

    echo "[INFO] Checking PVC status..."
    kubectl get pvc -n hotel-booking

    echo "[INFO] Deploying MongoDB instances..."
    kubectl apply -f k8s/databases/mongodb.yaml
    echo "[SUCCESS] MongoDB deployed"

    echo "[INFO] Deploying RabbitMQ..."
    kubectl apply -f k8s/rabbitmq/deployment.yml
    echo "[SUCCESS] RabbitMQ deployed"

    echo "[INFO] Waiting for infrastructure to be ready..."
    sleep 30

    echo "[INFO] Checking infrastructure status..."
    kubectl wait --for=condition=ready pod -l app=mongo-users -n hotel-booking --timeout=120s >/dev/null 2>&1
    kubectl wait --for=condition=ready pod -l app=mongo-hotels -n hotel-booking --timeout=120s >/dev/null 2>&1
    kubectl wait --for=condition=ready pod -l app=mongo-bookings -n hotel-booking --timeout=120s >/dev/null 2>&1
    kubectl wait --for=condition=ready pod -l app=rabbitmq -n hotel-booking --timeout=120s >/dev/null 2>&1

    echo "[SUCCESS] Infrastructure is ready"
}

deploy_microservices() {
    echo "[INFO] Deploying microservices..."

    echo "[INFO] Deploying API Gateway..."
    kubectl apply -f k8s/api-gateway/deployment.yml

    echo "[INFO] Deploying Auth Service..."
    kubectl apply -f k8s/auth-service/deployment.yml

    echo "[INFO] Deploying User Service..."
    kubectl apply -f k8s/user-service/deployment.yml

    echo "[INFO] Deploying Hotel Service..."
    kubectl apply -f k8s/hotel-service/deployment.yml

    echo "[INFO] Deploying Booking Service..."
    kubectl apply -f k8s/booking-service/deployment.yml

    echo "[INFO] Deploying Notifications Service..."
    kubectl apply -f k8s/notifications-service/deployment.yml

    echo "[SUCCESS] All microservices deployed"

    echo "[INFO] Waiting for microservices to be ready..."
    sleep 45

    echo "[INFO] Checking microservices status..."
    kubectl wait --for=condition=ready pod -l app=api-gateway -n hotel-booking --timeout=120s >/dev/null 2>&1
    kubectl wait --for=condition=ready pod -l app=auth-service -n hotel-booking --timeout=120s >/dev/null 2>&1
    kubectl wait --for=condition=ready pod -l app=user-service -n hotel-booking --timeout=120s >/dev/null 2>&1
    kubectl wait --for=condition=ready pod -l app=hotel-service -n hotel-booking --timeout=120s >/dev/null 2>&1
    kubectl wait --for=condition=ready pod -l app=booking-service -n hotel-booking --timeout=120s >/dev/null 2>&1
    kubectl wait --for=condition=ready pod -l app=notifications-service -n hotel-booking --timeout=120s >/dev/null 2>&1

    echo "[SUCCESS] Microservices are ready"
}

deploy_frontend() {
    echo "[INFO] Deploying frontend..."
    kubectl apply -f k8s/frontend/deployment.yml
    echo "[SUCCESS] Frontend deployed"

    echo "[INFO] Waiting for frontend to be ready..."
    sleep 20

    kubectl wait --for=condition=ready pod -l app=frontend -n hotel-booking --timeout=120s >/dev/null 2>&1
    echo "[SUCCESS] Frontend is ready"
}

get_urls_info() {
    echo "[INFO] Getting service URLs..."

    MINIKUBE_IP=$(minikube ip)

    FRONTEND_PORT=$(kubectl get service frontend -n hotel-booking -o jsonpath='{.spec.ports[0].nodePort}' 2>/dev/null)
    API_GATEWAY_PORT=$(kubectl get service api-gateway -n hotel-booking -o jsonpath='{.spec.ports[0].nodePort}' 2>/dev/null)
    RABBITMQ_MGMT_PORT=$(kubectl get service rabbitmq -n hotel-booking -o jsonpath='{.spec.ports[1].nodePort}' 2>/dev/null)

    FRONTEND_PORT=${FRONTEND_PORT:-NotAvailable}
    API_GATEWAY_PORT=${API_GATEWAY_PORT:-NotAvailable}
    RABBITMQ_MGMT_PORT=${RABBITMQ_MGMT_PORT:-NotAvailable}

    echo
    echo "[SUCCESS] 🎉 Deployment completed successfully!"
    echo
    echo "📱 Application URLs:"
    echo "   Frontend:          http://$MINIKUBE_IP:$FRONTEND_PORT"
    echo "   API Gateway:       http://$MINIKUBE_IP:$API_GATEWAY_PORT"
    echo "   RabbitMQ Mgmt:     http://$MINIKUBE_IP:$RABBITMQ_MGMT_PORT"
    echo
    echo "🔍 Useful commands:"
    echo "   View all pods:     kubectl get pods -n hotel-booking"
    echo "   View services:     kubectl get services -n hotel-booking"
    echo "   API Gateway logs:  kubectl logs -f deployment/api-gateway -n hotel-booking"
    echo "   Dashboard:         minikube dashboard"
    echo
}

check_status() {
    echo "[INFO] Checking deployment status..."
    echo
    echo "📊 Pod Status:"
    kubectl get pods -n hotel-booking -o wide

    echo
    echo "🔧 Services:"
    kubectl get services -n hotel-booking

    echo
    echo "📈 PVC Status:"
    kubectl get pvc -n hotel-booking

    echo
    echo "📊 Resource Usage:"
    if kubectl top pods -n hotel-booking 2>/dev/null; then
        echo
    else
        echo "[INFO] Metrics not available yet, run: minikube addons enable metrics-server"
    fi
    echo
}

cleanup_resources() {
    echo "[WARNING] Cleaning up hotel-booking namespace..."
    echo "[INFO] Deleting all resources..."
    kubectl delete -f k8s/frontend/deployment.yml --ignore-not-found=true
    kubectl delete -f k8s/api-gateway/deployment.yml --ignore-not-found=true
    kubectl delete -f k8s/auth-service/deployment.yml --ignore-not-found=true
    kubectl delete -f k8s/user-service/deployment.yml --ignore-not-found=true
    kubectl delete -f k8s/hotel-service/deployment.yml --ignore-not-found=true
    kubectl delete -f k8s/booking-service/deployment.yml --ignore-not-found=true
    kubectl delete -f k8s/notifications-service/deployment.yml --ignore-not-found=true
    kubectl delete -f k8s/rabbitmq/deployment.yml --ignore-not-found=true
    kubectl delete -f k8s/databases/mongodb.yaml --ignore-not-found=true
    kubectl delete -f k8s/databases/pvc.yaml --ignore-not-found=true
    kubectl delete -f k8s/secrets.yaml --ignore-not-found=true
    kubectl delete -f k8s/configmap.yaml --ignore-not-found=true
    kubectl delete -f k8s/namespace.yaml --ignore-not-found=true

    echo "[SUCCESS] Cleanup completed"
}

port_forwarding() {
    echo "[INFO] Setting up port forwarding..."
    echo "Access your application at:"
    echo "  Frontend:          http://localhost:3000"
    echo "  API Gateway:       http://localhost:7000"
    echo "  RabbitMQ Management: http://localhost:15672"
    echo
    echo "Press Ctrl+C to stop port forwarding"

    # Start port forwarding in background
    kubectl port-forward service/frontend 3000:3000 -n hotel-booking &
    PID1=$!
    kubectl port-forward service/api-gateway 7000:7000 -n hotel-booking &
    PID2=$!
    kubectl port-forward service/rabbitmq 15672:15672 -n hotel-booking &
    PID3=$!

    # Wait for user interrupt
    echo "Press Ctrl+C to stop port forwarding..."
    trap 'kill $PID1 $PID2 $PID3; exit' INT
    wait
}

# Run main function with all arguments
main "$@"