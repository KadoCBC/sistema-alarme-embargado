const httpProxy = require('express-http-proxy');
const express = require('express');
const app = express();
var logger = require('morgan');

app.use(logger('dev'));

// Adicionar headers CORS
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    
    if (req.method === 'OPTIONS') {
        res.sendStatus(200);
    } else {
        next();
    }
});

function selectProxyHost(req) {
    // Endpoints para sistema embarcado (ESP32)
    if (req.path.startsWith('/config') && req.method === 'GET') {
        return 'http://localhost:8090/'; // Controle service
    }
    
    // Endpoints para logs de sensores
    if (req.path.startsWith('/logs/sensor') && req.method === 'POST') {
        return 'http://localhost:8120/'; // Logs service
    }
    
    // Endpoints para configurações do app
    if (req.path.startsWith('/configuracoes')) {
        return 'http://localhost:8090/'; // Controle service
    }
    
    // Endpoints para logs do app
    if (req.path.startsWith('/logs/sensores') || 
        req.path.startsWith('/logs/estatisticas') || 
        req.path.startsWith('/logs/periodo')) {
        return 'http://localhost:8120/'; // Logs service
    }
}

app.use((req, res, next) => {
    var proxyHost = selectProxyHost(req);
    if (proxyHost == null) {
        res.status(404).json({
            error: 'Endpoint não encontrado',
            message: 'O endpoint solicitado não está configurado no API Gateway',
            available_endpoints: [
                'GET /config - Obter configurações para ESP32',
                'POST /logs/sensor - Enviar dados de sensor',
                'GET /configuracoes - Obter configurações para app',
                'PUT /configuracoes - Atualizar configurações do app',
                'PUT /configuracoes/sistema - Ativar/Desativar sistema',
                'GET /logs/sensores - Obter histórico de sensores',
                'GET /logs/estatisticas - Obter estatísticas',
                'GET /logs/periodo - Obter logs por período'
            ]
        });
    } else {
        httpProxy(proxyHost)(req, res, next);
    }
});

app.listen(8000, '0.0.0.0', () => {
    console.log('API Gateway iniciado na porta 8000!');
    console.log('Endpoints disponíveis:');
    console.log('- GET /config (ESP32)');
    console.log('- POST /logs/sensor (ESP32)');
    console.log('- GET /configuracoes (App)');
    console.log('- PUT /configuracoes (App)');
    console.log('- PUT /configuracoes/sistema (App)');
    console.log('- GET /logs/sensores (App)');
    console.log('- GET /logs/estatisticas (App)');
    console.log('- GET /logs/periodo (App)');
});