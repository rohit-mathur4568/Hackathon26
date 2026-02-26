const mysql = require('mysql2/promise');
require('dotenv').config();

// TiDB se connection pool bana rahe hain
const db = mysql.createPool({
  host: process.env.TIDB_HOST,
  port: process.env.TIDB_PORT || 4000,
  user: process.env.TIDB_USER,
  password: process.env.TIDB_PASSWORD,
  database: process.env.TIDB_DATABASE,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  ssl: {
    minVersion: 'TLSv1.2' // TiDB Cloud ke liye yeh line bohot zaroori hai
  }
});

// Test connection on startup
db.getConnection()
  .then(() => console.log('✅ Connected to TiDB Database successfully!'))
  .catch((err) => console.error('❌ TiDB Connection Error:', err.message));

module.exports = db;