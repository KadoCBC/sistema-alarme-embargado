const express = require('express');
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3');
const axios = require('axios');

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

// Cria a tabela "configuracoes" se não existir - para parâmetros do sistema embarcado
db.run(`CREATE TABLE IF NOT EXISTS configuracoes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    sistema_ativo BOOLEAN DEFAULT 1,
    tempo_buzzer INTEGER DEFAULT 2000,
    sensibilidade INTEGER DEFAULT 50,
    intervalo_consulta INTEGER DEFAULT 10000,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
)`, (err) => {
    if (err) {
        console.log('ERRO ao criar tabela configuracoes.');
        throw err;
    }
    console.log('Tabela configuracoes criada/verificada com sucesso!');
});

// Cria a tabela "alarmes" se não existir - para gerenciamento de alarmes
db.run(`CREATE TABLE IF NOT EXISTS alarmes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nome_local TEXT NOT NULL,
    status BOOLEAN DEFAULT 1,
    pontos_monitorados TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
)`, (err) => {
    if (err) {
        console.log('ERRO ao criar tabela alarmes.');
        throw err;
    }
    console.log('Tabela alarmes criada/verificada com sucesso!');
});

// Cria a tabela "permissoes" se não existir
db.run(`CREATE TABLE IF NOT EXISTS permissoes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    id_alarme INTEGER,
    id_usuario INTEGER,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_alarme) REFERENCES alarmes (id)
)`, (err) => {
    if (err) {
        console.log('ERRO ao criar tabela permissoes.');
        throw err;
    }
    console.log('Tabela permissoes criada/verificada com sucesso!');
});

// Cria a tabela "acionamentos" se não existir - para controle de ativação/desativação
db.run(`CREATE TABLE IF NOT EXISTS acionamentos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    tipo_acionamento TEXT NOT NULL,
    status BOOLEAN DEFAULT 1,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
    dados_adicionais TEXT,
    observacoes TEXT
)`, (err) => {
    if (err) {
        console.log('ERRO ao criar tabela acionamentos.');
        throw err;
    }
    console.log('Tabela acionamentos criada/verificada com sucesso!');
});

// Inicializa configuração padrão se não existir
db.get('SELECT * FROM configuracoes WHERE id = 1', [], (err, result) => {
    if (err) {
        console.log('Erro ao verificar configuração inicial:', err);
    } else if (!result) {
        db.run(`INSERT INTO configuracoes (id, sistema_ativo, tempo_buzzer, sensibilidade, intervalo_consulta) 
                VALUES (1, 1, 2000, 50, 10000)`, (err) => {
            if (err) {
                console.log('Erro ao inserir configuração inicial:', err);
            } else {
                console.log('Configuração inicial criada com sucesso!');
            }
        });
    }
});

// ==================== ENDPOINTS PARA SISTEMA EMBARCADO ====================

// GET - Obter configurações para o ESP32 (compatível com o código atual)
app.get('/config', (req, res) => {
    db.get('SELECT sistema_ativo, tempo_buzzer FROM configuracoes WHERE id = 1', [], (err, result) => {
        if (err) {
            console.log('Erro ao obter configurações:', err);
            res.status(500).json({ 
                sistema_ativo: false, 
                tempo_buzzer: 2000 
            });
        } else if (!result) {
            res.status(404).json({ 
                sistema_ativo: false, 
                tempo_buzzer: 2000 
            });
        } else {
            res.status(200).json({
                sistema_ativo: result.sistema_ativo === 1,
                tempo_buzzer: result.tempo_buzzer
            });
        }
    });
});

// ==================== ENDPOINTS PARA APP MOBILE ====================

// GET - Obter todas as configurações para o app
app.get('/configuracoes', (req, res) => {
    db.get('SELECT * FROM configuracoes WHERE id = 1', [], (err, result) => {
        if (err) {
            console.log('Erro ao obter configurações:', err);
            res.status(500).send('Erro ao obter configurações.');
        } else if (!result) {
            res.status(404).send('Configuração não encontrada.');
        } else {
            res.status(200).json({
                id: result.id,
                sistema_ativo: result.sistema_ativo === 1,
                tempo_buzzer: result.tempo_buzzer,
                sensibilidade: result.sensibilidade,
                intervalo_consulta: result.intervalo_consulta,
                created_at: result.created_at,
                updated_at: result.updated_at
            });
        }
    });
});

