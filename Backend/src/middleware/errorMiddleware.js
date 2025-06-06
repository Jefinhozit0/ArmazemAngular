const config = require('../config/config');

const notFound = (req, res, next) => {
  const error = new Error(`Rota não encontrada - ${req.originalUrl}`);
  res.status(404);
  next(error);
};

const errorHandler = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;

  // Log do erro
  console.error(err);

  // Erro de validação do Mongoose (se usar MongoDB)
  if (err.name === 'ValidationError') {
    const message = Object.values(err.errors).map(val => val.message);
    error = {
      message: 'Erro de validação',
      errors: message
    };
    return res.status(400).json({
      success: false,
      ...error
    });
  }

  // Erro de cast do Mongoose (ID inválido)
  if (err.name === 'CastError') {
    const message = 'Recurso não encontrado';
    error = { message };
    return res.status(404).json({
      success: false,
      ...error
    });
  }

  // Erro de chave duplicada
  if (err.code === 11000) {
    const message = 'Recurso duplicado';
    error = { message };
    return res.status(400).json({
      success: false,
      ...error
    });
  }

  // Erro de JWT
  if (err.name === 'JsonWebTokenError') {
    const message = 'Token inválido';
    error = { message };
    return res.status(401).json({
      success: false,
      ...error
    });
  }

  // Erro de JWT expirado
  if (err.name === 'TokenExpiredError') {
    const message = 'Token expirado';
    error = { message };
    return res.status(401).json({
      success: false,
      ...error
    });
  }

  res.status(error.statusCode || 500).json({
    success: false,
    message: error.message || 'Erro interno do servidor',
    ...(config.nodeEnv === 'development' && { stack: err.stack })
  });
};

module.exports = {
  notFound,
  errorHandler
};