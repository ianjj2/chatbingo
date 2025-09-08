# 📋 Instruções para Configurar o Supabase

## 🚀 Passos para Executar

### 1. Criar a Tabela no Supabase

1. **Acesse seu projeto Supabase:**
   - Vá para [supabase.com](https://supabase.com)
   - Faça login na sua conta
   - Acesse o projeto: `rlqdeczmumtbdsonjehe`

2. **Execute o SQL:**
   - No painel lateral, clique em **"SQL Editor"**
   - Clique em **"New query"**
   - Copie e cole o conteúdo do arquivo `database-schema.sql`
   - Clique em **"Run"** para executar

### 2. Instalar e Executar o Chat

```bash
# Instalar dependências
npm install

# Executar o servidor
npm start
```

### 3. Testar o Chat

- Abra o navegador em `http://localhost:3000`
- Digite seu nome e comece a conversar!

## 🔧 Configurações Aplicadas

### Credenciais do Supabase:
- **URL:** `https://rlqdeczmumtbdsonjehe.supabase.co`
- **Chave Anônima:** Configurada no `config.js`

### Banco de Dados:
- ✅ Tabela `messages` será criada
- ✅ Políticas RLS configuradas
- ✅ Índices otimizados
- ✅ Função de limpeza de mensagens antigas

## 🎯 Próximos Passos

1. **Execute o SQL no Supabase** (arquivo `database-schema.sql`)
2. **Teste o chat** (`npm install` → `npm start`)
3. **Convide amigos** para testar o chat em tempo real!

## 🔍 Verificação

Se tudo estiver funcionando, você verá no console do servidor:
```
✅ Conexão com Supabase estabelecida com sucesso!
Servidor rodando na porta 3000
Acesse: http://localhost:3000
```

## 🆘 Problemas?

Se houver erros, verifique:
1. Se o SQL foi executado corretamente no Supabase
2. Se as credenciais estão corretas no `config.js`
3. Se o projeto Supabase está ativo

**Tudo pronto para usar! 🎉**
