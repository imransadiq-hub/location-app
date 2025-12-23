const { Pool } = require('pg');
require('dotenv').config();

// Option 1: Using DATABASE_URL
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// Option 2: Using individual values (comment out Option 1 if using this)
/*
const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
});
*/

// Test connection
pool.on('connect', () => {
  console.log('✅ Connected to PostgreSQL database');
});

pool.on('error', (err) => {
  console.error('❌ Unexpected database error:', err);
  process.exit(-1);
});

module.exports = pool;