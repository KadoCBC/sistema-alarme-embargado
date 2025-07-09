# 🔧 Backend - Sistema de Alarme Embargado

Sistema de backend distribuído em microserviços para integração entre sistema embarcado (ESP32) e aplicativo móvel.

## 🏗️ Arquitetura

### Microserviços

| Serviço | Porta | Descrição |
|---------|-------|-----------|
| **API Gateway** | 8000 | Roteamento e proxy de requisições |
| **Controle Service** | 8090 | Configurações do sistema embarcado |
| **Logs Service** | 8120 | Registro de dados de sensores |

## 🚀 Como Executar

### Pré-requisitos
- Node.js (versão 14 ou superior)
- npm ou yarn

### Instalação e Execução

```bash
# 1. Instalar dependências do API Gateway
cd backend/api-gateway
npm install

# 2. Instalar dependências do Controle Service
cd ../alarmes-service
npm install

# 3. Instalar dependências do Logs Service
cd ../logs-service
npm install

# 4. Executar todos os serviços (em terminais separados)
# Terminal 1 - API Gateway
cd backend/api-gateway
npm start

# Terminal 2 - Controle Service
cd backend/alarmes-service
node controle.js

# Terminal 3 - Logs Service
cd backend/logs-service
node registro_logs.js
```

## 📡 Endpoints Disponíveis

### 🔧 Controle Service (8090)

#### Para ESP32
- `GET /config` - Obter configurações do sistema
  ```json
  {
    "sistema_ativo": true,
    "tempo_buzzer": 2000
  }
  ```

#### Para App Mobile
- `GET /configuracoes` - Obter todas as configurações
- `PUT /configuracoes` - Atualizar configurações
  ```json
  {
    "variavel1": 50,  // sensibilidade
    "variavel2": 2000, // tempo_buzzer
    "variavel3": 10000 // intervalo_consulta
  }
  ```
- `PUT /configuracoes/sistema` - Ativar/Desativar sistema
  ```json
  {
    "sistema_ativo": true
  }
  ```

### 📊 Logs Service (8120)

#### Para ESP32
- `POST /logs/sensor` - Enviar dados de sensor
  ```json
  {
    "movimento_detectado": true,
    "sistema_ativo": true,
    "tempo_buzzer": 2000,
    "sensibilidade": 50,
    "observacoes": "Movimento detectado no sensor PIR"
  }
  ```

#### Para App Mobile
- `GET /logs/sensores` - Obter histórico de sensores
- `GET /logs/estatisticas` - Obter estatísticas
- `GET /logs/periodo?inicio=2024-01-01&fim=2024-01-31` - Logs por período

## 🗄️ Estrutura do Banco de Dados

### Tabela `configuracoes`
```sql
CREATE TABLE configuracoes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    sistema_ativo BOOLEAN DEFAULT 1,
    tempo_buzzer INTEGER DEFAULT 2000,
    sensibilidade INTEGER DEFAULT 50,
    intervalo_consulta INTEGER DEFAULT 10000,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

### Tabela `logs`
```sql
CREATE TABLE logs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    movimento_detectado BOOLEAN NOT NULL,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
    sistema_ativo BOOLEAN DEFAULT 1,
    tempo_buzzer INTEGER DEFAULT 2000,
    sensibilidade INTEGER DEFAULT 50,
    observacoes TEXT
);
```

## 🔄 Fluxo de Integração

### 1. ESP32 → Backend
1. ESP32 consulta `GET /config` para obter configurações
2. ESP32 envia dados de sensor via `POST /logs/sensor`

### 2. App Mobile → Backend
1. App consulta `GET /configuracoes` para obter configurações atuais
2. App atualiza configurações via `PUT /configuracoes`
3. App ativa/desativa sistema via `PUT /configuracoes/sistema`
4. App consulta logs via `GET /logs/sensores`

### 3. Backend → ESP32
1. Configurações são lidas pelo ESP32 periodicamente
2. Logs são registrados automaticamente

## 🛠️ Desenvolvimento

### Adicionando Novos Endpoints

1. **Controle Service**: Adicione endpoints em `alarmes-service/controle.js`
2. **Logs Service**: Adicione endpoints em `logs-service/registro_logs.js`
3. **API Gateway**: Atualize roteamento em `api-gateway/api_gateway.js`

### Estrutura de Resposta Padrão

```json
{
  "message": "Operação realizada com sucesso!",
  "timestamp": "2024-01-01T12:00:00.000Z",
  "data": {
    // dados específicos da operação
  }
}
```

### Tratamento de Erros

```json
{
  "error": "Descrição do erro",
  "message": "Mensagem detalhada",
  "timestamp": "2024-01-01T12:00:00.000Z"
}
```

## 🔍 Monitoramento

### Logs dos Serviços
- **API Gateway**: Logs de roteamento e proxy
- **Controle Service**: Logs de configurações
- **Logs Service**: Logs de dados de sensores

### Endpoints de Status
- `GET /logs/estatisticas` - Estatísticas de sensores

## 🚨 TODO

- [ ] Implementar autenticação e autorização
- [ ] Adicionar validação de dados
- [ ] Implementar notificações em tempo real
- [ ] Adicionar testes automatizados
- [ ] Implementar comunicação direta com ESP32
- [ ] Adicionar monitoramento de saúde dos serviços
- [ ] Implementar cache para melhor performance
- [ ] Adicionar documentação da API (Swagger)

---

**Sistema de backend integrado para alarme embargado** 🔧 