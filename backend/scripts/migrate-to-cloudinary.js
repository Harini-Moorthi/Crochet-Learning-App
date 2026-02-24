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

async function migrateToCloudinary() {
  try {
    console.log('🌐 Migrating images to Cloudinary URLs...\n');
    
    // Define Cloudinary URLs (replace with your actual Cloudinary URLs after uploading)
    const cloudinaryImages = [
      {
        title: 'Basic Crochet for Beginners',
        thumbnail_url: 'https://res.cloudinary.com/dr8dpzvmf/image/upload/v1/courses/basic-crochet.jpg'
      },
      {
        title: 'Amigurumi Toys Workshop',
        thumbnail_url: 'https://res.cloudinary.com/dr8dpzvmf/image/upload/v1/courses/amigurumi-toys.jpg'
      },
      {
        title: 'Home Decor Crochet',
        thumbnail_url: 'https://res.cloudinary.com/dr8dpzvmf/image/upload/v1/courses/home-decor.jpg'
      },
      {
        title: 'Fashion Crochet Accessories',
        thumbnail_url: 'https://res.cloudinary.com/dr8dpzvmf/image/upload/v1/courses/fashion-accessories.jpg'
      }
    ];
    
    // Get all courses
    const { rows: courses } = await pool.query('SELECT id, title, thumbnail_url FROM courses');
    
    console.log(`Found ${courses.length} courses:`);
    courses.forEach(course => {
      console.log(`   - ${course.title} (current: ${course.thumbnail_url})`);
    });
    
    // Update each course with Cloudinary URL
    for (const course of courses) {
      const cloudinaryImage = cloudinaryImages.find(img => img.title === course.title);
      
      if (cloudinaryImage) {
        await pool.query(
          'UPDATE courses SET thumbnail_url = $1 WHERE id = $2',
          [cloudinaryImage.thumbnail_url, course.id]
        );
        console.log(`✅ Updated: ${course.title} -> Cloudinary URL`);
      }
    }
    
    // Verify the updates
    console.log('\n🔍 Verifying Cloudinary migration...');
    const { rows: updatedCourses } = await pool.query('SELECT id, title, thumbnail_url FROM courses');
    
    console.log('\n📚 Courses with Cloudinary images:');
    updatedCourses.forEach(course => {
      console.log(`   🌐 ${course.title}`);
      console.log(`      ${course.thumbnail_url}`);
    });
    
    console.log('\n🎉 Images migrated to Cloudinary successfully!');
    console.log('\n💡 Next steps:');
    console.log('   1. Upload your images to Cloudinary');
    console.log('   2. Update the URLs in this script');
    console.log('   3. Run this script again');
    console.log('   4. Deploy your app');
    
  } catch (error) {
    console.error('❌ Error migrating to Cloudinary:', error.message);
  } finally {
    await pool.end();
  }
}

// Run if called directly
if (require.main === module) {
  migrateToCloudinary();
}

module.exports = { migrateToCloudinary };
