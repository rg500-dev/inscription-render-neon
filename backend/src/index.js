const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

// Charger les variables d'environnement
dotenv.config();

const { initDB } = require('./lib/db');
const authRoutes = require('./routes/auth');

const app = express();
const PORT = process.env.PORT || 10000;

// Configuration CORS
app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);

    const allowedOrigin = process.env.FRONTEND_URL
      ? process.env.FRONTEND_URL.replace(/\/+$/, "").trim()
      : "http://localhost:5173";

    if (origin.replace(/\/+$/, "").trim() === allowedOrigin) {
      callback(null, true);
    } else {
      callback(null, allowedOrigin);
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

app.use(express.json());

// Routes API
app.use('/api/auth', authRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Server is running' });
});

// Gestion des erreurs
app.use((err, req, res, next) => {
  console.error('❌ Erreur:', err.message);
  console.error('Stack:', err.stack);
  res.status(500).json({ error: 'Erreur interne du serveur' });
});

// Initialisation DB puis démarrage du serveur
initDB().then(() => {
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on port ${PORT}`);
  });
}).catch((err) => {
  console.error('❌ Impossible de démarrer:', err.message);
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on port ${PORT} (sans DB)`);
  });
});