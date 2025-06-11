const pool = require('../config/database');

class CestaController {
  // Obter cesta do cliente
  static async obterCesta(req, res) {
    try {
      const clienteId = req.user.id;

      // Buscar ou criar cesta
      let cestaResult = await pool.query(
        'SELECT * FROM cestas WHERE cliente_id = $1',
        [clienteId]
      );

      let cesta;
      if (cestaResult.rows.length === 0) {
        // Criar nova cesta
        const novaCesta = await pool.query(
          'INSERT INTO cestas (cliente_id, total) VALUES ($1, 0) RETURNING *',
          [clienteId]
        );
        cesta = novaCesta.rows[0];
      } else {
        cesta = cestaResult.rows[0];
      }

      // Buscar produtos da cesta
      const produtosResult = await pool.query(`
        SELECT p.*, cp.quantidade as quantidade_cesta
        FROM produtos p
        INNER JOIN cesta_produtos cp ON p.codigo = cp.produto_codigo
        WHERE cp.cesta_codigo = $1
      `, [cesta.codigo]);

      // Calcular total
      let total = 0;
      const itens = produtosResult.rows.map(produto => {
        const valorFinal = produto.promo > 0 ? produto.promo : produto.valor;
        const subtotal = valorFinal * produto.quantidade_cesta;
        total += subtotal;
        
        return {
          ...produto,
          valor_final: valorFinal,
          subtotal: subtotal
        };
      });

      // Atualizar total na cesta
      await pool.query(
        'UPDATE cestas SET total = $1 WHERE codigo = $2',
        [total, cesta.codigo]
      );

      res.json({
        codigo: cesta.codigo,
        total: total,
        cliente_id: cesta.cliente_id,
        itens: itens
      });
    } catch (error) {
      console.error('Erro ao obter cesta:', error);
      res.status(500).json({ error: 'Erro interno do servidor' });
    }
  }

  // Adicionar produto à cesta
  static async adicionarProduto(req, res) {
    try {
      const clienteId = req.user.id;
      const { produto_codigo, quantidade = 1 } = req.body;

      // Verificar se produto existe
      const produtoResult = await pool.query(
        'SELECT * FROM produtos WHERE codigo = $1',
        [produto_codigo]
      );

      if (produtoResult.rows.length === 0) {
        return res.status(404).json({ error: 'Produto não encontrado' });
      }

      const produto = produtoResult.rows[0];

      // Verificar estoque
      if (produto.quantidade < quantidade) {
        return res.status(400).json({ error: 'Quantidade insuficiente em estoque' });
      }

      // Buscar ou criar cesta
      let cestaResult = await pool.query(
        'SELECT * FROM cestas WHERE cliente_id = $1',
        [clienteId]
      );

      let cesta;
      if (cestaResult.rows.length === 0) {
        const novaCesta = await pool.query(
          'INSERT INTO cestas (cliente_id, total) VALUES ($1, 0) RETURNING *',
          [clienteId]
        );
        cesta = novaCesta.rows[0];
      } else {
        cesta = cestaResult.rows[0];
      }

      // Verificar se produto já está na cesta
      const itemExistente = await pool.query(
        'SELECT * FROM cesta_produtos WHERE cesta_codigo = $1 AND produto_codigo = $2',
        [cesta.codigo, produto_codigo]
      );

      if (itemExistente.rows.length > 0) {
        // Atualizar quantidade
        await pool.query(
          'UPDATE cesta_produtos SET quantidade = quantidade + $1 WHERE cesta_codigo = $2 AND produto_codigo = $3',
          [quantidade, cesta.codigo, produto_codigo]
        );
      } else {
        // Adicionar novo item
        await pool.query(
          'INSERT INTO cesta_produtos (cesta_codigo, produto_codigo, quantidade) VALUES ($1, $2, $3)',
          [cesta.codigo, produto_codigo, quantidade]
        );
      }

      res.json({ message: 'Produto adicionado à cesta com sucesso' });
    } catch (error) {
      console.error('Erro ao adicionar produto à cesta:', error);
      res.status(500).json({ error: 'Erro interno do servidor' });
    }
  }

  // Remover produto da cesta
  static async removerProduto(req, res) {
    try {
      const clienteId = req.user.id;
      const { produto_codigo } = req.params;

      // Buscar cesta do cliente
      const cestaResult = await pool.query(
        'SELECT * FROM cestas WHERE cliente_id = $1',
        [clienteId]
      );

      if (cestaResult.rows.length === 0) {
        return res.status(404).json({ error: 'Cesta não encontrada' });
      }

      const cesta = cestaResult.rows[0];

      // Remover produto da cesta
      const result = await pool.query(
        'DELETE FROM cesta_produtos WHERE cesta_codigo = $1 AND produto_codigo = $2',
        [cesta.codigo, produto_codigo]
      );

      if (result.rowCount === 0) {
        return res.status(404).json({ error: 'Produto não encontrado na cesta' });
      }

      res.json({ message: 'Produto removido da cesta com sucesso' });
    } catch (error) {
      console.error('Erro ao remover produto da cesta:', error);
      res.status(500).json({ error: 'Erro interno do servidor' });
    }
  }

