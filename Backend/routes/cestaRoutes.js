const express = require('express');
const router = express.Router();
const cestaController = require('../controllers/cestaController');

router.post('/', cestaController.criarCesta);
router.post('/:id/produtos', cestaController.adicionarProduto);
router.get('/:id', cestaController.visualizarCesta);

module.exports = router;
