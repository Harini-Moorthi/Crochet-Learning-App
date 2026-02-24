const { Pool } = require('pg');

const pool = new Pool({
  host: 'localhost',
  port: 5432,
  user: 'postgres',
  password: 'harini',
  database: 'crochet_app',
  ssl: false
});

async function addCourseImages() {
  try {
    console.log('🖼️ Adding course images...');
    
    const courseImages = [
      {
        title: 'Basic Crochet for Beginners',
        thumbnail_url: 'https://images.unsplash.com/photo-1622423557023-4ff9b0f6b6d9?w=800&h=600&fit=crop&auto=format'
      },
      {
        title: 'Crochet a Cozy Blanket',
        thumbnail_url: 'https://images.unsplash.com/photo-1586473219010-2ff4b72b7025?w=800&h=600&fit=crop&auto=format'
      },
      {
        title: 'Advanced Lace Patterns',
        thumbnail_url: 'https://images.unsplash.com/photo-1578662996442-2ff4b72b7025?w=800&h=600&fit=crop&auto=format'
      },
      {
        title: 'Amigurumi Toys Workshop',
        thumbnail_url: 'https://images.unsplash.com/photo-1622423557023-4ff9b0f6b6d9?w=800&h=600&fit=crop&auto=format'
      },
      {
        title: 'Fashion Crochet Accessories',
        thumbnail_url: 'https://images.unsplash.com/photo-1578662996442-2ff4b72b7025?w=800&h=600&fit=crop&auto=format'
      },
      {
        title: 'Home Decor Crochet',
        thumbnail_url: 'https://images.unsplash.com/photo-1586473219010-2ff4b72b7025?w=800&h=600&fit=crop&auto=format'
      }
    ];
    
    // Get all courses
    const { rows: courses } = await pool.query('SELECT id, title, thumbnail_url FROM courses');
    
    console.log(`Found ${courses.length} courses:`);
    courses.forEach(course => {
      console.log(`   - ${course.title} (current: ${course.thumbnail_url || 'none'})`);
    });
    
    // Update each course with an image
    for (const course of courses) {
      const image = courseImages.find(img => img.title === course.title);
      
      if (image) {
        await pool.query(
          'UPDATE courses SET thumbnail_url = $1 WHERE id = $2',
          [image.thumbnail_url, course.id]
        );
        console.log(`✅ Updated: ${course.title}`);
      } else {
        // Use a default image for courses not in our list
        const defaultImage = 'https://images.unsplash.com/photo-1622423557023-4ff9b0f6b6d9?w=800&h=600&fit=crop&auto=format';
        await pool.query(
          'UPDATE courses SET thumbnail_url = $1 WHERE id = $2',
          [defaultImage, course.id]
        );
        console.log(`✅ Updated: ${course.title} (default image)`);
      }
    }
    
    // Verify the updates
    console.log('\n🔍 Verifying updates...');
    const { rows: updatedCourses } = await pool.query('SELECT id, title, thumbnail_url FROM courses');
    
    console.log('\n📚 Updated courses with images:');
    updatedCourses.forEach(course => {
      console.log(`   🖼️  ${course.title}`);
      console.log(`      ${course.thumbnail_url}`);
    });
    
    console.log('\n🎉 Course images added successfully!');
    
  } catch (error) {
    console.error('❌ Error adding course images:', error.message);
  } finally {
    await pool.end();
  }
}

// Run if called directly
if (require.main === module) {
  addCourseImages();
}

module.exports = { addCourseImages };
