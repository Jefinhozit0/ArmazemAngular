console.log("--- [server.js] Iniciando execução do servidor. ---");

// Importa a aplicação configurada do arquivo app.js
const app = require('./app');

console.log("--- [server.js] Objeto 'app' importado com sucesso. ---");

const PORT = process.env.PORT || 3000;

// Inicia o servidor
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/api/health`);
});