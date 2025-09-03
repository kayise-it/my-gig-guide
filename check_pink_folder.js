const db = require('./backend/models');

async function checkPinkFolder() {
  try {
    await db.sequelize.authenticate();
    
    // Find user with username 'pink'
    const user = await db.user.findOne({ where: { username: 'pink' } });
    if (!user) {
      console.log('No user "pink" found');
      return;
    }
    
    // Find artist profile
    const artist = await db.artist.findOne({ where: { userId: user.id } });
    if (!artist || !artist.settings) {
      console.log('No artist profile or settings found');
      return;
    }
    
    const settings = JSON.parse(artist.settings);
    console.log('Pink artist folder name:', settings.folder_name);
    
  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await db.sequelize.close();
  }
}

checkPinkFolder();
