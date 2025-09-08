# 🎮 Chat Bingo - Chat em Tempo Real

Um chat em tempo real simples e moderno, inspirado no estilo YouTube, desenvolvido com Node.js, Express, Socket.IO e Supabase.

## 📋 Características

- ✅ **Entrada simples**: Apenas digite seu nome para entrar
- ✅ **Tempo real**: Mensagens instantâneas com WebSockets
- ✅ **Histórico persistente**: Mensagens salvas no Supabase (PostgreSQL)
- ✅ **Usuários online**: Contador de usuários conectados
- ✅ **Design responsivo**: Interface adaptável para mobile e desktop
- ✅ **Notificações**: Sistema de notificações para entrada/saída de usuários
- ✅ **Diferenciação visual**: Suas mensagens vs mensagens dos outros

## 🚀 Como Executar

### Pré-requisitos

- Node.js (versão 14 ou superior)
- npm (incluído com Node.js)
- Conta no Supabase (gratuita)

### Configuração do Supabase

1. **Criar projeto no Supabase**
   - Acesse [supabase.com](https://supabase.com)
   - Crie uma conta gratuita
   - Crie um novo projeto
   - Anote a URL do projeto e a chave anônima

2. **Configurar banco de dados**
   - No painel do Supabase, vá em "SQL Editor"
   - Execute o script do arquivo `database-schema.sql`
   - Isso criará a tabela `messages` e as políticas necessárias

### Instalação e Execução

1. **Clone ou baixe o projeto**
   ```bash
   # Se você tem git instalado
   git clone <url-do-repositorio>
   cd chat-bingo
   
   # Ou simplesmente baixe e extraia os arquivos
   ```

2. **Instale as dependências**
   ```bash
   npm install
   ```

3. **Configurar credenciais do Supabase**
   - Edite o arquivo `config.js`
   - Substitua `your_supabase_project_url` pela URL do seu projeto
   - Substitua `your_supabase_anon_key` pela sua chave anônima
   
   Ou crie um arquivo `.env` na raiz do projeto:
   ```
   SUPABASE_URL=sua_url_do_supabase
   SUPABASE_ANON_KEY=sua_chave_anonima
   PORT=3000
   ```

4. **Execute o servidor**
   ```bash
   npm start
   ```

5. **Acesse o chat**
   - Abra seu navegador
   - Vá para: `http://localhost:3000`
   - Digite seu nome e comece a conversar!

### Modo de Desenvolvimento

Para desenvolvimento com auto-reload:
```bash
npm run dev
```

## 📁 Estrutura do Projeto

```
chat-bingo/
├── server.js              # Servidor principal (Node.js + Express + Socket.IO)
├── config.js              # Configurações do Supabase e servidor
├── database-schema.sql    # Schema SQL para criar tabelas no Supabase
├── package.json           # Configurações e dependências do projeto
├── README.md             # Documentação do projeto
└── public/               # Arquivos do frontend
    ├── index.html        # Interface do usuário
    ├── styles.css        # Estilos CSS
    └── script.js         # Lógica JavaScript do cliente
```

## 🔧 Tecnologias Utilizadas

### Backend
- **Node.js**: Runtime JavaScript
- **Express**: Framework web
- **Socket.IO**: WebSockets para comunicação em tempo real
- **Supabase**: Banco de dados PostgreSQL na nuvem com APIs prontas

### Frontend
- **HTML5**: Estrutura da interface
- **CSS3**: Estilos e animações
- **JavaScript (ES6+)**: Lógica do cliente
- **Socket.IO Client**: Comunicação com o servidor

## 💡 Funcionalidades Detalhadas

### 🔐 Sistema de Entrada
- Validação de nome de usuário
- Verificação de nomes duplicados
- Interface intuitiva e responsiva

### 💬 Sistema de Mensagens
- Envio em tempo real via WebSockets
- Histórico de mensagens persistente
- Diferenciação visual entre mensagens próprias e de outros
- Timestamp em todas as mensagens
- Validação de mensagens no frontend e backend

### 👥 Gerenciamento de Usuários
- Contador de usuários online em tempo real
- Notificações quando usuários entram/saem
- Sistema de identificação única por sessão

### 🎨 Interface do Usuário
- Design moderno e limpo
- Gradientes e animações suaves
- Responsivo para mobile e desktop
- Scrolling automático para novas mensagens
- Notificações visuais

### 🔄 Reconexão Automática
- Detecta perda de conexão
- Reconecta automaticamente
- Notifica o usuário sobre o status da conexão

## 🛠️ Configurações Avançadas

### Porta do Servidor
Por padrão, o servidor roda na porta 3000. Para mudar:
```bash
PORT=8080 npm start
```

### Banco de Dados
As mensagens são persistidas no Supabase (PostgreSQL). O banco oferece:
- **Alta disponibilidade**: Hospedado na nuvem
- **Escalabilidade**: Suporta milhares de usuários
- **Segurança**: Row Level Security (RLS) configurado
- **Real-time**: Recursos nativos de tempo real

### Limits e Validações
- Nome de usuário: 2-20 caracteres
- Mensagem: máximo 500 caracteres
- Histórico: últimas 50 mensagens carregadas

## 🐛 Solução de Problemas

### Erro "EADDRINUSE"
```bash
# A porta 3000 já está em uso
# Use uma porta diferente:
PORT=3001 npm start
```

### Problemas com Supabase
```bash
# Verifique as credenciais no config.js
# Certifique-se de que:
# 1. A URL do Supabase está correta
# 2. A chave anônima está correta
# 3. A tabela 'messages' foi criada
# 4. As políticas RLS estão ativas
```

### Problemas de Conexão
- Verifique se o firewall não está bloqueando a porta
- Teste em modo incógnito para evitar cache
- Verifique se o Node.js está atualizado

## 📦 Scripts Disponíveis

- `npm start`: Executa o servidor em modo produção
- `npm run dev`: Executa com auto-reload (nodemon)

## 🌟 Vantagens do Supabase

### Funcionalidades Prontas
- ✅ **Banco PostgreSQL**: Totalmente gerenciado na nuvem
- ✅ **APIs REST**: Geradas automaticamente
- ✅ **Realtime**: Subscriptions nativas para mudanças em tempo real
- ✅ **Row Level Security**: Segurança avançada no nível de linha
- ✅ **Dashboard**: Interface visual para gerenciar dados
- ✅ **Escalabilidade**: Cresce conforme sua aplicação

### Possíveis Melhorias Futuras

- [ ] Real-time subscriptions (substituir Socket.IO)
- [ ] Sistema de salas/canais
- [ ] Autenticação com Supabase Auth
- [ ] Upload de imagens com Supabase Storage
- [ ] Comandos especiais (/help, /clear, etc.)
- [ ] Sistema de moderação
- [ ] Temas personalizáveis
- [ ] Notificações push
- [ ] Analytics e métricas

## 📄 Licença

MIT License - Sinta-se livre para usar e modificar!

## 🤝 Contribuição

Contribuições são bem-vindas! Sinta-se à vontade para:
- Reportar bugs
- Sugerir melhorias
- Enviar pull requests

---

**Desenvolvido com ❤️ para aprendizado e diversão!**
