const pool = require('../models/db');

exports.listarProdutos = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM produtos ORDER BY destaque DESC, nome ASC');
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ erro: 'Erro ao buscar produtos', detalhe: error.message });
  }
};

exports.criarProduto = async (req, res) => {
  const { codigo, nome, descritivo, valor, keywords, quantidade, promo, destaque } = req.body;
  try {
    const result = await pool.query(
      `INSERT INTO produtos 
       (codigo, nome, descritivo, valor, keywords, quantidade, promo, destaque)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *`,
      [codigo, nome, descritivo, valor, keywords, quantidade, promo, destaque]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ erro: 'Erro ao cadastrar produto', detalhe: error.message });
  }
};
