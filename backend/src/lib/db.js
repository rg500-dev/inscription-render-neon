const { Pool } = require('pg');

let pool = null;

// Initialiser la connexion
const getPool = () => {
  if (!pool) {
    pool = new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: process.env.NODE_ENV === 'production' 
        ? { rejectUnauthorized: false } 
        : false,
      connectionTimeoutMillis: 10000,
      idleTimeoutMillis: 30000
    });
  }
  return pool;
};

// Créer la table User au démarrage
const initDB = async () => {
  try {
    const client = await getPool().connect();
    console.log('✅ Connecté à la base de données');
    
    await client.query(`
      CREATE TABLE IF NOT EXISTS "User" (
        id SERIAL PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        "firstName" VARCHAR(100) NOT NULL,
        "lastName" VARCHAR(100) NOT NULL,
        tel VARCHAR(50),
        "createdAt" TIMESTAMP DEFAULT NOW(),
        "updatedAt" TIMESTAMP DEFAULT NOW()
      );
    `);
    console.log('✅ Table User vérifiée/créée');
    client.release();
  } catch (error) {
    console.error('❌ Erreur de connexion DB:', error.message);
  }
};

// Exporter le pool et l'init
module.exports = { getPool, initDB };