// Test script to verify the fixed createFolderStructure helper
const createFolderStructure = require('./backend/helpers/createFolderStructure');

async function testChrisFix() {
  console.log('🧪 Testing the ACTUAL createFolderStructure helper used by registration...\n');

  // Test with the same settings format used in registration
  const artistSettings = {
    setting_name: 'Test Chris Fix',
    path: 'frontend/public/artists/',
    folder_name: '3_chris_fix_7777'
  };

  try {
    console.log('Testing artist folder creation with settings:', artistSettings);
    const result = await createFolderStructure(artistSettings);
    console.log('✅ Test passed! Result:', result);
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

testChrisFix();
