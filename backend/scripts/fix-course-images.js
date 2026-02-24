const { Pool } = require('pg');

const pool = new Pool({
  host: 'localhost',
  port: 5432,
  user: 'postgres',
  password: 'harini',
  database: 'crochet_app',
  ssl: false
});

async function fixCourseImages() {
  try {
    console.log('🖼️ Fixing course images with working Unsplash URLs...\n');
    
    // Working Unsplash URLs for crochet/craft images
    const courseImages = [
      {
        title: 'Basic Crochet for Beginners',
        thumbnail_url: 'https://images.unsplash.com/photo-1602677326401-4e5b5b5b5b5b?w=800&h=600&fit=crop&auto=format'
      },
      {
        title: 'Home Decor Crochet',
        thumbnail_url: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&h=600&fit=crop&auto=format'
      },
      {
        title: 'Fashion Crochet Accessories',
        thumbnail_url: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&h=600&fit=crop&auto=format'
      },
      {
        title: 'Amigurumi Toys Workshop',
        thumbnail_url: 'https://images.unsplash.com/photo-1578662996442-2ff4b72b7025?w=800&h=600&fit=crop&auto=format'
      }
    ];
    
    // Get all courses
    const { rows: courses } = await pool.query('SELECT id, title, thumbnail_url FROM courses');
    
    console.log(`Found ${courses.length} courses:`);
    courses.forEach(course => {
      console.log(`   - ${course.title} (current: ${course.thumbnail_url || 'none'})`);
    });
    
    // Update each course with a working image
    for (const course of courses) {
      const image = courseImages.find(img => img.title === course.title);
      
      if (image) {
        await pool.query(
          'UPDATE courses SET thumbnail_url = $1 WHERE id = $2',
          [image.thumbnail_url, course.id]
        );
        console.log(`✅ Updated: ${course.title}`);
      }
    }
    
    // Verify updates
    console.log('\n🔍 Verifying updates...');
    const { rows: updatedCourses } = await pool.query('SELECT id, title, thumbnail_url FROM courses');
    
    console.log('\n📚 Updated courses with working images:');
    updatedCourses.forEach(course => {
      console.log(`   🖼️  ${course.title}`);
      console.log(`      ${course.thumbnail_url}`);
    });
    
    console.log('\n🎉 Course images fixed successfully!');
    
  } catch (error) {
    console.error('❌ Error fixing course images:', error.message);
  } finally {
    await pool.end();
  }
}

fixCourseImages();
