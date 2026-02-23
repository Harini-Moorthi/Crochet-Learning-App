console.log('Starting simple test...');

try {
  const { Pool } = require('pg');
  console.log('PG imported successfully');
  
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
  });
  console.log('Pool created');
  
  pool.query('SELECT NOW()')
    .then(result => {
      console.log('✅ Database connected:', result.rows[0]);
      return pool.query('SELECT COUNT(*) FROM courses');
    })
    .then(result => {
      console.log('📚 Courses count:', result.rows[0].count);
      return pool.end();
    })
    .then(() => {
      console.log('✅ Test completed');
      process.exit(0);
    })
    .catch(err => {
      console.error('❌ Error:', err.message);
      process.exit(1);
    });
    
} catch (error) {
  console.error('❌ Script error:', error.message);
  process.exit(1);
}
