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

async function addLocalImages() {
  try {
    console.log('🖼️ Adding local course images...\n');
    
    // Define course images with local paths
    const courseImages = [
      {
        title: 'Basic Crochet for Beginners',
        thumbnail_url: '/images/courses/basic-crochet.jpg'
      },
      {
        title: 'Crochet a Cozy Blanket',
        thumbnail_url: '/images/courses/cozy-blanket.jpg'
      },
      {
        title: 'Advanced Lace Patterns',
        thumbnail_url: '/images/courses/advanced-lace.jpg'
      },
      {
        title: 'Amigurumi Toys Workshop',
        thumbnail_url: '/images/courses/amigurumi-toys.jpg'
      },
      {
        title: 'Fashion Crochet Accessories',
        thumbnail_url: '/images/courses/fashion-accessories.jpg'
      },
      {
        title: 'Home Decor Crochet',
        thumbnail_url: '/images/courses/home-decor.jpg'
      }
    ];
    
    // Get all courses
    const { rows: courses } = await pool.query('SELECT id, title, thumbnail_url FROM courses');
    
    console.log(`Found ${courses.length} courses:`);
    courses.forEach(course => {
      console.log(`   - ${course.title} (current: ${course.thumbnail_url || 'none'})`);
    });
    
    // Update each course with a local image
    for (const course of courses) {
      const image = courseImages.find(img => img.title === course.title);
      
      if (image) {
        await pool.query(
          'UPDATE courses SET thumbnail_url = $1 WHERE id = $2',
          [image.thumbnail_url, course.id]
        );
        console.log(`✅ Updated: ${course.title} -> ${image.thumbnail_url}`);
      } else {
        // Use a default placeholder image
        const defaultImage = '/images/placeholder.jpg';
        await pool.query(
          'UPDATE courses SET thumbnail_url = $1 WHERE id = $2',
          [defaultImage, course.id]
        );
        console.log(`✅ Updated: ${course.title} -> ${defaultImage}`);
      }
    }
    
    // Verify the updates
    console.log('\n🔍 Verifying updates...');
    const { rows: updatedCourses } = await pool.query('SELECT id, title, thumbnail_url FROM courses');
    
    console.log('\n📚 Updated courses with local images:');
    updatedCourses.forEach(course => {
      console.log(`   🖼️  ${course.title}`);
      console.log(`      ${course.thumbnail_url}`);
    });
    
    console.log('\n🎉 Local course images added successfully!');
    console.log('\n💡 Make sure to create the image files in frontend/public/images/courses/');
    
  } catch (error) {
    console.error('❌ Error adding local course images:', error.message);
  } finally {
    await pool.end();
  }
}

// Run if called directly
if (require.main === module) {
  addLocalImages();
}

module.exports = { addLocalImages };
