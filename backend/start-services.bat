@echo off
echo ========================================
echo    Sistema de Alarme Embargado
echo    Iniciando Microservicos
echo ========================================
echo.

echo [1/3] Instalando dependencias...
cd alarmes-service
call npm install
cd ..

cd logs-service
call npm install
cd ..

cd api-gateway
call npm install
cd ..

echo.
echo [2/3] Iniciando API Gateway (porta 8000)...
start "API Gateway" cmd /k "cd api-gateway && npm start"

echo [3/3] Iniciando Controle Service (porta 8090)...
start "Controle Service" cmd /k "cd alarmes-service && node controle.js"

echo [4/3] Iniciando Logs Service (porta 8120)...
start "Logs Service" cmd /k "cd logs-service && node registro_logs.js"

echo.
echo ========================================
echo    Todos os servicos iniciados!
echo ========================================
echo.
echo Servicos ativos:
echo - API Gateway: http://localhost:8000
echo - Controle Service: http://localhost:8090
echo - Logs Service: http://localhost:8120
echo.
echo Endpoints principais:
echo - GET /config (ESP32)
echo - GET /configuracoes (App)
echo - PUT /configuracoes (App)
echo - PUT /configuracoes/sistema (App)
echo - POST /logs/sensor (ESP32)
echo - GET /logs/sensores (App)
echo - GET /logs/estatisticas (App)
echo - GET /logs/periodo (App)
echo.
echo Pressione qualquer tecla para sair...
pause > nul 