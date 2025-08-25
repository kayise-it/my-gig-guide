const { Sequelize, DataTypes } = require('sequelize');
const dbConfig = require('./config/db.config.js');

// Create Sequelize instance
const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
  host: dbConfig.HOST,
  dialect: dbConfig.dialect,
  logging: false
});

// Import models
const Event = require('./models/event.model.js')(sequelize, DataTypes);

async function fixImagePaths() {
  try {
    await sequelize.authenticate();
    console.log('✅ Connected to database');

    // Get all events with poster paths
    const events = await Event.findAll({
      where: {
        poster: {
          [Sequelize.Op.ne]: null
        }
      }
    });

    console.log(`📅 Found ${events.length} events with poster paths`);

    // Fix paths for each event
    for (const event of events) {
      let newPath = event.poster;
      let updated = false;

      // Fix common path issues
      if (newPath.includes('/artists/3_Thando_9144/')) {
        newPath = newPath.replace('/artists/3_Thando_9144/', '/artists/3_Thando_8146/');
        updated = true;
      }

      if (newPath.includes('/api/artists/')) {
        newPath = newPath.replace('/api/artists/', '/artists/');
        updated = true;
      }

      if (newPath.includes('/events/events/')) {
        newPath = newPath.replace('/events/events/', '/events/');
        updated = true;
      }

      if (newPath.includes('/events/event_poster/')) {
        newPath = newPath.replace('/events/event_poster/', '/events/1_kamal_lamb/event_poster/');
        updated = true;
      }

      // Remove extra spaces
      newPath = newPath.replace(/\s+/g, '');

      if (updated && newPath !== event.poster) {
        await event.update({ poster: newPath });
        console.log(`✅ Fixed event ${event.id} (${event.name}):`);
        console.log(`   Old: ${event.poster}`);
        console.log(`   New: ${newPath}`);
      }
    }

    console.log('🎉 Image paths fixed!');

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await sequelize.close();
  }
}

fixImagePaths();
