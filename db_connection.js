const { Pool } = require('pg');

const pool2 = new Pool({
  host: 'localhost',     // Menggunakan host localhost
  port: 5432,            // Port standar PostgreSQL
  user: 'postgres',      // Username postgres
  password: 'user',      // Password user
  database: 'Local_DB'   // Nama database Local_DB
});

pool2.connect();

module.exports = pool2;

