// Test the guard logic directly without database
const Artist = { findOne: () => null }; // Mock that returns no artist

async function testGuardLogic() {
  const userId = 36;
  const artist = await Artist.findOne({ where: { userId } });
  
  console.log('Artist found:', !!artist);
  console.log('Artist settings:', artist?.settings);
  
  if (!artist || !artist.settings || artist.settings.trim() === '') {
    console.log('🚫 GUARD WOULD TRIGGER: Artist settings missing');
    return { status: 409, error: 'Artist settings missing for user. Initialize profile settings before uploading.' };
  }
  
  console.log('✅ GUARD WOULD PASS: Artist has settings');
  return { status: 200, message: 'Upload would proceed' };
}

testGuardLogic().then(result => {
  console.log('Result:', result);
});


