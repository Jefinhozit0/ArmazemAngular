const { v4: uuidv4 } = require('uuid');
const productService = require('../services/productService');

class ProductController {
  async getProducts(req, res, next) {
    try {
      const { page = 1, limit = 10, category, supplier } = req.query;
      
      const filters = {};
      if (category) filters.category = category;
      if (supplier) filters.supplier = supplier;

      const products = await productService.findAll({
        page: parseInt(page),
        limit: parseInt(limit),
        filters
      });

      res.json({
        success: true,
        data: products
      });
    } catch (error) {
      next(error);
    }
  }

  async getProductById(req, res, next) {
    try {
      const { id } = req.params;
      const product = await productService.findById(id);

      if (!product) {
        return res.status(404).json({
          success: false,
          message: 'Produto não encontrado'
        });
      }

      res.json({
        success: true,
        data: { product }
      });
    } catch (error) {
      next(error);
    }
  }

  async createProduct(req, res, next) {
    try {
      const productData = {
        id: uuidv4(),
        ...req.body,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        createdBy: req.user.id
      };

      const product = await productService.create(productData);

      res.status(201).json({
        success: true,
        message: 'Produto criado com sucesso',
        data: { product }
      });
    } catch (error) {
      next(error);
    }
  }

  async updateProduct(req, res, next) {
    try {
      const { id } = req.params;
      const updateData = {
        ...req.body,
        updatedAt: new Date().toISOString(),
        updatedBy: req.user.id
      };

      const product = await productService.update(id, updateData);

      if (!product) {
        return res.status(404).json({
          success: false,
          message: 'Produto não encontrado'
        });
      }

      res.json({
        success: true,
        message: 'Produto atualizado com sucesso',
        data: { product }
      });
    } catch (error) {
      next(error);
    }
  }

  async deleteProduct(req, res, next) {
    try {
      const { id } = req.params;
      const deleted = await productService.delete(id);

      if (!deleted) {
        return res.status(404).json({
          success: false,
          message: 'Produto não encontrado'
        });
      }

      res.json({
        success: true,
        message: 'Produto deletado com sucesso'
      });
    } catch (error) {
      next(error);
    }
  }

  async searchProducts(req, res, next) {
    try {
      const { q, page = 1, limit = 10 } = req.query;

      if (!q) {
        return res.status(400).json({
          success: false,
          message: 'Parâmetro de busca é obrigatório'
        });
      }

      const products = await productService.search(q, {
        page: parseInt(page),
        limit: parseInt(limit)
      });

      res.json({
        success: true,
        data: products
      });
    } catch (error) {
      next(error);
    }
  }

  async getLowStockProducts(req, res, next) {
    try {
      const { threshold = 10 } = req.query;
      const products = await productService.findLowStock(parseInt(threshold));

      res.json({
        success: true,
        data: { products }
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new ProductController();