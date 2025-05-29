// routes/authRoutes.js

const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

router.post('/register', authController.registerUser);
router.post('/login', authController.loginUser);

// --- NOVA ROTA: Para obter um usuário por ID ---
// Geralmente é uma rota GET. Pode-ser protegida por autenticação no futuro.
router.get('/users/:id', authController.getUserById);

module.exports = router;