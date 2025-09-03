// Load environment variables
require('dotenv').config({ path: './backend/.env' });

const db = require('./backend/models');

async function checkPinkSettings() {
  try {
    // Connect to database
    await db.sequelize.authenticate();
    console.log('✅ Database connected');

    // Find user with username 'pink'
    const user = await db.user.findOne({
      where: { username: 'pink' }
    });

    if (!user) {
      console.log('❌ No user found with username "pink"');
      return;
    }

    console.log('👤 User found:', {
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role
    });

    // Find artist profile for this user
    const artist = await db.artist.findOne({
      where: { userId: user.id }
    });

    if (!artist) {
      console.log('❌ No artist profile found for user "pink"');
      return;
    }

    console.log('🎭 Artist profile found:', {
      id: artist.id,
      userId: artist.userId,
      stage_name: artist.stage_name,
      real_name: artist.real_name
    });

    // Check settings column
    if (artist.settings) {
      try {
        const settings = JSON.parse(artist.settings);
        console.log('⚙️ Settings column (parsed):', JSON.stringify(settings, null, 2));
        
        if (settings.folder_name) {
          console.log('📁 Folder name from settings:', settings.folder_name);
        }
        
        if (settings.path) {
          console.log('🛣️ Path from settings:', settings.path);
        }
      } catch (e) {
        console.log('❌ Error parsing settings JSON:', e.message);
        console.log('📄 Raw settings value:', artist.settings);
      }
    } else {
      console.log('❌ No settings found in artist profile');
    }

    // Check if the folder actually exists
    if (artist.settings) {
      try {
        const settings = JSON.parse(artist.settings);
        const fs = require('fs');
        const path = require('path');
        
        const folderPath = path.resolve(__dirname, 'frontend/public/artists', settings.folder_name);
        console.log('🔍 Checking folder path:', folderPath);
        
        if (fs.existsSync(folderPath)) {
          console.log('✅ Folder exists on disk');
          
          // List contents
          const contents = fs.readdirSync(folderPath);
          console.log('📂 Folder contents:', contents);
        } else {
          console.log('❌ Folder does not exist on disk');
        }
      } catch (e) {
        console.log('❌ Error checking folder:', e.message);
      }
    }

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await db.sequelize.close();
  }
}

checkPinkSettings();
