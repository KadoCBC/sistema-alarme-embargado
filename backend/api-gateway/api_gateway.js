const httpProxy = require('express-http-proxy');
const express = require('express');
const app = express();
var logger = require('morgan');

app.use(logger('dev'));

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
    
    // Endpoints para acionamento (agora no serviço de controle)
    if (req.path.startsWith('/acionamento/ativar') || 
        req.path.startsWith('/acionamento/desativar') ||
        req.path.startsWith('/acionamento/historico') ||
        req.path.startsWith('/acionamento/status') ||
        req.path.startsWith('/acionamento/confirmacao')) {
        return 'http://localhost:8090/'; // Controle service
    }
    
    // Endpoints legados
    if (req.path.startsWith('/usuarios')) {
        return 'http://localhost:8080/';
    } else if (req.path.startsWith('/alarmes')) {
        return 'http://localhost:8090/';
    } else if (req.path.startsWith('/acionamento')) {
        return 'http://localhost:8090/'; // Agora no controle service
    } else if (req.path.startsWith('/disparo')) {
        return 'http://localhost:8110/';
    } else if (req.path.startsWith('/registros')) {
        return 'http://localhost:8120/';
    } else {
        return null;
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
                'GET /logs/periodo - Obter logs por período',
                'POST /acionamento/ativar - Ativar sistema',
                'POST /acionamento/desativar - Desativar sistema',
                'GET /acionamento/historico - Histórico de acionamentos',
                'GET /acionamento/status - Status atual do sistema'
            ]
        });
    } else {
        httpProxy(proxyHost)(req, res, next);
    }
});

app.listen(8000, () => {
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
    console.log('- POST /acionamento/ativar (App)');
    console.log('- POST /acionamento/desativar (App)');
    console.log('- GET /acionamento/historico (App)');
    console.log('- GET /acionamento/status (App)');
});