# 🔔 Sistema de Alarme Embargado

Sistema completo de alarme IoT composto por dispositivo embarcado (ESP32), backend em microserviços e aplicativo móvel.

## 🏗️ Arquitetura do Sistema

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   ESP32 Device  │    │   Backend API   │    │  Mobile App     │
│                 │    │                 │    │                 │
│ • Sensor PIR    │◄──►│ • API Gateway   │◄──►│ • React Native  │
│ • Display OLED  │    │ • Controle Svc  │    │ • Expo          │
│ • Buzzer        │    │ • Logs Service  │    │ • TypeScript    │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## 📁 Estrutura do Projeto

```
ProjetoFinal-Embargados/
├── embargado/                    # Sistema Embarcado (ESP32)
│   ├── Esp32_archive.ino        # Código principal do ESP32
│   ├── README.md                 # Documentação do ESP32
│   └── LICENSE                   # Licença
├── backend/                      # Backend em Microserviços
│   ├── api-gateway/             # API Gateway (porta 8000)
│   ├── alarmes-service/         # Controle Service (porta 8090)
│   ├── logs-service/            # Logs Service (porta 8120)
│   ├── README.md                # Documentação do Backend
│   └── start-services.bat       # Script de inicialização
└── frontend/                    # Aplicativo Móvel
    └── embargado-app/           # App React Native
        ├── src/                 # Código fonte
        ├── App.tsx              # Componente principal
        └── README.md            # Documentação do App
```

## 🚀 Funcionalidades

### 🔧 Sistema Embarcado (ESP32)
- **Sensor PIR**: Detecção de movimento
- **Display OLED**: Interface visual
- **Buzzer**: Alarme sonoro
- **Wi-Fi**: Comunicação com backend
- **Configuração Remota**: Parâmetros via API

### ⚙️ Backend (Microserviços)
- **API Gateway**: Roteamento centralizado
- **Controle Service**: Configurações e acionamento
- **Logs Service**: Registro de dados de sensores
- **SQLite**: Banco de dados local

### 📱 Aplicativo Móvel
- **React Native**: Framework multiplataforma
- **Expo**: Desenvolvimento simplificado
- **TypeScript**: Tipagem estática
- **Interface Intuitiva**: Configuração de parâmetros

## 🛠️ Tecnologias Utilizadas

### Hardware
- **ESP32**: Microcontrolador principal
- **Sensor PIR HC-SR501**: Detecção de movimento
- **Display OLED 0.96"**: Interface visual
- **Buzzer Ativo**: Alarme sonoro

### Backend
- **Node.js**: Runtime JavaScript
- **Express.js**: Framework web
- **SQLite**: Banco de dados
- **Axios**: Cliente HTTP

### Frontend
- **React Native**: Framework mobile
- **Expo**: Plataforma de desenvolvimento
- **TypeScript**: Linguagem tipada

## 📦 Instalação e Execução

### Pré-requisitos
- Node.js (versão 14 ou superior)
- Arduino IDE (para ESP32)
- Expo CLI
- Git

### 1. Clonar o Repositório
```bash
git clone https://github.com/seu-usuario/sistema-alarme-embargado.git
cd sistema-alarme-embargado
```

### 2. Configurar o ESP32
1. Abra `embargado/Esp32_archive.ino` no Arduino IDE
2. Configure suas credenciais Wi-Fi
3. Faça upload para o ESP32

### 3. Executar o Backend
```bash
cd backend
# Windows
start-services.bat

# Linux/Mac
chmod +x start-services.sh
./start-services.sh
```

### 4. Executar o App Mobile
```bash
cd frontend/embargado-app
npm install
npm start
```

## 🔧 Configuração

### ESP32
- Configure SSID e senha do Wi-Fi
- Ajuste a URL da API no código
- Conecte os componentes conforme o esquema

### Backend
- Porta 8000: API Gateway
- Porta 8090: Controle Service
- Porta 8120: Logs Service

### App Mobile
- Configure a URL do backend
- Ajuste as variáveis de configuração

## 📡 Endpoints da API

### Para ESP32
- `GET /config` - Obter configurações
- `POST /logs/sensor` - Enviar dados de sensor
- `POST /acionamento/confirmacao` - Confirmar acionamento

### Para App Mobile
- `GET /configuracoes` - Obter configurações
- `PUT /configuracoes` - Atualizar configurações
- `GET /logs/sensores` - Histórico de sensores
- `POST /acionamento/ativar` - Ativar sistema
- `POST /acionamento/desativar` - Desativar sistema

## 🔄 Fluxo de Funcionamento

1. **Inicialização**: ESP32 conecta ao Wi-Fi e consulta configurações
2. **Monitoramento**: Sensor PIR detecta movimento
3. **Alarme**: Buzzer é acionado conforme configuração
4. **Logs**: Dados são enviados para o backend
5. **Controle**: App permite configuração remota
6. **Histórico**: Dados são armazenados e consultáveis

## 🧪 Testes

### Testar ESP32
1. Verifique conexão Wi-Fi
2. Teste detecção de movimento
3. Confirme funcionamento do buzzer
4. Verifique comunicação com API

### Testar Backend
```bash
# Testar API Gateway
curl http://localhost:8000/config

# Testar Controle Service
curl http://localhost:8090/configuracoes

# Testar Logs Service
curl http://localhost:8120/logs/sensores
```

### Testar App Mobile
1. Execute o app no emulador/dispositivo
2. Teste configuração de parâmetros
3. Verifique comunicação com backend

## 📊 Monitoramento

### Logs do Sistema
- **ESP32**: Serial Monitor
- **Backend**: Console dos serviços
- **App**: Logs do Expo

### Métricas
- Detecções de movimento
- Tempo de resposta da API
- Status do sistema
- Histórico de configurações

## 🚨 Troubleshooting

### Problemas Comuns

**ESP32 não conecta ao Wi-Fi**
- Verifique credenciais
- Confirme força do sinal
- Reinicie o dispositivo

**Backend não inicia**
- Verifique se as portas estão livres
- Confirme instalação do Node.js
- Verifique dependências

**App não comunica com backend**
- Confirme URL da API
- Verifique conectividade de rede
- Teste endpoints manualmente

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature
3. Commit suas mudanças
4. Push para a branch
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## 👥 Autores

- **Seu Nome** - *Desenvolvimento inicial* - [SeuGitHub](https://github.com/seu-usuario)

## 🙏 Agradecimentos

- Comunidade Arduino
- Documentação do ESP32
- Expo para React Native
- Comunidade Node.js

---

**Sistema de Alarme Embargado - Projeto Final** 🔔 