const express = require('express');
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3');

const app = express();
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));

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
            // Se não há configuração, cria uma padrão e retorna
            console.log('Configuração não encontrada, criando configuração padrão...');
            db.run(`INSERT INTO configuracoes (id, sistema_ativo, tempo_buzzer, sensibilidade, intervalo_consulta) 
                    VALUES (1, 1, 2000, 50, 10000)`, (err) => {
                if (err) {
                    console.log('Erro ao criar configuração padrão:', err);
                    // Retorna configuração padrão mesmo com erro
                    res.status(200).json({
                        id: 1,
                        sistema_ativo: true,
                        tempo_buzzer: 2000,
                        sensibilidade: 50,
                        intervalo_consulta: 10000,
                        created_at: new Date().toISOString(),
                        updated_at: new Date().toISOString()
                    });
                } else {
                    console.log('Configuração padrão criada com sucesso!');
                    // Retorna a configuração padrão criada
                    res.status(200).json({
                        id: 1,
                        sistema_ativo: true,
                        tempo_buzzer: 2000,
                        sensibilidade: 50,
                        intervalo_consulta: 10000,
                        created_at: new Date().toISOString(),
                        updated_at: new Date().toISOString()
                    });
                }
            });
        } else {
            // Retorna a configuração existente
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

    // Primeiro verifica se existe configuração
    db.get('SELECT id FROM configuracoes WHERE id = 1', [], (err, result) => {
        if (err) {
            console.log('Erro ao verificar configuração:', err);
            res.status(500).send('Erro ao verificar configuração.');
        } else if (!result) {
            // Se não existe, cria uma nova configuração
            console.log('Configuração não encontrada, criando nova configuração...');
            db.run(`INSERT INTO configuracoes (id, sistema_ativo, tempo_buzzer, sensibilidade, intervalo_consulta) 
                    VALUES (1, 1, ?, ?, ?)`,
                [tempo_buzzer, sensibilidade, intervalo_consulta],
                function (err) {
                    if (err) {
                        console.log('Erro ao criar configuração:', err);
                        res.status(500).send('Erro ao criar configuração.');
                    } else {
                        console.log('Configuração criada com sucesso!');
                        res.status(200).json({
                            message: 'Configurações criadas com sucesso!',
                            variavel1: sensibilidade,
                            variavel2: tempo_buzzer,
                            variavel3: intervalo_consulta
                        });
                    }
                });
        } else {
            // Se existe, atualiza a configuração
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
                    } else {
                        console.log('Configurações atualizadas com sucesso!');
                        res.status(200).json({
                            message: 'Configurações atualizadas com sucesso!',
                            variavel1: sensibilidade,
                            variavel2: tempo_buzzer,
                            variavel3: intervalo_consulta
                        });
                    }
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

// Inicia o servidor
const porta = 8090;
app.listen(porta, '0.0.0.0', () => {
    console.log('Serviço de configuração do embargado rodando na porta: ' + porta);
    console.log('Endpoints disponíveis:');
    console.log('- GET /config (ESP32)');
    console.log('- GET /configuracoes (App)');
    console.log('- PUT /configuracoes (App)');
    console.log('- PUT /configuracoes/sistema (App)');
});


