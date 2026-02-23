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

async function addSampleLessons() {
  try {
    console.log('Connecting to database...');
    await pool.query('SELECT NOW()');
    console.log('✅ Database connected successfully!');
    
    // Get first course
    const { rows: courses } = await pool.query('SELECT id, title FROM courses LIMIT 1');
    
    if (courses.length === 0) {
      console.log('❌ No courses found. Please create a course first.');
      return false;
    }
    
    const course = courses[0];
    console.log(`📚 Adding lessons to course: ${course.title}`);
    
    // Create modules
    const { rows: modules } = await pool.query(`
      INSERT INTO modules (course_id, title, description, order_index) VALUES
        ($1, 'Getting Started with Crochet', 'Learn the basics of crochet', 1),
        ($1, 'Basic Stitches', 'Master fundamental crochet stitches', 2),
        ($1, 'Your First Project', 'Create your first crochet item', 3)
      RETURNING *
    `, [course.id]);
    
    console.log(`✅ Created ${modules.length} modules`);
    
    // Add lessons to each module
    for (const module of modules) {
      let lessons = [];
      
      if (module.title === 'Getting Started with Crochet') {
        lessons = [
          ['Introduction to Crochet', 'Learn about crochet history and what you\'ll need', 'https://www.youtube.com/watch?v=example1'],
          ['Crochet Tools and Materials', 'Essential tools for every crocheter', 'https://www.youtube.com/watch?v=example2'],
          ['Holding the Hook and Yarn', 'Proper technique for holding your tools', 'https://www.youtube.com/watch?v=example3']
        ];
      } else if (module.title === 'Basic Stitches') {
        lessons = [
          ['The Chain Stitch', 'Foundation of all crochet projects', 'https://www.youtube.com/watch?v=example4'],
          ['Single Crochet', 'Most basic crochet stitch', 'https://www.youtube.com/watch?v=example5'],
          ['Double Crochet', 'Taller stitch for faster projects', 'https://www.youtube.com/watch?v=example6']
        ];
      } else {
        lessons = [
          ['Reading Patterns', 'How to understand crochet patterns', 'https://www.youtube.com/watch?v=example7'],
          ['Your First Dishcloth', 'Simple practical project', 'https://www.youtube.com/watch?v=example8'],
          ['Finishing Techniques', 'How to finish your projects professionally', 'https://www.youtube.com/watch?v=example9']
        ];
      }
      
      for (let i = 0; i < lessons.length; i++) {
        const [title, description, videoUrl] = lessons[i];
        await pool.query(`
          INSERT INTO lessons (module_id, title, description, video_url, order_index) 
          VALUES ($1, $2, $3, $4, $5)
        `, [module.id, title, description, videoUrl, i + 1]);
      }
      
      console.log(`✅ Added ${lessons.length} lessons to module: ${module.title}`);
    }
    
    console.log('🎉 Sample lessons added successfully!');
    return true;
    
  } catch (error) {
    console.error('❌ Error adding sample lessons:', error.message);
    return false;
  } finally {
    await pool.end();
  }
}

// Auto-run if called directly
if (require.main === module) {
  addSampleLessons().then(success => {
    process.exit(success ? 0 : 1);
  });
}

module.exports = { addSampleLessons };
