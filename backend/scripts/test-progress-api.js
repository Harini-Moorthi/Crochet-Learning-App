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

async function testProgressAPI() {
  try {
    console.log('🔍 Testing Progress API...\n');
    
    // 1. Check if user_progress table exists
    console.log('1. Checking user_progress table...');
    const { rows: tables } = await pool.query(`
      SELECT table_name FROM information_schema.tables 
      WHERE table_schema = 'public' AND table_name = 'user_progress'
    `);
    
    if (tables.length === 0) {
      console.log('❌ user_progress table does not exist!');
      console.log('🔧 Creating user_progress table...');
      
      await pool.query(`
        CREATE TABLE user_progress (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          user_id UUID REFERENCES users(id) ON DELETE CASCADE,
          lesson_id UUID REFERENCES lessons(id) ON DELETE CASCADE,
          progress_percentage INTEGER DEFAULT 0,
          completed BOOLEAN DEFAULT FALSE,
          completed_at TIMESTAMP,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          UNIQUE(user_id, lesson_id)
        )
      `);
      
      console.log('✅ user_progress table created!');
    } else {
      console.log('✅ user_progress table exists');
    }
    
    // 2. Get sample data
    console.log('\n2. Getting sample data...');
    
    const { rows: users } = await pool.query('SELECT id, email FROM users LIMIT 1');
    const { rows: lessons } = await pool.query('SELECT id, title FROM lessons LIMIT 1');
    
    if (users.length === 0) {
      console.log('❌ No users found! Please create a user first.');
      return;
    }
    
    if (lessons.length === 0) {
      console.log('❌ No lessons found! Please add lessons first.');
      return;
    }
    
    const user = users[0];
    const lesson = lessons[0];
    
    console.log(`👤 User: ${user.email} (${user.id})`);
    console.log(`🎬 Lesson: ${lesson.title} (${lesson.id})`);
    
    // 3. Test progress insertion
    console.log('\n3. Testing progress insertion...');
    
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
    
    console.log('✅ Progress inserted/updated:');
    console.log(`   User ID: ${progress[0].user_id}`);
    console.log(`   Lesson ID: ${progress[0].lesson_id}`);
    console.log(`   Completed: ${progress[0].completed}`);
    console.log(`   Progress: ${progress[0].progress_percentage}%`);
    
    // 4. Verify the data
    console.log('\n4. Verifying stored data...');
    const { rows: verify } = await pool.query(`
      SELECT up.*, u.email, l.title as lesson_title
      FROM user_progress up
      JOIN users u ON up.user_id = u.id
      JOIN lessons l ON up.lesson_id = l.id
      WHERE up.user_id = $1 AND up.lesson_id = $2
    `, [user.id, lesson.id]);
    
    if (verify.length > 0) {
      console.log('✅ Data verified:');
      console.log(`   ${verify[0].email} - ${verify[0].lesson_title} - ${verify[0].completed ? 'COMPLETED' : 'NOT COMPLETED'}`);
    } else {
      console.log('❌ Data not found after insertion!');
    }
    
    console.log('\n🎉 Progress API test completed successfully!');
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
    console.error('Stack:', error.stack);
  } finally {
    await pool.end();
  }
}

// Run if called directly
if (require.main === module) {
  testProgressAPI();
}

module.exports = { testProgressAPI };
