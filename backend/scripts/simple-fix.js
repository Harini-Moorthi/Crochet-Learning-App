console.log('🔧 Adding updated_at column to user_progress table...');

require('dotenv').config();
const { Pool } = require('pg');

const pool = new Pool({
  host: 'localhost',
  port: 5432,
  user: 'postgres',
  password: 'harini',
  database: 'crochet_app',
  ssl: false
});

pool.query('ALTER TABLE user_progress ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP')
  .then(() => {
    console.log('✅ updated_at column added successfully!');
    return pool.query('SELECT column_name FROM information_schema.columns WHERE table_name = \'user_progress\' ORDER BY ordinal_position');
  })
  .then(result => {
    console.log('📋 Current columns:', result.rows.map(r => r.column_name));
    pool.end();
  })
  .catch(err => {
    console.error('❌ Error:', err.message);
    pool.end();
  });
