const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

async function checkData() {
  try {
    console.log('Connecting to database...');
    await pool.query('SELECT NOW()');
    console.log('✅ Database connected successfully!');
    
    // Check courses
    const { rows: courses } = await pool.query('SELECT id, title FROM courses');
    console.log(`📚 Found ${courses.length} courses:`, courses);
    
    // Check modules
    const { rows: modules } = await pool.query('SELECT id, title, course_id FROM modules');
    console.log(`📋 Found ${modules.length} modules:`, modules);
    
    // Check lessons
    const { rows: lessons } = await pool.query('SELECT id, title, module_id FROM lessons');
    console.log(`🎬 Found ${lessons.length} lessons:`, lessons);
    
    return true;
    
  } catch (error) {
    console.error('❌ Error checking data:', error.message);
    return false;
  } finally {
    await pool.end();
  }
}

// Auto-run if called directly
if (require.main === module) {
  checkData().then(success => {
    process.exit(success ? 0 : 1);
  });
}

module.exports = { checkData };
