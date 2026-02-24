const { Pool } = require('pg');

const pool = new Pool({
  host: 'localhost',
  port: 5432,
  user: 'postgres',
  password: 'harini',
  database: 'crochet_app',
  ssl: false
});

async function checkImages() {
  try {
    const { rows } = await pool.query('SELECT id, title, thumbnail_url FROM courses');
    console.log('Courses with images:');
    rows.forEach(r => {
      console.log(`- ${r.title}: ${r.thumbnail_url || 'NO IMAGE'}`);
    });
  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await pool.end();
  }
}

checkImages();
