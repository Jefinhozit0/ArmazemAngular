const pool = require('../config/database');

class ProdutoController {
  // Listar todos os produtos
  static async listar(req, res) {
    try {
      const { destaque, search, limit = 50, offset = 0 } = req.query;
      
      let query = 'SELECT * FROM produtos WHERE 1=1';
      let params = [];
      let paramCount = 0;

      if (destaque === 'true') {
        query += ` AND destaque = true`;
      }

      if (search) {
        paramCount++;
        query += ` AND (nome ILIKE $${paramCount} OR keywords ILIKE $${paramCount})`;
        params.push(`%${search}%`);
      }

      query += ` ORDER BY nome LIMIT $${paramCount + 1} OFFSET $${paramCount + 2}`;
      params.push(limit, offset);

      const result = await pool.query(query, params);
      res.json(result.rows);
    } catch (error) {
      console.error('Erro ao listar produtos:', error);
      res.status(500).json({ error: 'Erro interno do servidor' });
    }
  }

  // Buscar produto por código
  static async buscarPorCodigo(req, res) {
    try {
      const { codigo } = req.params;
      
      const result = await pool.query('SELECT * FROM produtos WHERE codigo = $1', [codigo]);
      
      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'Produto não encontrado' });
      }

      res.json(result.rows[0]);
    } catch (error) {
      console.error('Erro ao buscar produto:', error);
      res.status(500).json({ error: 'Erro interno do servidor' });
    }
  }

  // Produtos em destaque
  static async destaques(req, res) {
    try {
      const result = await pool.query(
        'SELECT * FROM produtos WHERE destaque = true ORDER BY nome LIMIT 10'
      );
      res.json(result.rows);
    } catch (error) {
      console.error('Erro ao buscar destaques:', error);
      res.status(500).json({ error: 'Erro interno do servidor' });
    }
  }

  // Produtos em promoção
  static async promocoes(req, res) {
    try {
      const result = await pool.query(
        'SELECT * FROM produtos WHERE promo > 0 ORDER BY promo DESC LIMIT 20'
      );
      res.json(result.rows);
    } catch (error) {
      console.error('Erro ao buscar promoções:', error);
      res.status(500).json({ error: 'Erro interno do servidor' });
    }
  }

  // (Opcional) Placeholder para criação de produto
  static async criarProduto(req, res) {
    res.status(501).json({ error: 'Funcionalidade criarProduto ainda não implementada' });
  }
}

module.exports = ProdutoController;
