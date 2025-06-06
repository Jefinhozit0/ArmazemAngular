const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { validateLogin, validateRegister } = require('../middleware/validation');
const rateLimit = require('express-rate-limit');

// Rate limiting para rotas de autenticação
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 5, // máximo 5 tentativas por IP
  message: {
    error: 'Muitas tentativas de login. Tente novamente em 15 minutos.'
  }
});

// @route   POST /api/auth/login
// @desc    Login de usuário
// @access  Public
router.post('/login', authLimiter, validateLogin, authController.login);

// @route   POST /api/auth/register
// @desc    Registro de novo usuário
// @access  Public (pode ser restrito conforme necessidade)
router.post('/register', validateRegister, authController.register);

// @route   POST /api/auth/refresh
// @desc    Refresh token
// @access  Public
router.post('/refresh', authController.refreshToken);

// @route   POST /api/auth/logout
// @desc    Logout de usuário
// @access  Private
router.post('/logout', authController.logout);

module.exports = router;