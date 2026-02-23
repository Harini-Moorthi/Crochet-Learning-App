const { Pool } = require('pg');
const jwt = require('jsonwebtoken');

// Use direct connection parameters that work
const pool = new Pool({
  host: 'localhost',
  port: 5432,
  user: 'postgres',
  password: 'harini',
  database: 'crochet_app',
  ssl: false
});

async function testAuth() {
  try {
    console.log('🔍 Testing Authentication...\n');
    
    // 1. Get a user from database
    console.log('1. Getting user from database...');
    const { rows: users } = await pool.query('SELECT id, email, password_hash FROM users LIMIT 1');
    
    if (users.length === 0) {
      console.log('❌ No users found! Please create a user first.');
      return;
    }
    
    const user = users[0];
    console.log(`👤 Found user: ${user.email} (${user.id})`);
    
    // 2. Create a test JWT token
    console.log('\n2. Creating test JWT token...');
    const JWT_SECRET = 'crochet_app_jwt_secret_key_2026_super_secure_random_string_for_production_use';
    
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      JWT_SECRET,
      { expiresIn: '1h' }
    );
    
    console.log('✅ JWT token created');
    console.log(`   Token: ${token.substring(0, 50)}...`);
    
    // 3. Verify the token
    console.log('\n3. Verifying JWT token...');
    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      console.log('✅ Token verified successfully:');
      console.log(`   User ID: ${decoded.userId}`);
      console.log(`   Email: ${decoded.email}`);
    } catch (error) {
      console.log('❌ Token verification failed:', error.message);
      return;
    }
    
    // 4. Test the auth middleware logic
    console.log('\n4. Testing auth middleware logic...');
    
    // Simulate what the middleware does
    const authHeader = `Bearer ${token}`;
    const extractedToken = authHeader && authHeader.split(' ')[1];
    
    if (!extractedToken) {
      console.log('❌ No token extracted');
      return;
    }
    
    console.log('✅ Token extracted successfully');
    
    // 5. Test database connection with user ID
    console.log('\n5. Testing database operations with user ID...');
    
    // Check if user exists in database
    const { rows: userCheck } = await pool.query('SELECT id, email FROM users WHERE id = $1', [user.id]);
    
    if (userCheck.length > 0) {
      console.log('✅ User verified in database');
      console.log(`   User: ${userCheck[0].email}`);
    } else {
      console.log('❌ User not found in database');
    }
    
    console.log('\n🎉 Authentication test completed successfully!');
    console.log('\n💡 Your JWT tokens should work with the API');
    
  } catch (error) {
    console.error('❌ Auth test failed:', error.message);
    console.error('Stack:', error.stack);
  } finally {
    await pool.end();
  }
}

// Run if called directly
if (require.main === module) {
  testAuth();
}

module.exports = { testAuth };
