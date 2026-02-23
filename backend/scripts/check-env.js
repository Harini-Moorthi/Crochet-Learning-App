console.log('🔍 Checking environment variables...\n');

// Load environment variables
require('dotenv').config();

console.log('📋 Environment Variables:');
console.log(`   DATABASE_URL: ${process.env.DATABASE_URL ? 'SET' : 'NOT SET'}`);
console.log(`   PORT: ${process.env.PORT || '5000 (default)'}`);
console.log(`   NODE_ENV: ${process.env.NODE_ENV || 'development (default)'}`);

if (process.env.DATABASE_URL) {
  console.log(`\n🔗 Database URL format check:`);
  const dbUrl = process.env.DATABASE_URL;
  
  // Check if password is properly formatted
  if (dbUrl.includes('postgresql://')) {
    console.log('   ✅ Protocol: postgresql://');
    
    // Parse the URL to check components
    try {
      const url = new URL(dbUrl);
      console.log(`   📍 Host: ${url.hostname}`);
      console.log(`   🔌 Port: ${url.port || '5432 (default)'}`);
      console.log(`   👤 User: ${url.username}`);
      console.log(`   🗄️  Database: ${url.pathname.slice(1)}`);
      console.log(`   🔐 Password: ${url.password ? 'PRESENT' : 'MISSING'}`);
      
      if (!url.password) {
        console.log('\n   ❌ ISSUE: Password is missing from DATABASE_URL');
        console.log('   💡 Expected format: postgresql://user:password@host:port/database');
      } else {
        console.log('\n   ✅ Database URL appears correctly formatted');
      }
    } catch (error) {
      console.log(`   ❌ Invalid URL format: ${error.message}`);
    }
  } else {
    console.log('   ❌ Invalid protocol - should start with postgresql://');
  }
} else {
  console.log('\n❌ DATABASE_URL is not set!');
  console.log('💡 Create a .env file with:');
  console.log('   DATABASE_URL=postgresql://postgres:yourpassword@localhost:5432/crochet_app');
}

console.log('\n🎯 Environment check complete!');
