const express = require('express');
const router = express.Router();

// Import route modules
const authRoutes = require('./authRoutes');
const productRoutes = require('./productRoutes');
const categoryRoutes = require('./categoryRoutes');
const supplierRoutes = require('./supplierRoutes');
const movementRoutes = require('./movementRoutes');
const userRoutes = require('./userRoutes');

// API documentation endpoint
router.get('/', (req, res) => {
  res.json({
    message: 'API do Sistema de Armazém',
    version: '1.0.0',
    endpoints: {
      auth: '/api/auth',
      products: '/api/products',
      categories: '/api/categories',
      suppliers: '/api/suppliers',
      movements: '/api/movements',
      users: '/api/users'
    },
    documentation: '/api/docs'
  });
});

// Route handlers
router.use('/auth', authRoutes);
router.use('/products', productRoutes);
router.use('/categories', categoryRoutes);
router.use('/suppliers', supplierRoutes);
router.use('/movements', movementRoutes);
router.use('/users', userRoutes);

module.exports = router;