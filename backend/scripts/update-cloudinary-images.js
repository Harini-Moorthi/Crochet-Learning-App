const { Pool } = require('pg');

const pool = new Pool({
  host: 'localhost',
  port: 5432,
  user: 'postgres',
  password: 'harini',
  database: 'crochet_app',
  ssl: false
});

async function updateCloudinaryImages() {
  try {
    console.log('🔄 Updating courses with Cloudinary images...\n');
    
    // Course mappings with Cloudinary URLs
    const courseUpdates = [
      {
        title: 'Basic Crochet for Beginners',
        thumbnail_url: 'https://res.cloudinary.com/dr8dpzvmf/image/upload/v1771947382/basic-crochet.jpg'
      },
      {
        title: 'Home Decor Crochet',
        thumbnail_url: 'https://res.cloudinary.com/dr8dpzvmf/image/upload/v1771947386/home-decor.jpg'
      },
      {
        title: 'Amigurumi Toys Workshop',
        thumbnail_url: 'https://res.cloudinary.com/dr8dpzvmf/image/upload/v1771947382/amigurumi-toys.jpg'
      },
      {
        title: 'Fashion Crochet Accessories',
        thumbnail_url: 'https://res.cloudinary.com/dr8dpzvmf/image/upload/v1771947383/fashion-accessories.jpg'
      }
    ];
    
    // Update each course
    for (const course of courseUpdates) {
      await pool.query(
        'UPDATE courses SET thumbnail_url = $1 WHERE title = $2',
        [course.thumbnail_url, course.title]
      );
      console.log(`✅ Updated: ${course.title}`);
    }
    
    // Verify updates
    console.log('\n🔍 Verifying updates...');
    const { rows: updatedCourses } = await pool.query('SELECT id, title, thumbnail_url FROM courses ORDER BY title');
    
    console.log('\n📚 Courses with Cloudinary images:');
    updatedCourses.forEach(course => {
      console.log(`   🖼️  ${course.title}`);
      console.log(`      ${course.thumbnail_url}`);
    });
    
    console.log('\n🎉 All courses updated with Cloudinary images!');
    console.log('💡 Refresh your frontend to see the new images.');
    
  } catch (error) {
    console.error('❌ Error updating images:', error.message);
  } finally {
    await pool.end();
  }
}

updateCloudinaryImages();
