const express = require('express');
const bcrypt = require('bcryptjs');
const { getPool } = require('../lib/db');

const router = express.Router();

// POST /api/auth/register
router.post('/register', async (req, res) => {
  try {
    const { email, password, firstName, lastName, tel } = req.body;
    const pool = getPool();

    // Validation
    if (!email || !password || !firstName || !lastName) {
      return res.status(400).json({ 
        error: 'Tous les champs obligatoires doivent être remplis (email, password, firstName, lastName)' 
      });
    }

    if (password.length < 6) {
      return res.status(400).json({ 
        error: 'Le mot de passe doit contenir au moins 6 caractères' 
      });
    }

    // Vérifier si l'email existe déjà
    const existingUser = await pool.query(
      'SELECT id FROM "User" WHERE email = $1',
      [email]
    );

    if (existingUser.rows.length > 0) {
      return res.status(409).json({ 
        error: 'Un compte avec cet email existe déjà' 
      });
    }

    // Hasher le mot de passe
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Créer l'utilisateur
    const result = await pool.query(
      `INSERT INTO "User" (email, password, "firstName", "lastName", tel) 
       VALUES ($1, $2, $3, $4, $5)
       RETURNING id, email, "firstName", "lastName", tel, "createdAt"`,
      [email, hashedPassword, firstName, lastName, tel || null]
    );

    const user = result.rows[0];

    res.status(201).json({
      message: 'Compte créé avec succès',
      user
    });

  } catch (error) {
    console.error('Erreur lors de l\'inscription:', error);
    res.status(500).json({ error: 'Erreur lors de la création du compte' });
  }
});

module.exports = router;