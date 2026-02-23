const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

async function diagnoseDatabase() {
  try {
    console.log('🔍 Diagnosing database...\n');
    
    // Check what tables exist
    console.log('📋 Checking existing tables:');
    const { rows: tables } = await pool.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      ORDER BY table_name
    `);
    
    if (tables.length === 0) {
      console.log('   ❌ No tables found in public schema');
    } else {
      tables.forEach(table => {
        console.log(`   ✅ ${table.table_name}`);
      });
    }
    
    console.log('\n📊 Checking table contents:');
    
    // Check each important table
    const tableChecks = [
      { name: 'users', query: 'SELECT COUNT(*) as count FROM users' },
      { name: 'courses', query: 'SELECT COUNT(*) as count FROM courses' },
      { name: 'categories', query: 'SELECT COUNT(*) as count FROM categories' },
      { name: 'modules', query: 'SELECT COUNT(*) as count FROM modules' },
      { name: 'lessons', query: 'SELECT COUNT(*) as count FROM lessons' },
      { name: 'enrollments', query: 'SELECT COUNT(*) as count FROM enrollments' },
      { name: 'user_progress', query: 'SELECT COUNT(*) as count FROM user_progress' }
    ];
    
    for (const table of tableChecks) {
      try {
        const { rows } = await pool.query(table.query);
        console.log(`   📊 ${table.name}: ${rows[0].count} records`);
      } catch (error) {
        console.log(`   ❌ ${table.name}: Table does not exist or error - ${error.message}`);
      }
    }
    
    // Check database connection and version
    console.log('\n🔧 Database info:');
    const { rows: version } = await pool.query('SELECT version()');
    console.log(`   📦 PostgreSQL: ${version[0].version.split(',')[0]}`);
    
    const { rows: db } = await pool.query('SELECT current_database()');
    console.log(`   🗄️  Database: ${db[0].current_database}`);
    
    // Test a simple query
    console.log('\n✅ Testing basic operations:');
    await pool.query('SELECT NOW()');
    console.log('   🕐 Timestamp query: SUCCESS');
    
    console.log('\n🎯 Diagnosis complete!');
    
  } catch (error) {
    console.error('❌ Database diagnosis failed:', error.message);
  } finally {
    await pool.end();
  }
}

// Run if called directly
if (require.main === module) {
  diagnoseDatabase();
}

module.exports = { diagnoseDatabase };
