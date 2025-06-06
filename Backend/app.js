const express = require('express');
const cors = require('cors');
require('dotenv').config();

const clienteRoutes = require('./routes/clienteRoutes');
const produtoRoutes = require('./routes/produtoRoutes');
const cestaRoutes = require('./routes/cestaRoutes');

const app = express();
app.use(cors());
app.use(express.json());

app.use('/clientes', clienteRoutes);
app.use('/produtos', produtoRoutes);
app.use('/cestas', cestaRoutes);

module.exports = app;
