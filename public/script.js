// Variáveis globais
let socket;
let currentUsername = '';
let isConnected = false;

// Elementos DOM
const loginScreen = document.getElementById('loginScreen');
const chatScreen = document.getElementById('chatScreen');
const loadingSpinner = document.getElementById('loadingSpinner');
const loginForm = document.getElementById('loginForm');
const usernameInput = document.getElementById('usernameInput');
const loginError = document.getElementById('loginError');
const currentUserSpan = document.getElementById('currentUser');
const userCountSpan = document.getElementById('userCount');
const messagesList = document.getElementById('messagesList');
const messagesContainer = document.getElementById('messagesContainer');
const messageForm = document.getElementById('messageForm');
const messageInput = document.getElementById('messageInput');
const sendBtn = document.getElementById('sendBtn');
const leaveBtn = document.getElementById('leaveBtn');
const notifications = document.getElementById('notifications');

// Inicialização
document.addEventListener('DOMContentLoaded', () => {
    initializeEventListeners();
    focusUsernameInput();
});

// Event Listeners
function initializeEventListeners() {
    // Login form
    loginForm.addEventListener('submit', handleLogin);
    usernameInput.addEventListener('input', handleUsernameInput);
    
    // Message form
    messageForm.addEventListener('submit', handleSendMessage);
    messageInput.addEventListener('input', handleMessageInput);
    messageInput.addEventListener('keypress', handleMessageKeypress);
    
    // Leave button
    leaveBtn.addEventListener('click', handleLeave);
    
    // Prevent page reload on form submit
    loginForm.addEventListener('submit', (e) => e.preventDefault());
    messageForm.addEventListener('submit', (e) => e.preventDefault());
}

// Função para focar no input de nome
function focusUsernameInput() {
    setTimeout(() => {
        usernameInput.focus();
    }, 100);
}

// Handle login
function handleLogin(e) {
    e.preventDefault();
    
    const username = usernameInput.value.trim();
    
    if (!username) {
        showLoginError('Por favor, digite seu nome');
        return;
    }
    
    if (username.length < 2) {
        showLoginError('Nome deve ter pelo menos 2 caracteres');
        return;
    }
    
    if (username.length > 20) {
        showLoginError('Nome deve ter no máximo 20 caracteres');
        return;
    }
    
    // Verificar caracteres válidos
    if (!/^[a-zA-Z0-9\s\u00C0-\u017F]+$/.test(username)) {
        showLoginError('Nome contém caracteres inválidos');
        return;
    }
    
    currentUsername = username;
    connectToChat();
}

// Handle username input
function handleUsernameInput() {
    clearLoginError();
}

// Connect to chat
function connectToChat() {
    showLoading();
    
    try {
        // Inicializar Socket.IO
        socket = io();
        
        // Event listeners do socket
        setupSocketListeners();
        
        // Verificar se nome está disponível
        socket.emit('check username', currentUsername);
        
    } catch (error) {
        console.error('Erro ao conectar:', error);
        hideLoading();
        showLoginError('Erro ao conectar ao servidor');
    }
}

// Setup Socket.IO listeners
function setupSocketListeners() {
    // Conectado com sucesso
    socket.on('connect', () => {
        console.log('Conectado ao servidor');
        isConnected = true;
    });
    
    // Verificação de nome de usuário
    socket.on('username check result', (data) => {
        if (data.available) {
            // Nome disponível, entrar no chat
            socket.emit('user joined', currentUsername);
        } else {
            hideLoading();
            showLoginError('Este nome já está em uso. Escolha outro.');
        }
    });
    
    // Carregar mensagens históricas
    socket.on('load messages', (messages) => {
        hideLoading();
        showChatScreen();
        loadHistoricalMessages(messages);
        enableMessageInput();
        focusMessageInput();
    });
    
    // Nova mensagem recebida
    socket.on('receive message', (data) => {
        addMessage(data, data.username === currentUsername);
    });
    
    // Contagem de usuários atualizada
    socket.on('user count', (count) => {
        updateUserCount(count);
    });
    
    // Notificação de usuário que entrou
    socket.on('user joined notification', (data) => {
        addSystemMessage(`${data.username} entrou no chat`);
        updateUserCount(data.userCount);
    });
    
    // Notificação de usuário que saiu
    socket.on('user left notification', (data) => {
        addSystemMessage(`${data.username} saiu do chat`);
        updateUserCount(data.userCount);
    });
    
    // Erro ao enviar mensagem
    socket.on('message error', (error) => {
        showNotification('Erro ao enviar mensagem', 'error');
    });
    
    // Desconectado
    socket.on('disconnect', () => {
        console.log('Desconectado do servidor');
        isConnected = false;
        disableMessageInput();
        showNotification('Conexão perdida', 'error');
    });
    
    // Reconnectado
    socket.on('reconnect', () => {
        console.log('Reconectado ao servidor');
        isConnected = true;
        enableMessageInput();
        showNotification('Reconectado!', 'success');
        
        // Re-entrar no chat
        socket.emit('user joined', currentUsername);
    });
    
    // Erro de conexão
    socket.on('connect_error', () => {
        console.error('Erro de conexão');
        hideLoading();
        showLoginError('Erro ao conectar ao servidor');
    });
}

