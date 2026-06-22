# Utilise Node.js officiel
FROM node:18-alpine

WORKDIR /app

# Copie les fichiers de dépendances
COPY package*.json ./
COPY prisma/ ./prisma/
COPY prisma.config.ts ./

# Installation des dépendances
RUN npm install

# Génère le client Prisma
RUN npx prisma generate

# Copie le reste du code source
COPY . .

# Build (si nécessaire, ici pas de build)
EXPOSE 5000

CMD ["node", "src/index.js"]