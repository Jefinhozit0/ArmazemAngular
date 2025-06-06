const pool = require('../models/db');

exports.criarCesta = async (req, res) => {
  const { cliente_id } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO cestas (cliente_id) VALUES ($1) RETURNING *',
      [cliente_id]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ erro: 'Erro ao criar cesta', detalhe: error.message });
  }
};

exports.adicionarProduto = async (req, res) => {
  const cesta_codigo = req.params.id;
  const { produto_codigo } = req.body;
  try {
    await pool.query(
      'INSERT INTO cesta_produtos (cesta_codigo, produto_codigo) VALUES ($1, $2) ON CONFLICT DO NOTHING',
      [cesta_codigo, produto_codigo]
    );
    const totalResult = await pool.query(
      `SELECT SUM(p.valor - COALESCE(p.promo, 0)) AS total
       FROM cesta_produtos cp
       JOIN produtos p ON p.codigo = cp.produto_codigo
       WHERE cp.cesta_codigo = $1`,
      [cesta_codigo]
    );
    const total = totalResult.rows[0].total || 0;
    await pool.query(
      'UPDATE cestas SET total = $1 WHERE codigo = $2',
      [total, cesta_codigo]
    );
    res.status(200).json({ mensagem: 'Produto adicionado à cesta', total });
  } catch (error) {
    res.status(500).json({ erro: 'Erro ao adicionar produto na cesta', detalhe: error.message });
  }
};

exports.visualizarCesta = async (req, res) => {
  const cesta_codigo = req.params.id;
  try {
    const result = await pool.query(
      `SELECT p.*
       FROM cesta_produtos cp
       JOIN produtos p ON p.codigo = cp.produto_codigo
       WHERE cp.cesta_codigo = $1`,
      [cesta_codigo]
    );
    const totalResult = await pool.query(
      'SELECT total FROM cestas WHERE codigo = $1',
      [cesta_codigo]
    );
    res.json({
      produtos: result.rows,
      total: totalResult.rows[0]?.total || 0,
    });
  } catch (error) {
    res.status(500).json({ erro: 'Erro ao visualizar cesta', detalhe: error.message });
  }
};
