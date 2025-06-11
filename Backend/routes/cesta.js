const express = require('express');
const router = express.Router();
const cestaController = require('../controllers/cestaController');

// Usar obterCesta para retornar a cesta do usuário autenticado
router.post('/', cestaController.obterCesta);

// Adicionar produto à cesta
router.post('/:id/produtos', cestaController.adicionarProduto);

// (Opcional) comente esta rota se não quiser conflito com autenticação baseada em req.user
// router.get('/:id', cestaController.obterCesta); 

module.exports = router;
