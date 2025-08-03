# VibeTalk - Chat em Tempo Real

VibeTalk é uma aplicação de chat em tempo real moderna e responsiva, desenvolvida com React e Socket.io. A aplicação oferece uma experiência de chat completa com interface elegante inspirada no WhatsApp.

## 🚀 Funcionalidades

### ✨ Interface de Entrada
- **Tela de login elegante** com gradiente roxo/azul
- **Seleção de avatar** com 10 avatares pré-definidos
- **Upload de foto personalizada** do dispositivo
- **Campo de nome de usuário** com validação
- **Design responsivo** para mobile e desktop

### 💬 Chat Principal
- **Chat global** para todos os usuários conectados
- **Mensagens privadas** entre usuários
- **Background escuro** estilo WhatsApp
- **Lista de usuários online** em tempo real
- **Interface responsiva** com sidebar colapsável em mobile

### 🎨 Funcionalidades Avançadas
- **Sistema de emojis** com seletor visual
- **Suporte a mensagens de áudio** (gravação e reprodução via microfone)
- **Notificações de mensagens privadas** com contador visual
- **Timestamps** em todas as mensagens
- **Indicadores visuais** de usuário atual
- **Notificações** de entrada/saída de usuários

### 📱 Responsividade
- **Design mobile-first** com sidebar colapsável
- **Adaptação automática** para diferentes tamanhos de tela
- **Interface touch-friendly** para dispositivos móveis
- **Layout otimizado** para desktop e tablet

## 🆕 Melhorias Recentes

### 🔔 Notificações de Mensagens Privadas
- **Contador visual** (bolinha vermelha) no nome do usuário quando há mensagens não lidas
- **Limpeza automática** das notificações ao abrir o chat privado
- **Persistência** das notificações entre sessões

### 👥 Atualização de Usuários Online
- **Sincronização em tempo real** da lista de usuários online
- **Notificação automática** quando novos usuários entram ou saem
- **Lista atualizada** para todos os usuários conectados

### 🎵 Mensagens de Áudio Aprimoradas
- **Gravação real de áudio** via microfone do dispositivo
- **Reprodução nativa** com controles de áudio HTML5
- **Armazenamento** em formato base64 para compatibilidade
- **Indicação visual** de mensagens de áudio no chat

## 🛠️ Tecnologias Utilizadas

### Frontend
- **React 19** - Framework principal
- **Tailwind CSS** - Estilização
- **Shadcn/UI** - Componentes de interface
- **Lucide Icons** - Ícones
- **Socket.io Client** - Comunicação em tempo real
- **Vite** - Build tool

### Backend
- **Flask** - Framework web
- **Flask-SocketIO** - WebSocket para tempo real
- **Flask-CORS** - Suporte a CORS
- **Python 3.11** - Linguagem do backend

## 📦 Instalação e Execução

### Pré-requisitos
- Node.js 20+
- Python 3.11+
- pnpm (ou npm)

### 1. Frontend (React)
```bash
cd vibetalk
pnpm install
pnpm run dev --host
```
O frontend estará disponível em: http://localhost:5173

### 2. Backend (Flask)
```bash
cd vibetalk-server
source venv/bin/activate  # Linux/Mac
# ou
venv\\Scripts\\activate   # Windows
pip install -r requirements.txt
python src/main.py
```
O backend estará disponível em: http://localhost:5000

## 🎯 Como Usar

### 1. Acesso Inicial
1. Abra http://localhost:5173 no navegador
2. Escolha um avatar ou faça upload de uma foto
3. Digite seu nome de usuário
4. Clique em "Entrar no Chat"

### 2. Chat Global
- Digite mensagens no campo inferior
- Use o botão de emoji para adicionar emojis
- Use o botão de microfone para gravar áudio (clique para iniciar/parar)
- Veja mensagens de outros usuários em tempo real

### 3. Mensagens Privadas
- Clique no ícone de chat ao lado do nome de um usuário online
- Inicie uma conversa privada
- **Notificações**: Uma bolinha vermelha aparecerá no nome do usuário quando você receber mensagens privadas
- Use "Voltar ao Global" para retornar ao chat principal

### 4. Mensagens de Áudio
- Clique no ícone de microfone para iniciar a gravação
- Clique novamente para parar e enviar
- As mensagens de áudio aparecerão com controles de reprodução
- Clique no botão play para ouvir as mensagens

### 5. Interface Mobile
- Em telas pequenas, use o botão de menu (☰) para acessar a sidebar
- Toque fora da sidebar para fechá-la
- Todas as funcionalidades estão disponíveis em mobile

## 🏗️ Estrutura do Projeto

### Frontend (vibetalk/)
```
src/
├── components/
│   ├── ui/           # Componentes base (shadcn/ui)
│   ├── LoginScreen.jsx    # Tela de entrada
│   ├── ChatScreen.jsx     # Interface principal do chat
│   └── EmojiPicker.jsx    # Seletor de emojis
├── assets/           # Imagens (logo e avatares)
├── App.jsx          # Componente principal
└── main.jsx         # Ponto de entrada
```

### Backend (vibetalk-server/)
```
src/
├── main.py          # Servidor Flask + Socket.io
├── routes/          # Rotas da API
├── models/          # Modelos de dados
└── static/          # Arquivos estáticos
```

## 🔧 Configuração Avançada

### Variáveis de Ambiente
O projeto funciona com as configurações padrão, mas você pode personalizar:

- **Frontend**: Porta padrão 5173
- **Backend**: Porta padrão 5000
- **CORS**: Configurado para aceitar qualquer origem

### Personalização
- **Avatares**: Adicione novos avatares em `src/assets/`
- **Emojis**: Modifique a lista em `EmojiPicker.jsx`
- **Cores**: Ajuste o tema no `App.css`

## 🚀 Deploy

### Frontend
```bash
cd vibetalk
pnpm run build
# Deploy da pasta dist/
```

### Backend
```bash
cd vibetalk-server
pip freeze > requirements.txt
# Deploy com gunicorn ou similar
```

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature
3. Commit suas mudanças
4. Push para a branch
5. Abra um Pull Request

## 📄 Licença

Este projeto é open source e está disponível sob a licença MIT.

## 🎉 Créditos

Desenvolvido com ❤️ usando tecnologias modernas para criar uma experiência de chat excepcional.

---

**VibeTalk** - Conecte-se com pessoas de forma simples e elegante! 🚀

