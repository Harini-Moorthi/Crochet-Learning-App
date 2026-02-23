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

async function addSampleCourses() {
  try {
    console.log('🔍 Checking existing courses...');
    
    const { rows: existingCourses } = await pool.query('SELECT COUNT(*) as count FROM courses');
    
    if (parseInt(existingCourses[0].count) > 0) {
      console.log(`✅ Found ${existingCourses[0].count} courses already. Skipping sample course creation.`);
      return true;
    }
    
    console.log('📚 Adding sample courses...');
    
    // Add categories first
    const { rows: categories } = await pool.query(`
      INSERT INTO categories (name, description) VALUES
        ('Basic Techniques', 'Fundamental crochet stitches and techniques'),
        ('Projects', 'Complete crochet projects from start to finish'),
        ('Advanced Skills', 'Complex patterns and professional techniques')
      RETURNING *
    `);
    
    console.log(`✅ Created ${categories.length} categories`);
    
    // Add courses
    const sampleCourses = [
      {
        title: 'Basic Crochet for Beginners',
        description: 'Learn the fundamentals of crochet from holding the hook to your first project. Perfect for absolute beginners who want to master the basics.',
        level: 'beginner',
        duration_minutes: 180,
        category_id: categories[0].id,
        thumbnail_url: 'https://images.unsplash.com/photo-1622423557023-4ff9b0f6b6d9?w=400&h=300&fit=crop'
      },
      {
        title: 'Crochet a Cozy Blanket',
        description: 'Create a beautiful, cozy blanket using basic crochet stitches. This project-based course will teach you pattern reading and finishing techniques.',
        level: 'intermediate',
        duration_minutes: 240,
        category_id: categories[1].id,
        thumbnail_url: 'https://images.unsplash.com/photo-1586473219010-2ff4b72b7025?w=400&h=300&fit=crop'
      },
      {
        title: 'Advanced Lace Patterns',
        description: 'Master intricate lace crochet patterns and techniques. Learn to read complex charts and create delicate, professional-looking pieces.',
        level: 'advanced',
        duration_minutes: 300,
        category_id: categories[2].id,
        thumbnail_url: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop'
      }
    ];
    
    for (const course of sampleCourses) {
      const { rows } = await pool.query(`
        INSERT INTO courses (title, description, level, duration_minutes, category_id, thumbnail_url) 
        VALUES ($1, $2, $3, $4, $5, $6)
        RETURNING id, title
      `, [course.title, course.description, course.level, course.duration_minutes, course.category_id, course.thumbnail_url]);
      
      console.log(`✅ Created course: ${rows[0].title}`);
    }
    
    console.log('\n🎉 Sample courses added successfully!');
    console.log('💡 Run "npm run show-courses" to see all course data');
    
    return true;
    
  } catch (error) {
    console.error('❌ Error adding sample courses:', error.message);
    return false;
  } finally {
    await pool.end();
  }
}

// Run if called directly
if (require.main === module) {
  addSampleCourses().then(success => {
    process.exit(success ? 0 : 1);
  });
}

module.exports = { addSampleCourses };
