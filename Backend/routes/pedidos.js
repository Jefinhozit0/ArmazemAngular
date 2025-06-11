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

    // Inicia uma transação para garantir que todas as inserções funcionem ou nenhuma
    const connection = await pool.getConnection();
    await connection.beginTransaction();

    try {
      // Cria a cesta (pedido) no banco com status 'finalizado' e a data atual
      const sqlCesta = 'INSERT INTO cestas (id_cliente, total, status, data_compra) VALUES (?, ?, ?, NOW())';
      const [resultCesta] = await connection.query(sqlCesta, [clienteId, cestaDeCompras.total, 'finalizado']);
      const novoPedidoId = resultCesta.insertId;

      // Insere cada item do pedido na tabela de associação 'cesta_produtos'
      for (const item of cestaDeCompras.itens) {
        // Assume que a quantidade é 1 se não for especificada
        const quantidade = item.quantidade || 1; 
        const sqlItens = 'INSERT INTO cesta_produtos (id_cesta, id_produto, quantidade, valor_unitario) VALUES (?, ?, ?, ?)';
        await connection.query(sqlItens, [novoPedidoId, item.codigo, quantidade, item.valor]);
      }

      // Se tudo deu certo, confirma as alterações no banco de dados
      await connection.commit();
      connection.release();

      console.log(`Pedido ${novoPedidoId} finalizado com sucesso para o cliente ${clienteId}`);
      res.status(201).json({ message: 'Pedido finalizado com sucesso!', pedidoId: novoPedidoId });

    } catch (error) {
      // Se qualquer etapa falhar, desfaz todas as alterações
      await connection.rollback();
      connection.release();
      throw error; // Joga o erro para o catch principal para ser logado
    }

  } catch (error) {
    console.error('Erro ao finalizar pedido:', error);
    res.status(500).json({ error: 'Erro interno no servidor ao processar o pedido.' });
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
      JOIN cesta_produtos cp ON c.id = cp.id_cesta
      JOIN produtos p ON cp.id_produto = p.id
      WHERE c.id_cliente = ? AND c.status = 'finalizado'
      ORDER BY c.data_compra DESC, c.id DESC;
    `;

    const [rows] = await pool.query(sql, [clienteId]);

    // Transforma o resultado plano do SQL em um objeto aninhado (pedidos com seus produtos)
    const pedidos = {};
    for (const row of rows) {
      if (!pedidos[row.pedido_id]) {
        pedidos[row.pedido_id] = {
          id: row.pedido_id,
          total: row.pedido_total,
          data: row.data_compra,
          produtos: []
        };
      }
      pedidos[row.pedido_id].produtos.push({
        id: row.produto_id,
        nome: row.produto_nome,
        quantidade: row.quantidade,
        valor: row.valor_unitario
      });
    }

    // Converte o objeto de pedidos em um array para enviar como JSON
    const resultadoFinal = Object.values(pedidos);

    res.json(resultadoFinal);

  } catch (error) {
    console.error('Erro ao buscar histórico de pedidos:', error);
    res.status(500).json({ error: 'Erro interno ao buscar histórico.' });
  }
});


module.exports = router;