const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/categoryController');
const { authenticate, authorize } = require('../middleware/authMiddleware');
const { validateCategory } = require('../middleware/validation');

// Aplicar autenticação a todas as rotas
router.use(authenticate);

// @route   GET /api/categories
// @desc    Listar todas as categorias
// @access  Private
router.get('/', categoryController.getCategories);

// @route   GET /api/categories/:id
// @desc    Obter categoria por ID
// @access  Private
router.get('/:id', categoryController.getCategoryById);

// @route   POST /api/categories
// @desc    Criar nova categoria
// @access  Private (Admin/Manager)
router.post('/', authorize(['admin', 'manager']), validateCategory, categoryController.createCategory);

// @route   PUT /api/categories/:id
// @desc    Atualizar categoria
// @access  Private (Admin/Manager)
router.put('/:id', authorize(['admin', 'manager']), validateCategory, categoryController.updateCategory);

// @route   DELETE /api/categories/:id
// @desc    Deletar categoria
// @access  Private (Admin only)
router.delete('/:id', authorize(['admin']), categoryController.deleteCategory);

module.exports = router;