// PUT - Atualizar configurações do app (compatível com as 3 variáveis do app)
app.put('/configuracoes', (req, res) => {
    const { variavel1, variavel2, variavel3 } = req.body;

    // Mapeamento das variáveis do app para os parâmetros do sistema
    // variavel1 = sensibilidade, variavel2 = tempo_buzzer, variavel3 = intervalo_consulta
    const sensibilidade = variavel1 || 50;
    const tempo_buzzer = variavel2 || 2000;
    const intervalo_consulta = variavel3 || 10000;

    db.run(`UPDATE configuracoes SET 
            sensibilidade = ?, 
            tempo_buzzer = ?, 
            intervalo_consulta = ?,
            updated_at = CURRENT_TIMESTAMP
            WHERE id = 1`,
        [sensibilidade, tempo_buzzer, intervalo_consulta],
        function (err) {
            if (err) {
                console.log('Erro ao atualizar configurações:', err);
                res.status(500).send('Erro ao atualizar configurações.');
            } else if (this.changes === 0) {
                res.status(404).send('Configuração não encontrada.');
            } else {
                res.status(200).json({
                    message: 'Configurações atualizadas com sucesso!',
                    variavel1: sensibilidade,
                    variavel2: tempo_buzzer,
                    variavel3: intervalo_consulta
                });
            }
        });
});

// PUT - Ativar/Desativar sistema
app.put('/configuracoes/sistema', (req, res) => {
    const { sistema_ativo } = req.body;

    if (sistema_ativo === undefined) {
        return res.status(400).send('Campo sistema_ativo é obrigatório.');
    }

    db.run(`UPDATE configuracoes SET 
            sistema_ativo = ?,
            updated_at = CURRENT_TIMESTAMP
            WHERE id = 1`,
        [sistema_ativo ? 1 : 0],
        function (err) {
            if (err) {
                console.log('Erro ao atualizar status do sistema:', err);
                res.status(500).send('Erro ao atualizar status do sistema.');
            } else if (this.changes === 0) {
                res.status(404).send('Configuração não encontrada.');
            } else {
                res.status(200).json({
                    message: `Sistema ${sistema_ativo ? 'ativado' : 'desativado'} com sucesso!`,
                    sistema_ativo: sistema_ativo
                });
            }
        });
});

// ==================== ENDPOINTS PARA ACIONAMENTO ====================

// POST - Ativar sistema embarcado
app.post('/acionamento/ativar', async (req, res) => {
    const { observacoes } = req.body || {};

    try {
        // Registra o acionamento
        await new Promise((resolve, reject) => {
            db.run(
                `INSERT INTO acionamentos (tipo_acionamento, status, observacoes) 
                 VALUES (?, ?, ?)`,
                ['Ativação Sistema', 1, observacoes || 'Ativação manual via API'],
                function (err) {
                    if (err) reject(err);
                    else resolve();
                }
            );
        });

        // Ativa o sistema nas configurações
        await new Promise((resolve, reject) => {
            db.run(
                `UPDATE configuracoes SET sistema_ativo = 1, updated_at = CURRENT_TIMESTAMP WHERE id = 1`,
                function (err) {
                    if (err) reject(err);
                    else resolve();
                }
            );
        });

        console.log('Sistema embarcado ativado via API');

        res.status(200).json({
            message: 'Sistema embarcado ativado com sucesso!',
            timestamp: new Date().toISOString(),
            tipo: 'Ativação Sistema'
        });

    } catch (err) {
        console.error('Erro ao ativar sistema:', err);
        res.status(500).send('Erro ao ativar sistema.');
    }
});

