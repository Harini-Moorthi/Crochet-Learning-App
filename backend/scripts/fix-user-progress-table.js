const { Pool } = require('pg');

// Use direct connection parameters that work
const pool = new Pool({
  host: 'localhost',
  port: 5432,
  user: 'postgres',
  password: 'harini',
  database: 'crochet_app',
  ssl: false
});

async function fixUserProgressTable() {
  try {
    console.log('🔧 Fixing user_progress table...\n');
    
    // 1. Check current table structure
    console.log('1. Checking current table structure...');
    const { rows: columns } = await pool.query(`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'user_progress' 
      AND table_schema = 'public'
      ORDER BY ordinal_position
    `);
    
    console.log('Current columns:');
    columns.forEach(col => {
      console.log(`   - ${col.column_name} (${col.data_type})`);
    });
    
    // 2. Check if updated_at column exists
    const hasUpdatedAt = columns.some(col => col.column_name === 'updated_at');
    
    if (!hasUpdatedAt) {
      console.log('\n2. Adding missing updated_at column...');
      
      await pool.query(`
        ALTER TABLE user_progress 
        ADD COLUMN updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      `);
      
      console.log('✅ updated_at column added successfully!');
    } else {
      console.log('\n✅ updated_at column already exists');
    }
    
    // 3. Verify the fix
    console.log('\n3. Verifying table structure...');
    const { rows: updatedColumns } = await pool.query(`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'user_progress' 
      AND table_schema = 'public'
      ORDER BY ordinal_position
    `);
    
    console.log('Updated columns:');
    updatedColumns.forEach(col => {
      console.log(`   - ${col.column_name} (${col.data_type})`);
    });
    
    // 4. Test a simple progress update
    console.log('\n4. Testing progress update...');
    
    // Get sample data
    const { rows: users } = await pool.query('SELECT id, email FROM users LIMIT 1');
    const { rows: lessons } = await pool.query('SELECT id, title FROM lessons LIMIT 1');
    
    if (users.length > 0 && lessons.length > 0) {
      const user = users[0];
      const lesson = lessons[0];
      
      console.log(`Testing with: ${user.email} - ${lesson.title}`);
      
      const { rows: progress } = await pool.query(`
        INSERT INTO user_progress (user_id, lesson_id, progress_percentage, completed, completed_at)
        VALUES ($1, $2, 100, true, CURRENT_TIMESTAMP)
        ON CONFLICT (user_id, lesson_id) 
        DO UPDATE SET 
          progress_percentage = 100,
          completed = true,
          completed_at = CURRENT_TIMESTAMP,
          updated_at = CURRENT_TIMESTAMP
        RETURNING *
      `, [user.id, lesson.id]);
      
      console.log('✅ Progress update test successful!');
      console.log(`   Completed: ${progress[0].completed}`);
      console.log(`   Updated at: ${progress[0].updated_at}`);
    } else {
      console.log('⚠️  No users or lessons found for testing');
    }
    
    console.log('\n🎉 user_progress table fixed successfully!');
    
  } catch (error) {
    console.error('❌ Fix failed:', error.message);
  } finally {
    await pool.end();
  }
}

// Run if called directly
if (require.main === module) {
  fixUserProgressTable();
}

module.exports = { fixUserProgressTable };
