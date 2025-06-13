const express = require('express');
const router = express.Router();
const pool = require('../config/database');

/**
 * ROTA PARA FINALIZAR UMA COMPRA
 * @route POST /api/pedidos
 */
router.post('/', async (req, res) => {
  try {
    const cestaDeCompras = req.body;
    const clienteId = cestaDeCompras.cliente.id;

    const connection = await pool.getConnection();
    await connection.beginTransaction();

    try {
      // Inserir na tabela cestas (usando cliente_id como padrão)
      const sqlCesta = 'INSERT INTO cestas (cliente_id, total, status, data_compra) VALUES (?, ?, ?, NOW())';
      const [resultCesta] = await connection.query(sqlCesta, [
        clienteId, 
        cestaDeCompras.total, 
        'finalizado'
      ]);
      const novoPedidoId = resultCesta.insertId;

      // Inserir itens na tabela cesta_produtos (usando cesta_id e produto_id como padrão)
      for (const item of cestaDeCompras.itens) {
        const quantidade = 1; // Quantidade fixa como no seu código original
        const sqlItens = 'INSERT INTO cesta_produtos (cesta_id, produto_id, quantidade, valor_unitario) VALUES (?, ?, ?, ?)';
        await connection.query(sqlItens, [
          novoPedidoId, 
          item.id, // Assumindo que o item tem um campo 'id'
          quantidade, 
          item.valor
        ]);
      }

      await connection.commit();
      connection.release();

      console.log(`Pedido ${novoPedidoId} finalizado com sucesso para o cliente ${clienteId}`);
      res.status(201).json({ 
        message: 'Pedido finalizado com sucesso!', 
        pedidoId: novoPedidoId 
      });

    } catch (error) {
      await connection.rollback();
      connection.release();
      console.error('Erro na transação:', error);
      throw error;
    }

  } catch (error) {
    console.error('Erro ao finalizar pedido:', error);
    res.status(500).json({ 
      error: 'Erro interno no servidor ao processar o pedido.',
      details: error.message 
    });
  }
});

/**
 * ROTA PARA BUSCAR O HISTÓRICO DE PEDIDOS DE UM CLIENTE
 * @route GET /api/pedidos/historico/:clienteId
 */
router.get('/historico/:clienteId', async (req, res) => {
  try {
    const { clienteId } = req.params;

    const sql = `
      SELECT
        c.id AS pedido_id,
        c.total AS pedido_total,
        c.data_compra,
        p.id AS produto_id,
        p.nome AS produto_nome,
        cp.quantidade,
        cp.valor_unitario
      FROM cestas c
      JOIN cesta_produtos cp ON c.id = cp.cesta_id
      JOIN produtos p ON cp.produto_id = p.id
      WHERE c.cliente_id = ? AND c.status = 'finalizado'
      ORDER BY c.data_compra DESC, c.id DESC;
    `;

    const [rows] = await pool.query(sql, [clienteId]);

    const pedidos = {};
    for (const row of rows) {
      if (!row.pedido_id) continue;
      
      if (!pedidos[row.pedido_id]) {
        pedidos[row.pedido_id] = {
          id: row.pedido_id,
          total: parseFloat(row.pedido_total),
          data: row.data_compra,
          produtos: []
        };
      }
      pedidos[row.pedido_id].produtos.push({
        id: row.produto_id,
        nome: row.produto_nome,
        quantidade: row.quantidade,
        valor: parseFloat(row.valor_unitario)
      });
    }

    res.json(Object.values(pedidos));

  } catch (error) {
    console.error('Erro ao buscar histórico de pedidos:', error);
    res.status(500).json({ 
      error: 'Erro interno ao buscar histórico.',
      details: error.message
    });
  }
});

module.exports = router;