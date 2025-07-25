const express = require('express');
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3');

const app = express();
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));

// Acessa o arquivo com o banco de dados
var db = new sqlite3.Database('./dados.db', (err) => {
    if (err) {
        console.log('ERRO: não foi possível conectar ao SQLite.');
        throw err;
    }
    console.log('Conectado ao SQLite!');
});

// Cria a tabela "logs" se não existir - para dados de sensores do ESP32
db.run(`CREATE TABLE IF NOT EXISTS logs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    movimento_detectado BOOLEAN NOT NULL,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
    sistema_ativo BOOLEAN DEFAULT 1,
    tempo_buzzer INTEGER DEFAULT 2000,
    sensibilidade INTEGER DEFAULT 50,
    observacoes TEXT
)`, (err) => {
    if (err) {
        console.log('ERRO ao criar tabela logs.');
        throw err;
    }
    console.log('Tabela logs criada/verificada com sucesso!');
});

// ==================== ENDPOINTS PARA SISTEMA EMBARCADO ====================

// POST - Receber dados de sensor do ESP32
app.post('/logs/sensor', async (req, res) => {
    const { movimento_detectado, sistema_ativo, tempo_buzzer, sensibilidade, observacoes } = req.body || {};
    const timestamp = new Date().toISOString();

    try {
        // Registra o log do sensor
        await new Promise((resolve, reject) => {
            db.run(
                `INSERT INTO logs (movimento_detectado, timestamp, sistema_ativo, tempo_buzzer, sensibilidade, observacoes) 
                 VALUES (?, ?, ?, ?, ?, ?)`,
                [
                    movimento_detectado ? 1 : 0,
                    timestamp,
                    sistema_ativo ? 1 : 0,
                    tempo_buzzer || 2000,
                    sensibilidade || 50,
                    observacoes || null
                ],
                function (err) {
                    if (err) reject(err);
                    else resolve();
                }
            );
        });

        res.status(200).json({
            message: 'Log de sensor registrado com sucesso!',
            timestamp: timestamp,
            movimento_detectado: movimento_detectado
        });

    } catch (err) {
        console.error('Erro ao registrar log de sensor:', err);
        res.status(500).send('Erro ao registrar log de sensor.');
    }
});

// ==================== ENDPOINTS PARA APP MOBILE ====================

// GET - Obter histórico de leituras de sensores (para o app)
app.get('/logs/sensores', (req, res) => {
    const { limit = 100, offset = 0 } = req.query;

    db.all(
        `SELECT * FROM logs 
         ORDER BY timestamp DESC 
         LIMIT ? OFFSET ?`,
        [parseInt(limit), parseInt(offset)],
        (err, result) => {
            if (err) {
                console.log('Erro ao obter logs de sensores:', err);
                res.status(500).send('Erro ao obter logs de sensores.');
            } else {
                res.status(200).json({
                    logs: result,
                    total: result.length,
                    limit: parseInt(limit),
                    offset: parseInt(offset)
                });
            }
        }
    );
});

// GET - Obter estatísticas dos sensores (para o app)
app.get('/logs/estatisticas', (req, res) => {
    db.get(
        `SELECT 
            COUNT(*) as total_registros,
            SUM(CASE WHEN movimento_detectado = 1 THEN 1 ELSE 0 END) as movimentos_detectados,
            MAX(timestamp) as ultima_leitura,
            MIN(timestamp) as primeira_leitura
         FROM logs`,
        [],
        (err, result) => {
            if (err) {
                console.log('Erro ao obter estatísticas:', err);
                res.status(500).send('Erro ao obter estatísticas.');
            } else {
                res.status(200).json({
                    total_registros: result.total_registros || 0,
                    movimentos_detectados: result.movimentos_detectados || 0,
                    ultima_leitura: result.ultima_leitura,
                    primeira_leitura: result.primeira_leitura,
                    percentual_movimento: result.total_registros > 0 
                        ? ((result.movimentos_detectados / result.total_registros) * 100).toFixed(2)
                        : 0
                });
            }
        }
    );
});

// GET - Obter logs por período (para o app)
app.get('/logs/periodo', (req, res) => {
    const { inicio, fim } = req.query;

    if (!inicio || !fim) {
        return res.status(400).send('Parâmetros inicio e fim são obrigatórios.');
    }

    db.all(
        `SELECT * FROM logs 
         WHERE timestamp BETWEEN ? AND ?
         ORDER BY timestamp DESC`,
        [inicio, fim],
        (err, result) => {
            if (err) {
                console.log('Erro ao obter logs por período:', err);
                res.status(500).send('Erro ao obter logs por período.');
            } else {
                res.status(200).json({
                    logs: result,
                    total: result.length,
                    periodo: { inicio, fim }
                });
            }
        }
    );
});

// Inicia o servidor
const porta = 8120;
app.listen(porta, '0.0.0.0', () => {
    console.log('Serviço de logs rodando na porta: ' + porta);
    console.log('Endpoints disponíveis:');
    console.log('- POST /logs/sensor (ESP32)');
    console.log('- GET /logs/sensores (App)');
    console.log('- GET /logs/estatisticas (App)');
    console.log('- GET /logs/periodo (App)');
});