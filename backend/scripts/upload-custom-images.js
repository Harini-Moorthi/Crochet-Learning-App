const fs = require('fs');
const path = require('path');
const { Pool } = require('pg');

const pool = new Pool({
  host: 'localhost',
  port: 5432,
  user: 'postgres',
  password: 'harini',
  database: 'crochet_app',
  ssl: false
});

async function uploadCustomImages() {
  try {
    console.log('📤 Uploading custom images to Cloudinary...\n');
    
    // Get your auth token first (you need to be logged in)
    console.log('💡 To upload your own images:');
    console.log('1. Get a JWT token by logging in to your app');
    console.log('2. Use this curl command to upload images:');
    console.log('\ncurl -X POST http://localhost:5000/api/cloudinary/upload \\');
    console.log('  -H "Content-Type: application/json" \\');
    console.log('  -H "Authorization: Bearer YOUR_JWT_TOKEN" \\');
    console.log('  -d \'{"file":"data:image/jpeg;base64,/9j/4AAQSkZJRgABAQ..."}\'');
    console.log('\n3. Copy the returned imageUrl and update your courses');
    
    // Show current courses
    const { rows: courses } = await pool.query('SELECT id, title, thumbnail_url FROM courses');
    
    console.log('\n📚 Current courses:');
    courses.forEach(course => {
      console.log(`- ${course.title}: ${course.thumbnail_url}`);
    });
    
    console.log('\n💡 Or manually update with SQL:');
    courses.forEach(course => {
      console.log(`UPDATE courses SET thumbnail_url = 'YOUR_CLOUDINARY_URL' WHERE id = '${course.id}';`);
    });
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await pool.end();
  }
}

uploadCustomImages();
