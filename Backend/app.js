const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors({
  origin: ['http://localhost:4200', 'http://localhost:3000'],
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Middleware de log
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// ---- ROTAS ----
app.use('/api/clientes', require('./routes/cliente'));
app.use('/api/produtos', require('./routes/produto'));
app.use('/api/cestas', require('./routes/cesta'));
app.use('/api/pedidos', require('./routes/pedidos'));

// ✅ ADICIONE OU VERIFIQUE SE ESTA ROTA EXISTE ABAIXO
app.get('/api/health', (req, res) => {
  res.json({
    message: 'Backend funcionando!',
    timestamp: new Date().toISOString()
  });
});

// Middleware de erro
app.use((err, req, res, next) => {
  console.error('Erro:', err);
  res.status(500).json({ error: 'Erro interno do servidor' });
});

// Rota 404 (para qualquer outra rota não encontrada)
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Rota não encontrada' });
});

// Exporta o app configurado para ser usado pelo server.js
module.exports = app;