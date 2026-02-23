const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

async function clearEnrollments() {
  try {
    console.log('Connecting to database...');
    await pool.query('SELECT NOW()');
    console.log('✅ Database connected successfully!');
    
    // Check current enrollments
    const { rows: enrollments } = await pool.query('SELECT * FROM enrollments');
    console.log('📋 Current enrollments:', enrollments.length);
    
    if (enrollments.length > 0) {
      console.log('🗑️  Clearing existing enrollments...');
      await pool.query('DELETE FROM enrollments');
      console.log('✅ All enrollments cleared!');
    }
    
    // Check users
    const { rows: users } = await pool.query('SELECT id, email FROM users LIMIT 5');
    console.log('👥 Sample users:', users);
    
    // Check courses
    const { rows: courses } = await pool.query('SELECT id, title FROM courses LIMIT 5');
    console.log('📚 Sample courses:', courses);
    
    return true;
  } catch (error) {
    console.error('❌ Database error:', error.message);
    return false;
  } finally {
    await pool.end();
  }
}

// Auto-run if called directly
if (require.main === module) {
  clearEnrollments().then(success => {
    process.exit(success ? 0 : 1);
  });
}

module.exports = { clearEnrollments };
