// Test script to verify folder creation logic
const { createFolderStructure } = require('./backend/utils/fileUtils');
const path = require('path');

async function testFolderCreation() {
  console.log('🧪 Testing folder creation logic...\n');

  // Test 1: Artist folder creation
  console.log('Test 1: Artist folder creation');
  const artistSettings = {
    setting_name: 'Test Artist',
    path: '../frontend/public/artists/',
    folder_name: '3_test_artist_9999'
  };

  try {
    const artistPath = await createFolderStructure(artistSettings);
    console.log('✅ Artist test passed. Path:', artistPath);
  } catch (error) {
    console.error('❌ Artist test failed:', error.message);
  }

  console.log('\n' + '='.repeat(50) + '\n');

  // Test 2: Organiser folder creation
  console.log('Test 2: Organiser folder creation');
  const organiserSettings = {
    setting_name: 'Test Organiser',
    path: '../frontend/public/organiser/',
    folder_name: '4_test_organiser_8888'
  };

  try {
    const organiserPath = await createFolderStructure(organiserSettings);
    console.log('✅ Organiser test passed. Path:', organiserPath);
  } catch (error) {
    console.error('❌ Organiser test failed:', error.message);
  }

  console.log('\n' + '='.repeat(50) + '\n');

  // Test 3: Check if folders actually exist
  console.log('Test 3: Verifying folder existence');
  const fs = require('fs');
  
  const artistFolder = path.resolve(__dirname, 'frontend/public/artists/3_test_artist_9999');
  const organiserFolder = path.resolve(__dirname, 'frontend/public/organiser/4_test_organiser_8888');

  console.log('Checking artist folder:', artistFolder);
  console.log('Exists:', fs.existsSync(artistFolder));
  
  if (fs.existsSync(artistFolder)) {
    console.log('Artist subfolders:');
    const artistSubfolders = ['events', 'venues', 'profile', 'gallery'];
    artistSubfolders.forEach(subfolder => {
      const subfolderPath = path.join(artistFolder, subfolder);
      console.log(`  ${subfolder}: ${fs.existsSync(subfolderPath) ? '✅' : '❌'}`);
    });
  }

  console.log('\nChecking organiser folder:', organiserFolder);
  console.log('Exists:', fs.existsSync(organiserFolder));
  
  if (fs.existsSync(organiserFolder)) {
    console.log('Organiser subfolders:');
    const organiserSubfolders = ['events', 'venues', 'profile'];
    organiserSubfolders.forEach(subfolder => {
      const subfolderPath = path.join(organiserFolder, subfolder);
      console.log(`  ${subfolder}: ${fs.existsSync(subfolderPath) ? '✅' : '❌'}`);
    });
  }

  console.log('\n🎉 Folder creation test completed!');
}

// Run the test
testFolderCreation().catch(console.error);
