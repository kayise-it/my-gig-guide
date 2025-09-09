require('dotenv').config();
const db = require('./models');

async function testGuard() {
  try {
    await db.sequelize.authenticate();
    console.log('✅ DB connected');
    
    // Test 1: Check if Pat (userId=35) has artist profile
    const patArtist = await db.artist.findOne({ where: { userId: 35 } });
    console.log('Pat artist profile:', patArtist ? 'EXISTS' : 'NOT FOUND');
    
    // Test 2: Check if any artist exists with settings
    const artistWithSettings = await db.artist.findOne({ 
      where: { 
        settings: { [db.Sequelize.Op.ne]: null } 
      } 
    });
    console.log('Artist with settings:', artistWithSettings ? 'EXISTS' : 'NOT FOUND');
    if (artistWithSettings) {
      console.log('Artist userId:', artistWithSettings.userId);
      console.log('Has settings:', !!artistWithSettings.settings);
    }
    
    // Test 3: Test the guard logic directly
    const testUserId = artistWithSettings ? artistWithSettings.userId : 35;
    const testArtist = await db.artist.findOne({ where: { userId: testUserId } });
    
    if (!testArtist || !testArtist.settings || testArtist.settings.trim() === '') {
      console.log('🚫 GUARD WOULD TRIGGER: Artist settings missing for userId', testUserId);
    } else {
      console.log('✅ GUARD WOULD PASS: Artist has valid settings for userId', testUserId);
    }
    
  } catch (error) {
    console.error('❌ Test error:', error.message);
  } finally {
    await db.sequelize.close();
  }
}

testGuard();


