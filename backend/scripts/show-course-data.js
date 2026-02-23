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

async function showCourseData() {
  try {
    console.log('🔍 Checking course data structure...\n');
    
    // Show courses
    console.log('📚 COURSES:');
    const { rows: courses } = await pool.query(`
      SELECT id, title, level, duration_minutes, category_id 
      FROM courses 
      ORDER BY created_at
    `);
    
    if (courses.length === 0) {
      console.log('   No courses found in database');
    } else {
      courses.forEach(course => {
        console.log(`   📖 ${course.title}`);
        console.log(`      ID: ${course.id}`);
        console.log(`      Level: ${course.level}`);
        console.log(`      Duration: ${course.duration_minutes} minutes`);
        console.log(`      Category: ${course.category_id}`);
        console.log('');
      });
    }
    
    // Show categories
    console.log('📂 CATEGORIES:');
    const { rows: categories } = await pool.query('SELECT id, name FROM categories ORDER BY name');
    
    if (categories.length === 0) {
      console.log('   No categories found');
    } else {
      categories.forEach(cat => {
        console.log(`   🏷️  ${cat.name} (ID: ${cat.id})`);
      });
    }
    
    console.log('\n📋 MODULES:');
    const { rows: modules } = await pool.query(`
      SELECT m.id, m.title, c.title as course_title 
      FROM modules m 
      JOIN courses c ON m.course_id = c.id 
      ORDER BY c.title, m.order_index
    `);
    
    if (modules.length === 0) {
      console.log('   No modules found');
    } else {
      modules.forEach(module => {
        console.log(`   📦 ${module.title} (in ${module.course_title})`);
      });
    }
    
    console.log('\n🎬 LESSONS:');
    const { rows: lessons } = await pool.query(`
      SELECT l.title, m.title as module_title, c.title as course_title 
      FROM lessons l 
      JOIN modules m ON l.module_id = m.id 
      JOIN courses c ON m.course_id = c.id 
      ORDER BY c.title, m.order_index, l.order_index
      LIMIT 10
    `);
    
    if (lessons.length === 0) {
      console.log('   No lessons found');
    } else {
      lessons.forEach(lesson => {
        console.log(`   🎥 ${lesson.title} (in ${lesson.module_title})`);
      });
    }
    
    console.log('\n✅ Data check completed!');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await pool.end();
  }
}

// Run if called directly
if (require.main === module) {
  showCourseData();
}

module.exports = { showCourseData };
