const pool = require('../models/db');
const bcrypt = require('bcrypt');

exports.criarCliente = async (req, res) => {
  const { nome, email, senha, telefone, logradouro, documento } = req.body;
  try {
    const hash = await bcrypt.hash(senha, 10);
    const result = await pool.query(
      `INSERT INTO clientes (nome, email, senha, telefone, logradouro, documento)
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
      [nome, email, hash, telefone, logradouro, documento]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ erro: 'Erro ao cadastrar cliente', detalhe: error.message });
  }
};

exports.loginCliente = async (req, res) => {
  const { email, senha } = req.body;
  try {
    const result = await pool.query('SELECT * FROM clientes WHERE email = $1', [email]);
    if (result.rows.length === 0) {
      return res.status(401).json({ erro: 'Email não encontrado' });
    }
    const cliente = result.rows[0];
    const senhaValida = await bcrypt.compare(senha, cliente.senha);
    if (!senhaValida) {
      return res.status(401).json({ erro: 'Senha incorreta' });
    }
    res.json({ mensagem: 'Login bem-sucedido', cliente });
  } catch (error) {
    res.status(500).json({ erro: 'Erro no login', detalhe: error.message });
  }
};
