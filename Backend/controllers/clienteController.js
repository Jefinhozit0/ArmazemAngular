const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const pool = require('../config/database');

class ClienteController {
  // Validações
  static validateCliente = [
    body('nome').notEmpty().withMessage('Nome é obrigatório'),
    body('email').isEmail().withMessage('Email inválido'),
    body('senha').isLength({ min: 6 }).withMessage('Senha deve ter pelo menos 6 caracteres'),
  ];

  static validateLogin = [
    body('email').isEmail().withMessage('Email inválido'),
    body('senha').notEmpty().withMessage('Senha é obrigatória'),
  ];

  // Cadastrar cliente
  static async cadastrar(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { nome, email, logradouro, senha, telefone, documento } = req.body;

      // Verificar se email já existe
      const emailExists = await pool.query('SELECT id FROM clientes WHERE email = $1', [email]);
      if (emailExists.rows.length > 0) {
        return res.status(400).json({ error: 'Email já cadastrado' });
      }

      // Criptografar senha
      const hashedPassword = await bcrypt.hash(senha, 10);

      // Inserir cliente
      const result = await pool.query(
        'INSERT INTO clientes (nome, email, logradouro, senha, telefone, documento) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id, nome, email, logradouro, telefone, documento',
        [nome, email, logradouro, hashedPassword, telefone, documento]
      );

      const cliente = result.rows[0];
      
      // Gerar token JWT
      const token = jwt.sign(
        { id: cliente.id, email: cliente.email },
        process.env.JWT_SECRET,
        { expiresIn: '24h' }
      );

      res.status(201).json({
        message: 'Cliente cadastrado com sucesso',
        cliente,
        token
      });
    } catch (error) {
      console.error('Erro ao cadastrar cliente:', error);
      res.status(500).json({ error: 'Erro interno do servidor' });
    }
  }

  // Login
  static async login(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { email, senha } = req.body;

      // Buscar cliente
      const result = await pool.query('SELECT * FROM clientes WHERE email = $1', [email]);
      if (result.rows.length === 0) {
        return res.status(401).json({ error: 'Credenciais inválidas' });
      }

      const cliente = result.rows[0];

      // Verificar senha
      const senhaValida = await bcrypt.compare(senha, cliente.senha);
      if (!senhaValida) {
        return res.status(401).json({ error: 'Credenciais inválidas' });
      }

      // Gerar token JWT
      const token = jwt.sign(
        { id: cliente.id, email: cliente.email },
        process.env.JWT_SECRET,
        { expiresIn: '24h' }
      );

      // Remover senha da resposta
      delete cliente.senha;

      res.json({
        message: 'Login realizado com sucesso',
        cliente,
        token
      });
    } catch (error) {
      console.error('Erro no login:', error);
      res.status(500).json({ error: 'Erro interno do servidor' });
    }
  }

  // Obter perfil do cliente
  static async perfil(req, res) {
    try {
      const result = await pool.query(
        'SELECT id, nome, email, logradouro, telefone, documento FROM clientes WHERE id = $1',
        [req.user.id]
      );

      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'Cliente não encontrado' });
      }

      res.json(result.rows[0]);
    } catch (error) {
      console.error('Erro ao buscar perfil:', error);
      res.status(500).json({ error: 'Erro interno do servidor' });
    }
  }

  // Atualizar perfil
  static async atualizar(req, res) {
    try {
      const { nome, logradouro, telefone, documento } = req.body;

      const result = await pool.query(
        'UPDATE clientes SET nome = $1, logradouro = $2, telefone = $3, documento = $4 WHERE id = $5 RETURNING id, nome, email, logradouro, telefone, documento',
        [nome, logradouro, telefone, documento, req.user.id]
      );

      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'Cliente não encontrado' });
      }

      res.json({
        message: 'Perfil atualizado com sucesso',
        cliente: result.rows[0]
      });
    } catch (error) {
      console.error('Erro ao atualizar perfil:', error);
      res.status(500).json({ error: 'Erro interno do servidor' });
    }
  }
}

module.exports = ClienteController;