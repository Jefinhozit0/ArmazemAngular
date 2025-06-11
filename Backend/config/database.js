const mysql = require('mysql2/promise'); // Use a versão com suporte a Promises
require('dotenv').config();

// Cria o pool de conexões com o MySQL
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE, // Garanta que no .env o nome seja DB_DATABASE
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Testa a conexão para garantir que tudo está funcionando
pool.getConnection()
  .then(connection => {
    console.log('Conexão com o banco de dados MySQL bem-sucedida!');
    connection.release(); // Libera a conexão de volta para o pool
  })
  .catch(err => {
    console.error('Erro ao conectar com o banco de dados MySQL:', err);
  });

module.exports = pool;