const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

async function initDatabase() {
  try {
    console.log('Connecting to database...');
    await pool.query('SELECT NOW()');
    console.log('✅ Database connection successful!');
    
    // Test basic tables exist
    const tables = await pool.query(`
      SELECT table_name FROM information_schema.tables 
      WHERE table_schema = 'public'
    `);
    
    console.log('📋 Available tables:', tables.rows.map(t => t.table_name));
    
    return true;
  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
    return false;
  }
}

// Auto-run if called directly
if (require.main === module) {
  initDatabase().then(success => {
    process.exit(success ? 0 : 1);
  });
}

module.exports = { initDatabase };
