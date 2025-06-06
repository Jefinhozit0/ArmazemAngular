const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const { authenticate, authorize } = require('../middleware/authMiddleware');
const { validateProduct, validateProductUpdate } = require('../middleware/validation');

// Aplicar autenticação a todas as rotas
router.use(authenticate);

// @route   GET /api/products
// @desc    Listar todos os produtos
// @access  Private
router.get('/', productController.getProducts);

// @route   GET /api/products/search
// @desc    Buscar produtos
// @access  Private
router.get('/search', productController.searchProducts);

// @route   GET /api/products/low-stock
// @desc    Produtos com estoque baixo
// @access  Private
router.get('/low-stock', productController.getLowStockProducts);

// @route   GET /api/products/:id
// @desc    Obter produto por ID
// @access  Private
router.get('/:id', productController.getProductById);

// @route   POST /api/products
// @desc    Criar novo produto
// @access  Private (Admin/Manager)
router.post('/', authorize(['admin', 'manager']), validateProduct, productController.createProduct);

// @route   PUT /api/products/:id
// @desc    Atualizar produto
// @access  Private (Admin/Manager)
router.put('/:id', authorize(['admin', 'manager']), validateProductUpdate, productController.updateProduct);

// @route   DELETE /api/products/:id
// @desc    Deletar produto
// @access  Private (Admin only)
router.delete('/:id', authorize(['admin']), productController.deleteProduct);

module.exports = router;