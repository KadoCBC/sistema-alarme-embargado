# 🔒 App Alarme Embargado

Sistema de configuração simples para alarme embargado desenvolvido em React Native com Expo.

## 📱 Funcionalidades

### Configuração Simples
- **3 Variáveis Numéricas**: Configure parâmetros básicos do sistema
- **Interface Limpa**: Design simples e intuitivo
- **Validação**: Campos numéricos com validação
- **Feedback Visual**: Confirmação de salvamento

## 🚀 Como Executar

### Pré-requisitos
- Node.js (versão 14 ou superior)
- npm ou yarn
- Expo CLI

### Instalação
```bash
# Navegar para o diretório do projeto
cd frontend/embargado-app

# Instalar dependências
npm install

# Executar o projeto
npm start
```

### Comandos Disponíveis
```bash
npm start          # Iniciar servidor de desenvolvimento
npm run android    # Executar no Android
npm run ios        # Executar no iOS (requer macOS)
npm run web        # Executar no navegador
```

## 🏗️ Estrutura do Projeto

```
src/
├── components/          # Componentes reutilizáveis
│   ├── SimpleButton.tsx
│   ├── SimpleInput.tsx
│   └── SimpleSwitch.tsx
├── screens/            # Telas do aplicativo
│   └── ConfigScreen.tsx
└── types/              # Definições de tipos TypeScript
    └── alarm.ts
```

## 📋 Configuração

O app permite configurar 3 variáveis numéricas:

- **Variável 1**: Parâmetro de sensibilidade
- **Variável 2**: Parâmetro de tempo  
- **Variável 3**: Parâmetro de intensidade

## 🎨 Interface

### Design System
- **Cores Primárias**: Azul (#007AFF) para ações principais
- **Cores Secundárias**: Cinza (#8E8E93) para textos secundários
- **Cores de Erro**: Vermelho (#FF3B30) para alertas
- **Cores de Sucesso**: Verde (#34C759) para confirmações

### Componentes
- **SimpleButton**: Botões com variantes (primary, secondary, danger)
- **SimpleInput**: Campos de entrada com validação numérica

## 🔧 Desenvolvimento

### Adicionando Novas Variáveis
1. Adicione a nova variável no estado em `ConfigScreen.tsx`
2. Crie um novo `SimpleInput` para a variável
3. Atualize a função de salvamento se necessário

### Personalizando Labels
Para alterar os nomes das variáveis, edite os labels nos `SimpleInput`:

```typescript
<SimpleInput
  label="Nome da Variável"
  value={config.variavel1.toString()}
  onChangeText={(text) => setConfig({ ...config, variavel1: parseInt(text) || 0 })}
  placeholder="50"
  keyboardType="numeric"
/>
```

## 📱 Compatibilidade

- **Android**: API 21+ (Android 5.0+)
- **iOS**: iOS 11.0+
- **Expo**: SDK 49+

## 🤝 Integração

O app está preparado para integração futura com backend. Para conectar com uma API:

1. Crie um serviço de API em `src/services/`
2. Implemente as chamadas HTTP necessárias
3. Substitua as simulações por chamadas reais

## 📄 Licença

Este projeto está sob a licença MIT.

---

**Sistema de configuração simples para alarme embargado** 🔒 