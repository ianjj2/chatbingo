const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');
const config = require('./config');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

const PORT = config.server.port;

// Configurar servir arquivos estáticos
app.use(express.static(path.join(__dirname, 'public')));

// Configurar cliente Supabase
const supabase = createClient(config.supabase.url, config.supabase.anonKey);

// Validar conexão com Supabase
async function validateSupabaseConnection() {
    try {
        const { data, error } = await supabase
            .from('messages')
            .select('count')
            .limit(1);
        
        if (error && error.code !== 'PGRST116') { // PGRST116 = tabela não encontrada
            console.error('Erro na conexão com Supabase:', error.message);
            console.log('Verifique se:');
            console.log('1. As credenciais no config.js estão corretas');
            console.log('2. A tabela "messages" foi criada no Supabase');
            console.log('3. As políticas RLS estão configuradas');
        } else {
            console.log('✅ Conexão com Supabase estabelecida com sucesso!');
        }
    } catch (error) {
        console.error('Erro ao validar conexão Supabase:', error.message);
    }
}

validateSupabaseConnection();

// Variável para rastrear usuários online
let connectedUsers = new Set();
let lastMessages = new Map(); // Cache para evitar mensagens duplicadas

// Função para obter últimas mensagens do Supabase
async function getRecentMessages(callback) {
    try {
        const { data, error } = await supabase
            .from('messages')
            .select('username, message, created_at')
            .order('created_at', { ascending: true })
            .limit(50);

        if (error) {
            console.error('Erro ao buscar mensagens:', error.message);
            callback([]);
        } else {
            // Converter created_at para timestamp para compatibilidade
            const messages = data.map(msg => ({
                username: msg.username,
                message: msg.message,
                timestamp: msg.created_at
            }));
            callback(messages);
        }
    } catch (error) {
        console.error('Erro ao buscar mensagens:', error);
        callback([]);
    }
}

// Função para salvar mensagem no Supabase
async function saveMessage(username, message, callback) {
    try {
        const { data, error } = await supabase
            .from('messages')
            .insert([
                {
                    username: username,
                    message: message
                }
            ])
            .select();

        if (error) {
            console.error('Erro ao salvar mensagem:', error.message);
            callback(false, null);
        } else {
            callback(true, data[0]);
        }
    } catch (error) {
        console.error('Erro ao salvar mensagem:', error);
        callback(false, null);
    }
}

// Configurações do Socket.IO
io.on('connection', (socket) => {
    console.log('Usuário conectado:', socket.id);

    // Quando usuário entra no chat
    socket.on('user joined', (username) => {
        socket.username = username;
        connectedUsers.add(username);
        
        // Enviar mensagens históricas para o novo usuário
        getRecentMessages((messages) => {
            socket.emit('load messages', messages);
        });

        // Notificar outros usuários que alguém entrou
        socket.broadcast.emit('user joined notification', {
            username: username,
            userCount: connectedUsers.size
        });

        // Enviar contagem de usuários para todos
        io.emit('user count', connectedUsers.size);
        
        console.log(`${username} entrou no chat. Usuários online: ${connectedUsers.size}`);
    });

    // Quando usuário envia mensagem
    socket.on('send message', (data) => {
        // Verificar se não é mensagem duplicada usando ID único
        const messageId = data.id || `${data.username}_${Date.now()}_${Math.random()}`;
        
        if (lastMessages.has(messageId)) {
            console.log('Mensagem duplicada ignorada pelo ID:', messageId);
            return;
        }
        
        // Adicionar ID ao cache de mensagens processadas
        lastMessages.set(messageId, Date.now());
        
        // Verificação adicional por conteúdo (backup)
        const contentKey = `${data.username}:${data.message}`;
        const now = Date.now();
        
        if (lastMessages.has(contentKey)) {
            const lastTime = lastMessages.get(contentKey);
            if (now - lastTime < 1000) { // Evitar duplicatas em 1 segundo
                console.log('Mensagem duplicada ignorada por conteúdo');
                return;
            }
        }
        
        lastMessages.set(contentKey, now);
        
        // Limpar cache antigo (manter apenas últimas 200 entradas)
        if (lastMessages.size > 200) {
            const entries = Array.from(lastMessages.entries());
            const cutoff = now - 60000; // Remover entradas mais antigas que 1 minuto
            entries.forEach(([key, time]) => {
                if (time < cutoff) {
                    lastMessages.delete(key);
                }
            });
        }
        
        // Salvar no Supabase
        saveMessage(data.username, data.message, (success, savedMessage) => {
            if (success && savedMessage) {
                // Criar dados da mensagem com ID único e timestamp do Supabase
                const messageData = {
                    id: messageId,
                    username: savedMessage.username,
                    message: savedMessage.message,
                    timestamp: savedMessage.created_at
                };

                // Enviar mensagem para todos os usuários conectados
                io.emit('receive message', messageData);
                console.log(`Mensagem enviada - ID: ${messageId} - ${data.username}: ${data.message}`);
            } else {
                socket.emit('message error', 'Erro ao enviar mensagem');
            }
        });
    });

    // Quando usuário desconecta
    socket.on('disconnect', () => {
        if (socket.username) {
            connectedUsers.delete(socket.username);
            
            // Notificar outros usuários que alguém saiu
            socket.broadcast.emit('user left notification', {
                username: socket.username,
                userCount: connectedUsers.size
            });

            // Atualizar contagem de usuários
            io.emit('user count', connectedUsers.size);
            
            console.log(`${socket.username} saiu do chat. Usuários online: ${connectedUsers.size}`);
        }
    });

    // Evento para verificar se nome de usuário está disponível
    socket.on('check username', (username) => {
        const isAvailable = !connectedUsers.has(username);
        socket.emit('username check result', {
            username: username,
            available: isAvailable
        });
    });
});

// Rota principal
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Iniciar servidor
server.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Servidor rodando na porta ${PORT}`);
    console.log(`🌍 Ambiente: ${process.env.NODE_ENV || 'development'}`);
    
    if (process.env.RAILWAY_ENVIRONMENT) {
        console.log(`🚂 Railway Environment: ${process.env.RAILWAY_ENVIRONMENT}`);
        console.log(`🔗 URL público será gerado pelo Railway`);
    } else {
        console.log(`🏠 Acesso local: http://localhost:${PORT}`);
    }
});

// Graceful shutdown
process.on('SIGINT', () => {
    console.log('\nEncerrando servidor...');
    server.close(() => {
        console.log('Servidor encerrado.');
        console.log('Conexão com Supabase encerrada.');
        process.exit(0);
    });
});