// POST - Desativar sistema embarcado
app.post('/acionamento/desativar', async (req, res) => {
    const { observacoes } = req.body || {};

    try {
        // Registra o acionamento
        await new Promise((resolve, reject) => {
            db.run(
                `INSERT INTO acionamentos (tipo_acionamento, status, observacoes) 
                 VALUES (?, ?, ?)`,
                ['Desativação Sistema', 0, observacoes || 'Desativação manual via API'],
                function (err) {
                    if (err) reject(err);
                    else resolve();
                }
            );
        });

        // Desativa o sistema nas configurações
        await new Promise((resolve, reject) => {
            db.run(
                `UPDATE configuracoes SET sistema_ativo = 0, updated_at = CURRENT_TIMESTAMP WHERE id = 1`,
                function (err) {
                    if (err) reject(err);
                    else resolve();
                }
            );
        });

        console.log('Sistema embarcado desativado via API');

        res.status(200).json({
            message: 'Sistema embarcado desativado com sucesso!',
            timestamp: new Date().toISOString(),
            tipo: 'Desativação Sistema'
        });

    } catch (err) {
        console.error('Erro ao desativar sistema:', err);
        res.status(500).send('Erro ao desativar sistema.');
    }
});

// GET - Obter histórico de acionamentos
app.get('/acionamento/historico', (req, res) => {
    const { limit = 50, offset = 0 } = req.query;

    db.all(
        `SELECT * FROM acionamentos 
         ORDER BY timestamp DESC 
         LIMIT ? OFFSET ?`,
        [parseInt(limit), parseInt(offset)],
        (err, result) => {
            if (err) {
                console.log('Erro ao obter histórico de acionamentos:', err);
                res.status(500).send('Erro ao obter histórico de acionamentos.');
            } else {
                res.status(200).json({
                    acionamentos: result,
                    total: result.length,
                    limit: parseInt(limit),
                    offset: parseInt(offset)
                });
            }
        }
    );
});

// GET - Obter status atual do sistema
app.get('/acionamento/status', (req, res) => {
    db.get(
        `SELECT * FROM acionamentos 
         ORDER BY timestamp DESC 
         LIMIT 1`,
        [],
        (err, result) => {
            if (err) {
                console.log('Erro ao obter status do sistema:', err);
                res.status(500).send('Erro ao obter status do sistema.');
            } else {
                res.status(200).json({
                    status: result ? (result.status === 1 ? 'ativo' : 'inativo') : 'desconhecido',
                    ultimo_acionamento: result ? result.timestamp : null,
                    tipo_ultimo_acionamento: result ? result.tipo_acionamento : null
                });
            }
        }
    );
});

// POST - Receber confirmação de acionamento do ESP32
app.post('/acionamento/confirmacao', async (req, res) => {
    const { tipo_acionamento, status, dados_adicionais } = req.body || {};

    try {
        await new Promise((resolve, reject) => {
            db.run(
                `INSERT INTO acionamentos (tipo_acionamento, status, dados_adicionais) 
                 VALUES (?, ?, ?)`,
                [
                    tipo_acionamento || 'Confirmação ESP32',
                    status ? 1 : 0,
                    dados_adicionais ? JSON.stringify(dados_adicionais) : null
                ],
                function (err) {
                    if (err) reject(err);
                    else resolve();
                }
            );
        });

        res.status(200).json({
            message: 'Confirmação de acionamento registrada com sucesso!',
            timestamp: new Date().toISOString()
        });

    } catch (err) {
        console.error('Erro ao registrar confirmação de acionamento:', err);
        res.status(500).send('Erro ao registrar confirmação de acionamento.');
    }
});

// ==================== ENDPOINTS PARA LOGS (INTEGRAÇÃO) ====================

// POST - Receber dados de sensor do ESP32
app.post('/logs/sensor', (req, res) => {
    const { movimento_detectado, timestamp } = req.body;

    // TODO: Implementar integração com logs-service
    // Por enquanto, apenas confirma recebimento
    console.log('Dados de sensor recebidos:', { movimento_detectado, timestamp });
    
    res.status(200).json({
        message: 'Dados de sensor recebidos com sucesso!',
        timestamp: new Date().toISOString()
    });
});

// Inicia o servidor
const porta = 8090;
app.listen(porta, () => {
    console.log('Microserviço de controle rodando na porta: ' + porta);
    console.log('Endpoints disponíveis:');
    console.log('- GET /config (ESP32)');
    console.log('- GET /configuracoes (App)');
    console.log('- PUT /configuracoes (App)');
    console.log('- PUT /configuracoes/sistema (App)');
    console.log('- POST /acionamento/ativar (App)');
    console.log('- POST /acionamento/desativar (App)');
    console.log('- GET /acionamento/historico (App)');
    console.log('- GET /acionamento/status (App)');
    console.log('- POST /acionamento/confirmacao (ESP32)');
});


