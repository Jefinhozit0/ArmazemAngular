const express = require('express');
const router = express.Router();

// Altere a rota de '/pedidos' para '/'
router.post('/', (req, res) => {
  try {
    const cestaDeCompras = req.body;
    console.log('Recebi um novo pedido:', cestaDeCompras);

    res.status(200).json({ 
      success: true, 
      message: 'Pedido recebido com sucesso!',
      detalhes: cestaDeCompras 
    });

  } catch (error) {
    console.error('Erro ao processar o pedido:', error);
    res.status(500).json({ error: 'Erro interno no servidor' });
  }
});

module.exports = router;