const express = require('express');
const router = express.Router();
const produtoController = require('../controllers/produtoController');

// Rota para listar produtos
router.get('/', produtoController.listar);

// Rota para criar produto (comentada até implementar o método)
// router.post('/', produtoController.criarProduto);

module.exports = router;