  // Atualizar quantidade do produto na cesta
  static async atualizarQuantidade(req, res) {
    try {
      const clienteId = req.user.id;
      const { produto_codigo, quantidade } = req.body;

      if (quantidade <= 0) {
        return res.status(400).json({ error: 'Quantidade deve ser maior que zero' });
      }

      // Verificar estoque
      const produtoResult = await pool.query(
        'SELECT quantidade FROM produtos WHERE codigo = $1',
        [produto_codigo]
      );

      if (produtoResult.rows.length === 0) {
        return res.status(404).json({ error: 'Produto não encontrado' });
      }

      if (produtoResult.rows[0].quantidade < quantidade) {
        return res.status(400).json({ error: 'Quantidade insuficiente em estoque' });
      }

      // Buscar cesta do cliente
      const cestaResult = await pool.query(
        'SELECT * FROM cestas WHERE cliente_id = $1',
        [clienteId]
      );

      if (cestaResult.rows.length === 0) {
        return res.status(404).json({ error: 'Cesta não encontrada' });
      }

      const cesta = cestaResult.rows[0];

      // Atualizar quantidade
      const result = await pool.query(
        'UPDATE cesta_produtos SET quantidade = $1 WHERE cesta_codigo = $2 AND produto_codigo = $3',
        [quantidade, cesta.codigo, produto_codigo]
      );

      if (result.rowCount === 0) {
        return res.status(404).json({ error: 'Produto não encontrado na cesta' });
      }

      res.json({ message: 'Quantidade atualizada com sucesso' });
    } catch (error) {
      console.error('Erro ao atualizar quantidade:', error);
      res.status(500).json({ error: 'Erro interno do servidor' });
    }
  }

  // Limpar cesta
  static async limparCesta(req, res) {
    try {
      const clienteId = req.user.id;

      // Buscar cesta do cliente
      const cestaResult = await pool.query(
        'SELECT * FROM cestas WHERE cliente_id = $1',
        [clienteId]
      );

      if (cestaResult.rows.length === 0) {
        return res.status(404).json({ error: 'Cesta não encontrada' });
      }

      const cesta = cestaResult.rows[0];

      // Remover todos os produtos da cesta
      await pool.query(
        'DELETE FROM cesta_produtos WHERE cesta_codigo = $1',
        [cesta.codigo]
      );

      // Zerar total da cesta
      await pool.query(
        'UPDATE cestas SET total = 0 WHERE codigo = $1',
        [cesta.codigo]
      );

      res.json({ message: 'Cesta limpa com sucesso' });
    } catch (error) {
      console.error('Erro ao limpar cesta:', error);
      res.status(500).json({ error: 'Erro interno do servidor' });
    }
  }

  // Finalizar compra
  static async finalizarCompra(req, res) {
    try {
      const clienteId = req.user.id;

      // Buscar dados do cliente
      const clienteResult = await pool.query(
        'SELECT nome FROM clientes WHERE id = $1',
        [clienteId]
      );

      if (clienteResult.rows.length === 0) {
        return res.status(404).json({ error: 'Cliente não encontrado' });
      }

      const cliente = clienteResult.rows[0];

      // Buscar cesta do cliente
      const cestaResult = await pool.query(
        'SELECT * FROM cestas WHERE cliente_id = $1',
        [clienteId]
      );

      if (cestaResult.rows.length === 0) {
        return res.status(404).json({ error: 'Cesta não encontrada' });
      }

      const cesta = cestaResult.rows[0];

      // Buscar produtos da cesta
      const produtosResult = await pool.query(`
        SELECT p.*, cp.quantidade as quantidade_cesta
        FROM produtos p
        INNER JOIN cesta_produtos cp ON p.codigo = cp.produto_codigo
        WHERE cp.cesta_codigo = $1
      `, [cesta.codigo]);

      if (produtosResult.rows.length === 0) {
        return res.status(400).json({ error: 'Cesta vazia' });
      }

      // Calcular total final
      let totalFinal = 0;
      const itensComprados = [];

      // Verificar estoque e calcular total
      for (const item of produtosResult.rows) {
        if (item.quantidade < item.quantidade_cesta) {
          return res.status(400).json({ 
            error: `Produto ${item.nome} não tem estoque suficiente` 
          });
        }

        const valorFinal = item.promo > 0 ? item.promo : item.valor;
        const subtotal = valorFinal * item.quantidade_cesta;
        totalFinal += subtotal;

        itensComprados.push({
          nome: item.nome,
          quantidade: item.quantidade_cesta,
          valor_unitario: valorFinal,
          subtotal: subtotal
        });

        // Reduzir estoque
        await pool.query(
          'UPDATE produtos SET quantidade = quantidade - $1 WHERE codigo = $2',
          [item.quantidade_cesta, item.codigo]
        );
      }

      // Limpar cesta após compra
      await pool.query(
        'DELETE FROM cesta_produtos WHERE cesta_codigo = $1',
        [cesta.codigo]
      );

      await pool.query(
        'UPDATE cestas SET total = 0 WHERE codigo = $1',
        [cesta.codigo]
      );

      // Resposta de sucesso com mensagem personalizada
      res.json({ 
        success: true,
        message: '🎉 Compra efetuada com sucesso!',
        detalhes: {
          cliente: cliente.nome,
          total: totalFinal.toFixed(2),
          quantidade_itens: itensComprados.length,
          itens: itensComprados,
          data_compra: new Date().toLocaleString('pt-BR'),
          agradecimento: `Obrigado pela sua compra, ${cliente.nome}! Seu pedido será processado em breve.`
        }
      });
    } catch (error) {
      console.error('Erro ao finalizar compra:', error);
      res.status(500).json({ error: 'Erro interno do servidor' });
    }
  }
}

module.exports = CestaController;