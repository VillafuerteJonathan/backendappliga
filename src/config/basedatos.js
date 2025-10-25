const { Pool } = require('pg');
require('dotenv').config();

// Configuración de conexión a PostgreSQL 18
const pool = new Pool({
  user: process.env.DB_USER ,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME ,
  password: process.env.DB_PASSWORD ,
  port: process.env.DB_PORT ,
  max: 20, // máximo de conexiones
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

// Verificar conexión
const testConnection = async () => {
  try {
    const result = await pool.query('SELECT NOW()');
    console.log(`✅ Conectado a PostgreSQL 18 - LDPapp | Hora del servidor: ${result.rows[0].now}`);
  } catch (error) {
    console.error('❌ Error conectando a PostgreSQL:', error.message);
    process.exit(1);
  }
};

testConnection();

module.exports = pool;
