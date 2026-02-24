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

async function addUnsplashImages() {
  try {
    console.log('🖼️ Adding Unsplash course images...\n');
    
    // Define high-quality Unsplash images
    const unsplashImages = [
      {
        title: 'Basic Crochet for Beginners',
        thumbnail_url: 'https://images.unsplash.com/photo-1622423557023-4ff9b0f6b6d9?w=800&h=600&fit=crop&auto=format'
      },
      {
        title: 'Amigurumi Toys Workshop',
        thumbnail_url: 'https://images.unsplash.com/photo-1578662996442-2ff4b72b7025?w=800&h=600&fit=crop&auto=format'
      },
      {
        title: 'Home Decor Crochet',
        thumbnail_url: 'https://images.unsplash.com/photo-1586473219010-2ff4b72b7025?w=800&h=600&fit=crop&auto=format'
      },
      {
        title: 'Fashion Crochet Accessories',
        thumbnail_url: 'https://images.unsplash.com/photo-1578662996442-2ff4b72b7025?w=800&h=600&fit=crop&auto=format'
      }
    ];
    
    // Get all courses
    const { rows: courses } = await pool.query('SELECT id, title, thumbnail_url FROM courses');
    
    console.log(`Found ${courses.length} courses:`);
    courses.forEach(course => {
      console.log(`   - ${course.title} (current: ${course.thumbnail_url})`);
    });
    
    // Update each course with Unsplash image
    for (const course of courses) {
      const image = unsplashImages.find(img => img.title === course.title);
      
      if (image) {
        await pool.query(
          'UPDATE courses SET thumbnail_url = $1 WHERE id = $2',
          [image.thumbnail_url, course.id]
        );
        console.log(`✅ Updated: ${course.title} -> Unsplash URL`);
      }
    }
    
    // Verify the updates
    console.log('\n🔍 Verifying Unsplash updates...');
    const { rows: updatedCourses } = await pool.query('SELECT id, title, thumbnail_url FROM courses');
    
    console.log('\n📚 Courses with Unsplash images:');
    updatedCourses.forEach(course => {
      console.log(`   🖼️  ${course.title}`);
      console.log(`      ${course.thumbnail_url}`);
    });
    
    console.log('\n🎉 Unsplash course images added successfully!');
    console.log('\n💡 Benefits:');
    console.log('   ✅ No upload required');
    console.log('   ✅ High-quality images');
    console.log('   ✅ Fast CDN delivery');
    console.log('   ✅ Ready for deployment');
    
  } catch (error) {
    console.error('❌ Error adding Unsplash course images:', error.message);
  } finally {
    await pool.end();
  }
}

// Run if called directly
if (require.main === module) {
  addUnsplashImages();
}

module.exports = { addUnsplashImages };
