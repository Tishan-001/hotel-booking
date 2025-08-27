@echo off
chcp 65001 >nul
echo 🚀 Starting Hotel Booking App deployment on Minikube...
echo.

:MAIN
if "%1"=="" goto DEPLOY

if "%1"=="deploy" goto DEPLOY
if "%1"=="status" goto STATUS
if "%1"=="cleanup" goto CLEANUP
if "%1"=="port-forward" goto PORT_FORWARD
if "%1"=="urls" goto URLS

echo Usage: %0 {deploy^|status^|cleanup^|port-forward^|urls}
echo.
echo Commands:
echo   deploy       - Deploy the entire application
echo   status       - Check deployment status
echo   cleanup      - Remove all resources
echo   port-forward - Set up local port forwarding
echo   urls         - Show application URLs
exit /b 1

:DEPLOY
call :CHECK_MINIKUBE
call :ENABLE_ADDONS
call :CREATE_NAMESPACE
call :DEPLOY_SECRETS
call :DEPLOY_CONFIGMAP
call :DEPLOY_INFRASTRUCTURE
call :DEPLOY_SERVICES
call :DEPLOY_FRONTEND
call :GET_URLS
goto :EOF

:STATUS
call :CHECK_STATUS
goto :EOF

:CLEANUP
call :CLEANUP
goto :EOF

:PORT_FORWARD
call :PORT_FORWARD
goto :EOF

:URLS
call :GET_URLS
goto :EOF

:CHECK_MINIKUBE
echo [INFO] Checking Minikube status...
minikube status >nul 2>&1
if %errorlevel% neq 0 (
    echo [WARNING] Minikube is not running. Starting Minikube...
    minikube start
    echo [SUCCESS] Minikube started successfully
) else (
    echo [SUCCESS] Minikube is already running
)
exit /b 0

:ENABLE_ADDONS
echo [INFO] Enabling Minikube addons...
minikube addons enable ingress
minikube addons enable dashboard
minikube addons enable metrics-server
echo [SUCCESS] Addons enabled
exit /b 0

:CREATE_NAMESPACE
echo [INFO] Creating namespace...
kubectl apply -f k8s/namespace.yaml
echo [SUCCESS] Namespace created
exit /b 0

:DEPLOY_SECRETS
echo [INFO] Deploying secrets...
kubectl apply -f k8s/secrets.yaml
echo [SUCCESS] Secrets deployed
exit /b 0

:DEPLOY_CONFIGMAP
echo [INFO] Deploying ConfigMap...
kubectl apply -f k8s/configmap.yaml
echo [SUCCESS] ConfigMap deployed
exit /b 0

:DEPLOY_INFRASTRUCTURE
echo [INFO] Deploying MongoDB instances and RabbitMQ...
kubectl apply -f k8s/mongodb.yaml
echo [SUCCESS] Infrastructure deployed

echo [INFO] Waiting for databases to be ready...
timeout /t 30 /nobreak >nul

REM Check if pods are ready
echo [INFO] Checking pod status...
kubectl wait --for=condition=ready pod -l app=mongo-users -n hotel-booking --timeout=120s >nul 2>&1
kubectl wait --for=condition=ready pod -l app=mongo-hotels -n hotel-booking --timeout=120s >nul 2>&1
kubectl wait --for=condition=ready pod -l app=mongo-bookings -n hotel-booking --timeout=120s >nul 2>&1
kubectl wait --for=condition=ready pod -l app=rabbitmq -n hotel-booking --timeout=120s >nul 2>&1

echo [SUCCESS] Infrastructure is ready
exit /b 0

:DEPLOY_SERVICES
echo [INFO] Deploying microservices...
kubectl apply -f k8s/microservices.yaml
echo [SUCCESS] Microservices deployed

echo [INFO] Waiting for microservices to be ready...
timeout /t 30 /nobreak >nul

REM Check if services are ready
echo [INFO] Checking service status...
kubectl wait --for=condition=ready pod -l app=api-gateway -n hotel-booking --timeout=120s >nul 2>&1
kubectl wait --for=condition=ready pod -l app=auth-service -n hotel-booking --timeout=120s >nul 2>&1

echo [SUCCESS] Microservices are ready
exit /b 0

:DEPLOY_FRONTEND
echo [INFO] Deploying frontend...
kubectl apply -f k8s/frontend.yml
echo [SUCCESS] Frontend deployed

echo [INFO] Waiting for frontend to be ready...
timeout /t 20 /nobreak >nul

kubectl wait --for=condition=ready pod -l app=frontend -n hotel-booking --timeout=120s >nul 2>&1
echo [SUCCESS] Frontend is ready
exit /b 0

:GET_URLS
echo [INFO] Getting service URLs...

for /f "tokens=*" %%i in ('minikube ip') do set MINIKUBE_IP=%%i

for /f "tokens=*" %%i in ('kubectl get service frontend -n hotel-booking -o jsonpath^="{.spec.ports[0].nodePort}" 2^>nul') do set FRONTEND_PORT=%%i
for /f "tokens=*" %%i in ('kubectl get service api-gateway -n hotel-booking -o jsonpath^="{.spec.ports[0].nodePort}" 2^>nul') do set API_GATEWAY_PORT=%%i

if "%FRONTEND_PORT%"=="" set FRONTEND_PORT=NotAvailable
if "%API_GATEWAY_PORT%"=="" set API_GATEWAY_PORT=NotAvailable

echo.
echo [SUCCESS] 🎉 Deployment completed successfully!
echo.
echo 📱 Application URLs:
echo    Frontend:     http://%MINIKUBE_IP%:%FRONTEND_PORT%
echo    API Gateway:  http://%MINIKUBE_IP%:%API_GATEWAY_PORT%
echo.
echo 🔍 Useful commands:
echo    View pods:    kubectl get pods -n hotel-booking
echo    View logs:    kubectl logs -f deployment/api-gateway -n hotel-booking
echo    Port forward: kubectl port-forward service/frontend 3000:3000 -n hotel-booking
echo    Dashboard:    minikube dashboard
echo.
exit /b 0

:CHECK_STATUS
echo [INFO] Checking deployment status...
echo.
echo 📊 Pod Status:
kubectl get pods -n hotel-booking -o wide

echo.
echo 🔧 Services:
kubectl get services -n hotel-booking

echo.
echo 📈 Resource Usage:
kubectl top pods -n hotel-booking 2>nul
if %errorlevel% neq 0 echo [WARNING] Metrics not available yet
echo.
exit /b 0

:CLEANUP
echo [WARNING] Cleaning up hotel-booking namespace...
kubectl delete namespace hotel-booking --ignore-not-found=true
echo [SUCCESS] Cleanup completed
exit /b 0

:PORT_FORWARD
echo [INFO] Setting up port forwarding...
echo Access your application at:
echo   Frontend: http://localhost:3000
echo   API Gateway: http://localhost:7000
echo   RabbitMQ Management: http://localhost:15672
echo.
echo Press Ctrl+C to stop port forwarding

REM Start port forwarding in background
start /b kubectl port-forward service/frontend 3000:3000 -n hotel-booking
start /b kubectl port-forward service/api-gateway 7000:7000 -n hotel-booking
start /b kubectl port-forward service/rabbitmq 15672:15672 -n hotel-booking

REM Wait for user input
echo Press any key to stop port forwarding...
pause >nul

REM Kill background processes
taskkill /f /im kubectl.exe >nul 2>&1
echo Port forwarding stopped.
exit /b 0