// Show/hide screens
function showLoading() {
    loadingSpinner.classList.remove('hidden');
}

function hideLoading() {
    loadingSpinner.classList.add('hidden');
}

function showChatScreen() {
    loginScreen.classList.add('hidden');
    chatScreen.classList.remove('hidden');
    currentUserSpan.textContent = `Logado como: ${currentUsername}`;
}

function showLoginScreen() {
    chatScreen.classList.add('hidden');
    loginScreen.classList.remove('hidden');
    clearLoginError();
    usernameInput.value = '';
    focusUsernameInput();
}

// Error handling
function showLoginError(message) {
    loginError.textContent = message;
    loginError.style.display = 'block';
}

function clearLoginError() {
    loginError.textContent = '';
    loginError.style.display = 'none';
}

// Message handling
function handleSendMessage(e) {
    e.preventDefault();
    
    const message = messageInput.value.trim();
    
    if (!message) return;
    
    if (!isConnected) {
        showNotification('Não conectado ao servidor', 'error');
        return;
    }
    
    // Enviar mensagem
    socket.emit('send message', {
        username: currentUsername,
        message: message
    });
    
    // Limpar input
    messageInput.value = '';
    adjustTextareaHeight();
}

function handleMessageInput() {
    adjustTextareaHeight();
}

function handleMessageKeypress(e) {
    // Enviar com Enter (sem Shift)
    if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        handleSendMessage(e);
    }
}

function adjustTextareaHeight() {
    messageInput.style.height = 'auto';
    messageInput.style.height = Math.min(messageInput.scrollHeight, 120) + 'px';
}

function enableMessageInput() {
    messageInput.disabled = false;
    sendBtn.disabled = false;
    messageInput.placeholder = 'Digite sua mensagem...';
}

function disableMessageInput() {
    messageInput.disabled = true;
    sendBtn.disabled = true;
    messageInput.placeholder = 'Conectando...';
}

function focusMessageInput() {
    setTimeout(() => {
        messageInput.focus();
    }, 100);
}

// Messages display
function loadHistoricalMessages(messages) {
    messagesList.innerHTML = '';
    
    messages.forEach(messageData => {
        addMessage(messageData, messageData.username === currentUsername, false);
    });
    
    scrollToBottom();
}

function addMessage(messageData, isOwn, animate = true) {
    const messageElement = createMessageElement(messageData, isOwn);
    
    if (!animate) {
        messageElement.style.animation = 'none';
    }
    
    messagesList.appendChild(messageElement);
    scrollToBottom();
}

function createMessageElement(messageData, isOwn) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${isOwn ? 'own' : 'other'}`;
    
    const timestamp = formatTimestamp(messageData.timestamp);
    
    messageDiv.innerHTML = `
        <div class="message-header">
            <span class="message-username">${escapeHtml(messageData.username)}</span>
            <span class="message-time">${timestamp}</span>
        </div>
        <div class="message-content">
            ${escapeHtml(messageData.message)}
        </div>
    `;
    
    return messageDiv;
}

function addSystemMessage(message) {
    const messageDiv = document.createElement('div');
    messageDiv.className = 'system-message';
    messageDiv.textContent = message;
    
    messagesList.appendChild(messageDiv);
    scrollToBottom();
}

function scrollToBottom() {
    setTimeout(() => {
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }, 10);
}

// Utility functions
function formatTimestamp(timestamp) {
    const date = new Date(timestamp);
    const now = new Date();
    
    // Se for hoje, mostrar apenas a hora
    if (date.toDateString() === now.toDateString()) {
        return date.toLocaleTimeString('pt-BR', {
            hour: '2-digit',
            minute: '2-digit'
        });
    }
    
    // Se for outro dia, mostrar data e hora
    return date.toLocaleString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
    });
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function updateUserCount(count) {
    userCountSpan.textContent = count;
}

// Notifications
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    
    notifications.appendChild(notification);
    
    // Remover após 5 segundos
    setTimeout(() => {
        if (notification.parentNode) {
            notification.parentNode.removeChild(notification);
        }
    }, 5000);
}

// Leave chat
function handleLeave() {
    if (confirm('Tem certeza que deseja sair do chat?')) {
        leaveChat();
    }
}

function leaveChat() {
    if (socket) {
        socket.disconnect();
    }
    
    currentUsername = '';
    isConnected = false;
    messagesList.innerHTML = '';
    
    showLoginScreen();
}

// Cleanup on page unload
window.addEventListener('beforeunload', () => {
    if (socket) {
        socket.disconnect();
    }
});

// Detectar se usuário está online/offline
window.addEventListener('online', () => {
    if (currentUsername && !isConnected) {
        showNotification('Conexão restaurada', 'success');
        connectToChat();
    }
});

window.addEventListener('offline', () => {
    showNotification('Sem conexão com a internet', 'error');
});
