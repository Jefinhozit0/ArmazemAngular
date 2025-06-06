// Simulação de base de dados em memória (substitua por base de dados real)
let products = [
  {
    id: '1',
    name: 'Produto Exemplo',
    description: 'Descrição do produto exemplo',
    sku: 'PROD-001',
    barcode: '1234567890123',
    category: 'Categoria A',
    supplier: 'Fornecedor A',
    price: 29.99,
    cost: 15.00,
    quantity: 100,
    minStock: 10,
    maxStock: 500,
    location: 'A1-B2-C3',
    status: 'active',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    createdBy: '1'
  }
];

class ProductService {
  async findAll(options = {}) {
    const { page = 1, limit = 10, filters = {} } = options;
    
    let filteredProducts = products;

    // Aplicar filtros
    if (filters.category) {
      filteredProducts = filteredProducts.filter(p => 
        p.category.toLowerCase().includes(filters.category.toLowerCase())
      );
    }

    if (filters.supplier) {
      filteredProducts = filteredProducts.filter(p => 
        p.supplier.toLowerCase().includes(filters.supplier.toLowerCase())
      );
    }

    if (filters.status) {
      filteredProducts = filteredProducts.filter(p => p.status === filters.status);
    }

    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;

    return {
      products: filteredProducts.slice(startIndex, endIndex),
      total: filteredProducts.length,
      page,
      limit,
      totalPages: Math.ceil(filteredProducts.length / limit)
    };
  }

  async findById(id) {
    return products.find(p => p.id === id);
  }

  async findBySku(sku) {
    return products.find(p => p.sku === sku);
  }

  async create(productData) {
    // Verificar se SKU já existe
    const existingSku = await this.findBySku(productData.sku);
    if (existingSku) {
      throw new Error('SKU já existe');
    }

    products.push(productData);
    return productData;
  }

  async update(id, updateData) {
    const productIndex = products.findIndex(p => p.id === id);
    if (productIndex === -1) return null;

    // Se está atualizando SKU, verificar se já existe
    if (updateData.sku && updateData.sku !== products[productIndex].sku) {
      const existingSku = await this.findBySku(updateData.sku);
      if (existingSku) {
        throw new Error('SKU já existe');
      }
    }

    products[productIndex] = { ...products[productIndex], ...updateData };
    return products[productIndex];
  }

  async delete(id) {
    const productIndex = products.findIndex(p => p.id === id);
    if (productIndex === -1) return false;

    products.splice(productIndex, 1);
    return true;
  }

  async search(query, options = {}) {
    const { page = 1, limit = 10 } = options;
    
    const searchResults = products.filter(product => 
      product.name.toLowerCase().includes(query.toLowerCase()) ||
      product.description.toLowerCase().includes(query.toLowerCase()) ||
      product.sku.toLowerCase().includes(query.toLowerCase()) ||
      product.barcode.includes(query)
    );

    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;

    return {
      products: searchResults.slice(startIndex, endIndex),
      total: searchResults.length,
      page,
      limit,
      totalPages: Math.ceil(searchResults.length / limit)
    };
  }

  async findLowStock(threshold = 10) {
    return products.filter(product => 
      product.quantity <= Math.max(threshold, product.minStock)
    );
  }

  async updateStock(id, quantity, operation = 'set') {
    const productIndex = products.findIndex(p => p.id === id);
    if (productIndex === -1) return null;

    const product = products[productIndex];

    switch (operation) {
      case 'add':
        product.quantity += quantity;
        break;
      case 'subtract':
        product.quantity = Math.max(0, product.quantity - quantity);
        break;
      case 'set':
      default:
        product.quantity = quantity;
        break;
    }

    product.updatedAt = new Date().toISOString();
    return product;
  }
}

module.exports = new ProductService();