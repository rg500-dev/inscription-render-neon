const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  // Configuration SSL requise par Neon
  ssl: {
    rejectUnauthorized: false
  }
});

// Créer la table User au démarrage si elle n'existe pas
const initDB = async () => {
  try {
    await pool.query(`
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
  } catch (error) {
    console.error('❌ Erreur init DB:', error.message);
  }
};

// Exécuter l'init
initDB();

module.exports = pool;