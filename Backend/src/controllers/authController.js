const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
const config = require('../config/config');
const userService = require('../services/userService');

class AuthController {
  async login(req, res, next) {
    try {
      const { email, password } = req.body;

      // Verificar se o usuário existe
      const user = await userService.findByEmail(email);
      if (!user) {
        return res.status(401).json({
          success: false,
          message: 'Credenciais inválidas'
        });
      }

      // Verificar senha
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return res.status(401).json({
          success: false,
          message: 'Credenciais inválidas'
        });
      }

      // Gerar tokens
      const payload = {
        id: user.id,
        email: user.email,
        role: user.role
      };

      const accessToken = jwt.sign(payload, config.jwtSecret, {
        expiresIn: config.jwtExpiresIn
      });

      const refreshToken = jwt.sign(payload, config.jwtSecret, {
        expiresIn: '7d'
      });

      // Atualizar último login
      await userService.updateLastLogin(user.id);

      res.json({
        success: true,
        message: 'Login realizado com sucesso',
        data: {
          user: {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role
          },
          accessToken,
          refreshToken
        }
      });
    } catch (error) {
      next(error);
    }
  }

  async register(req, res, next) {
    try {
      const { name, email, password, role = 'user' } = req.body;

      // Verificar se o email já existe
      const existingUser = await userService.findByEmail(email);
      if (existingUser) {
        return res.status(400).json({
          success: false,
          message: 'Email já está em uso'
        });
      }

      // Hash da senha
      const hashedPassword = await bcrypt.hash(password, config.bcryptRounds);

      // Criar usuário
      const userData = {
        id: uuidv4(),
        name,
        email,
        password: hashedPassword,
        role,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      const user = await userService.create(userData);

      res.status(201).json({
        success: true,
        message: 'Usuário criado com sucesso',
        data: {
          user: {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role
          }
        }
      });
    } catch (error) {
      next(error);
    }
  }

  async refreshToken(req, res, next) {
    try {
      const { refreshToken } = req.body;

      if (!refreshToken) {
        return res.status(401).json({
          success: false,
          message: 'Refresh token é obrigatório'
        });
      }

      const decoded = jwt.verify(refreshToken, config.jwtSecret);
      
      const newAccessToken = jwt.sign({
        id: decoded.id,
        email: decoded.email,
        role: decoded.role
      }, config.jwtSecret, {
        expiresIn: config.jwtExpiresIn
      });

      res.json({
        success: true,
        data: {
          accessToken: newAccessToken
        }
      });
    } catch (error) {
      res.status(401).json({
        success: false,
        message: 'Refresh token inválido'
      });
    }
  }

  async logout(req, res, next) {
    try {
      // Em um cenário real, você adicionaria o token a uma blacklist
      res.json({
        success: true,
        message: 'Logout realizado com sucesso'
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new AuthController();