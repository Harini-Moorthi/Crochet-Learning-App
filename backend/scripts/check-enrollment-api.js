const { Pool } = require('pg');

const pool = new Pool({
  host: 'localhost',
  port: 5432,
  user: 'postgres',
  password: 'harini',
  database: 'crochet_app',
  ssl: false
});

async function checkEnrollmentAPI() {
  try {
    // Simulate the exact query from enrollment controller
    const { rows } = await pool.query(`
      SELECT e.*, c.title, c.thumbnail_url, c.level, cat.name as category_name
      FROM enrollments e
      JOIN courses c ON e.course_id = c.id
      LEFT JOIN categories cat ON c.category_id = cat.id
      ORDER BY e.enrolled_at DESC
    `);

    console.log('Enrollment API Response:');
    console.log(JSON.stringify(rows, null, 2));
    
    // Check specifically for thumbnail_url
    console.log('\n🔍 Checking thumbnail_url values:');
    rows.forEach((row, index) => {
      console.log(`${index + 1}. ${row.title}: ${row.thumbnail_url || 'MISSING'}`);
    });
    
  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await pool.end();
  }
}

checkEnrollmentAPI();
