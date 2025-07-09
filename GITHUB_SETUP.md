# 🚀 Configuração do Repositório GitHub

## Passos para Criar o Repositório no GitHub

### 1. Criar o Repositório no GitHub

1. Acesse [github.com](https://github.com) e faça login
2. Clique no botão **"+"** no canto superior direito
3. Selecione **"New repository"**
4. Preencha os campos:
   - **Repository name**: `sistema-alarme-embargado`
   - **Description**: `Sistema completo de alarme IoT com ESP32, backend em microserviços e app móvel`
   - **Visibility**: Escolha entre Public ou Private
   - **NÃO** marque "Add a README file" (já temos um)
   - **NÃO** marque "Add .gitignore" (já temos um)
   - **NÃO** marque "Choose a license" (já temos um)
5. Clique em **"Create repository"**

### 2. Conectar o Repositório Local ao GitHub

Após criar o repositório, execute estes comandos no terminal:

```bash
# Substitua SEU_USUARIO pelo seu nome de usuário do GitHub
git remote add origin https://github.com/SEU_USUARIO/sistema-alarme-embargado.git

# Enviar o código para o GitHub
git push -u origin main
```

### 3. Verificar se Funcionou

```bash
# Verificar se o remote foi adicionado corretamente
git remote -v

# Verificar o status
git status
```

## 📁 Estrutura do Repositório

Após o push, seu repositório terá esta estrutura:

```
sistema-alarme-embargado/
├── README.md                    # Documentação principal
├── .gitignore                  # Arquivos ignorados pelo Git
├── embargado/                  # Sistema Embarcado (ESP32)
│   ├── Esp32_archive.ino      # Código principal do ESP32
│   ├── README.md              # Documentação do ESP32
│   └── LICENSE                # Licença
├── backend/                    # Backend em Microserviços
│   ├── api-gateway/           # API Gateway (porta 8000)
│   ├── alarmes-service/       # Controle Service (porta 8090)
│   ├── logs-service/          # Logs Service (porta 8120)
│   ├── README.md              # Documentação do Backend
│   └── start-services.bat     # Script de inicialização
└── frontend/                  # Aplicativo Móvel
    └── embargado-app/         # App React Native
        ├── src/               # Código fonte
        ├── App.tsx            # Componente principal
        └── README.md          # Documentação do App
```

## 🔧 Comandos Úteis

### Para Atualizações Futuras

```bash
# Adicionar mudanças
git add .

# Fazer commit
git commit -m "Descrição das mudanças"

# Enviar para o GitHub
git push origin main
```

### Para Clonar em Outro Computador

```bash
git clone https://github.com/SEU_USUARIO/sistema-alarme-embargado.git
cd sistema-alarme-embargado
```

## 📋 Checklist

- [ ] Criar repositório no GitHub
- [ ] Adicionar remote origin
- [ ] Fazer push do código
- [ ] Verificar se tudo foi enviado corretamente
- [ ] Testar clone do repositório

## 🎯 Próximos Passos

1. **Configurar o ESP32**: Ajustar credenciais Wi-Fi no código
2. **Executar o Backend**: Usar os scripts de inicialização
3. **Testar o App**: Executar o aplicativo móvel
4. **Documentar**: Adicionar screenshots e vídeos do funcionamento

## 📞 Suporte

Se tiver problemas:
1. Verifique se o Git está configurado corretamente
2. Confirme suas credenciais do GitHub
3. Verifique a URL do repositório remoto

---

**Boa sorte com seu projeto!** 🚀 