console.log('🔍 Testing direct database connection...\n');

require('dotenv').config();

const { Pool } = require('pg');

async function testDirectConnection() {
  console.log('📋 Connection Details:');
  console.log(`   URL: ${process.env.DATABASE_URL}`);
  
  // Parse the URL to show components
  try {
    const url = new URL(process.env.DATABASE_URL);
    console.log(`   Host: ${url.hostname}`);
    console.log(`   Port: ${url.port}`);
    console.log(`   User: ${url.username}`);
    console.log(`   Password: ${url.password ? '***' + url.password.slice(-4) : 'MISSING'}`);
    console.log(`   Database: ${url.pathname.slice(1)}`);
  } catch (error) {
    console.log(`   ❌ URL parsing error: ${error.message}`);
    return;
  }

  console.log('\n🔌 Testing connection...');
  
  // Test with different connection options
  const connectionOptions = {
    host: 'localhost',
    port: 5432,
    user: 'postgres',
    password: 'harini',
    database: 'crochet_app',
    // Add connection timeout
    connectionTimeoutMillis: 5000,
    // Add SSL options for Windows
    ssl: false
  };

  console.log('📋 Using direct connection parameters:');
  console.log(`   Host: ${connectionOptions.host}`);
  console.log(`   Port: ${connectionOptions.port}`);
  console.log(`   User: ${connectionOptions.user}`);
  console.log(`   Password: ${connectionOptions.password ? 'SET' : 'MISSING'}`);
  console.log(`   Database: ${connectionOptions.database}`);

  const pool = new Pool(connectionOptions);

  try {
    console.log('\n🔌 Attempting connection...');
    const result = await pool.query('SELECT version()');
    console.log('✅ Connection successful!');
    console.log(`📦 PostgreSQL: ${result.rows[0].version.split(',')[0]}`);
    
    // Now test tables
    console.log('\n📋 Checking tables...');
    const tables = await pool.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      ORDER BY table_name
    `);
    
    if (tables.rows.length === 0) {
      console.log('   ❌ No tables found');
    } else {
      console.log('   ✅ Tables found:');
      tables.rows.forEach(table => {
        console.log(`      - ${table.table_name}`);
      });
    }
    
  } catch (error) {
    console.error('❌ Connection failed:', error.message);
    
    if (error.message.includes('password')) {
      console.log('\n💡 Password-related suggestions:');
      console.log('   1. Check if PostgreSQL password is actually "harini"');
      console.log('   2. Try connecting with psql first:');
      console.log('      psql -h localhost -p 5432 -U postgres -d crochet_app');
      console.log('   3. Check PostgreSQL service status');
    }
    
    if (error.message.includes('ECONNREFUSED')) {
      console.log('\n💡 Connection refused suggestions:');
      console.log('   1. Check if PostgreSQL is running');
      console.log('   2. Check if port 5432 is correct');
      console.log('   3. Check firewall settings');
    }
  } finally {
    await pool.end();
  }
}

testDirectConnection();
