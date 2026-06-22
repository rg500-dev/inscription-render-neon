const { Pool } = require('pg');
const { PrismaPg } = require('@prisma/adapter-pg');
const { PrismaClient } = require('@prisma/client');

// 1. Créer une réserve de connexions PostgreSQL via le driver 'pg'
const pool = new Pool({ connectionString: process.env.DATABASE_URL });

// 2. Transformer cette réserve en adaptateur compatible Prisma 7
const adapter = new PrismaPg(pool);

// 3. Injecter l'adaptateur requis au constructeur Prisma
const prisma = new PrismaClient({ 
  adapter,
  datasources: {
    db: { url: process.env.DATABASE_URL }
  }
});

module.exports = prisma;
