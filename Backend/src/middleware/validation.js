const Joi = require('joi');

// Middleware para validação de dados
const validate = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body);
    
    if (error) {
      return res.status(400).json({
        success: false,
        message: 'Dados inválidos',
        errors: error.details.map(detail => ({
          field: detail.path.join('.'),
          message: detail.message
        }))
      });
    }
    
    next();
  };
};

// Schemas de validação
const loginSchema = Joi.object({
  email: Joi.string().email().required().messages({
    'string.email': 'Email deve ter um formato válido',
    'any.required': 'Email é obrigatório'
  }),
  password: Joi.string().min(6).required().messages({
    'string.min': 'Senha deve ter pelo menos 6 caracteres',
    'any.required': 'Senha é obrigatória'
  })
});

const registerSchema = Joi.object({
  name: Joi.string().min(2).max(100).required().messages({
    'string.min': 'Nome deve ter pelo menos 2 caracteres',
    'string.max': 'Nome deve ter no máximo 100 caracteres',
    'any.required': 'Nome é obrigatório'
  }),
  email: Joi.string().email().required().messages({
    'string.email': 'Email deve ter um formato válido',
    'any.required': 'Email é obrigatório'
  }),
  password: Joi.string().min(6).required().messages({
    'string.min': 'Senha deve ter pelo menos 6 caracteres',
    'any.required': 'Senha é obrigatória'
  }),
  role: Joi.string().valid('admin', 'manager', 'user').default('user')
});

const productSchema = Joi.object({
  name: Joi.string().min(2).max(200).required().messages({
    'string.min': 'Nome deve ter pelo menos 2 caracteres',
    'string.max': 'Nome deve ter no máximo 200 caracteres',
    'any.required': 'Nome é obrigatório'
  }),
  description: Joi.string().max(1000).allow(''),
  sku: Joi.string().min(3).max(50).required().messages({
    'string.min': 'SKU deve ter pelo menos 3 caracteres',
    'string.max': 'SKU deve ter no máximo 50 caracteres',
    'any.required': 'SKU é obrigatório'
  }),
  barcode: Joi.string().max(50).allow(''),
  category: Joi.string().required().messages({
    'any.required': 'Categoria é obrigatória'
  }),
  supplier: Joi.string().allow(''),
  price: Joi.number().positive().required().messages({
    'number.positive': 'Preço deve ser positivo',
    'any.required': 'Preço é obrigatório'
  }),
  cost: Joi.number().positive().default(0),
  quantity: Joi.number().integer().min(0).required().messages({
    'number.min': 'Quantidade não pode ser negativa',
    'any.required': 'Quantidade é obrigatória'
  }),
  minStock: Joi.number().integer().min(0).default(0),
  maxStock: Joi.number().integer().min(0).default(1000),
  location: Joi.string().allow(''),
  status: Joi.string().valid('active', 'inactive', 'discontinued').default('active')
});

const productUpdateSchema = productSchema.fork(['name', 'sku', 'category', 'price', 'quantity'], 
  (schema) => schema.optional()
);

const categorySchema = Joi.object({
  name: Joi.string().min(2).max(100).required().messages({
    'string.min': 'Nome deve ter pelo menos 2 caracteres',
    'string.max': 'Nome deve ter no máximo 100 caracteres',
    'any.required': 'Nome é obrigatório'
  }),
  description: Joi.string().max(500).allow(''),
  status: Joi.string().valid('active', 'inactive').default('active')
});

// Middleware exportados
module.exports = {
  validateLogin: validate(loginSchema),
  validateRegister: validate(registerSchema),
  validateProduct: validate(productSchema),
  validateProductUpdate: validate(productUpdateSchema),
  validateCategory: validate(categorySchema)
};