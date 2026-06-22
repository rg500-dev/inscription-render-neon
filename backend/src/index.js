const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const authRoutes = require('./routes/auth');

const app = express();
const PORT = process.env.PORT || 10000;


if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}
// Middleware
// Remplacez TOUT votre bloc app.use(cors(...)) actuel par ceci :
app.use(cors({
  origin: function (origin, callback) {
    // Si la requête vient d'un outil comme Postman (sans origine), on autorise
    if (!origin) return callback(null, true);

    // On récupère l'URL sur Render, et on force la suppression des espaces et barres obliques finales
    const allowedOrigin = process.env.FRONTEND_URL 
      ? process.env.FRONTEND_URL.trim().replace(/\/$/, "") 
      : "http://localhost:5173";

    const cleanOrigin = origin.trim().replace(/\/$/, "");

    // Si les adresses nettoyées correspondent, ou en secours pour éviter le crash ERR_INVALID_CHAR
    if (cleanOrigin === allowedOrigin) {
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

// Routes
app.use('/api/auth', authRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Server is running' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({ error: 'Erreur interne du serveur' });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`==> LE SERVEUR EST EN LIGNE SUR LE PORT ${PORT} 🎉`);
});