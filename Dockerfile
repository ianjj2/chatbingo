# Use Node.js LTS oficial
FROM node:18-alpine

# Definir diretório de trabalho
WORKDIR /app

# Copiar package.json e package-lock.json
COPY package*.json ./

# Instalar dependências (usando npm install com package-lock.json)
RUN npm install --omit=dev

# Copiar código da aplicação
COPY . .

# Expor porta
EXPOSE 3000

# Comando para iniciar a aplicação
CMD ["npm", "start"]
