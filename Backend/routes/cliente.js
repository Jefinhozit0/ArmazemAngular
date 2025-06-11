// ✅ ESSAS LINHAS INICIAIS ESTAVAM FALTANDO NO SEU ARQUIVO
const express = require('express');
const router = express.Router();
const pool = require('../config/database');
// --------------------------------------------------------

/**
 * ROTA PARA BUSCAR TODOS OS CLIENTES
 * @route GET /api/clientes
 */
router.get('/', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT id, nome, email, telefone, documento, logradouro FROM clientes');
    res.json(rows);
  } catch (error) {
    console.error('Erro ao buscar clientes:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

/**
 * ROTA PARA CRIAR UM NOVO CLIENTE (CADASTRO)
 * @route POST /api/clientes
 */
router.post('/', async (req, res) => {
  try {
    const { nome, email, senha, telefone, documento, logradouro } = req.body;
    const sql = 'INSERT INTO clientes (nome, email, senha, telefone, documento, logradouro) VALUES (?, ?, ?, ?, ?, ?)';
    const [result] = await pool.query(sql, [nome, email, senha, telefone, documento, logradouro]);
    res.status(201).json({ id: result.insertId, nome, email });
  } catch (error) {
    console.error('Erro ao criar cliente:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

/**
 * ROTA PARA AUTENTICAR UM CLIENTE (LOGIN)
 * @route POST /api/clientes/login
 */
router.post('/login', async (req, res) => {
  try {
    const { email, senha } = req.body;
    const [rows] = await pool.query('SELECT * FROM clientes WHERE email = ?', [email]);

    if (rows.length > 0) {
      const cliente = rows[0];
      if (cliente.senha === senha) {
        const { senha, ...dadosCliente } = cliente;
        res.json(dadosCliente);
      } else {
        res.status(401).json({ error: 'Email ou senha inválidos' });
      }
    } else {
      res.status(404).json({ error: 'Email ou senha inválidos' });
    }
  } catch (error) {
    console.error('Erro no login do cliente:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

module.exports = router;