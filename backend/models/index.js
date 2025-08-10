//File location: backend/models/index.js
const dbConfig = require("../config/db.config.js");
const { Sequelize, DataTypes } = require("sequelize");
const bcrypt = require('bcrypt');

// ✅ Initialize Sequelize
const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
  host: dbConfig.HOST,
  dialect: dbConfig.dialect,
  logging: false, // Disable SQL logging
});

const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;

// ✅ Load models
db.acl_trust = require("./acl_trust.model.js")(sequelize, DataTypes);
db.user = require("./user.model.js")(sequelize, DataTypes);
db.artist = require("./artist.model.js")(sequelize, DataTypes);
db.organiser = require("./organiser.model.js")(sequelize, DataTypes);
db.venue = require("./venue.model.js")(sequelize, DataTypes);
db.event = require("./event.model.js")(sequelize, DataTypes);
db.event_artist = require("./event_artist.model.js")(sequelize, DataTypes);
db.favorites = require("./favorite.model.js")(sequelize, DataTypes);

// Add missing association between acl_trust and user
db.acl_trust.hasMany(db.user, { foreignKey: 'role', sourceKey: 'acl_id' });
db.user.belongsTo(db.acl_trust, { foreignKey: 'role', targetKey: 'acl_id', as: 'aclInfo' });

// Event-Artist many-to-many relationship
db.event.belongsToMany(db.artist, { 
  through: db.event_artist, 
  foreignKey: 'event_id',
  otherKey: 'artist_id',
  as: 'artists'
});

db.artist.belongsToMany(db.event, { 
  through: db.event_artist, 
  foreignKey: 'artist_id',
  otherKey: 'event_id',
  as: 'events'
});

// (Optional) Enable future use of associate() per model
Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

// ✅ Exported Initial Setup: Insert dummy data AFTER sync (ACL roles handled by migration)
db.initializeData = async () => {
  try {
    // ACL roles are now handled by migration, so we skip seeding them here

    // STEP 2: THEN create user
    const [admin, created] = await db.user.findOrCreate({
      where: { email: "thandov.hlophe@gmail.com" },
      defaults: {
        username: "Thando",
        password: await bcrypt.hash("thandov.hlophe@gmail.com", 12),
        role: 3,
      },
    });

    if (created) {
      console.log("✅ Admin user created");
      await db.artist.create({
        userId: admin.id,
        stage_name: 'Thando Vibes',
        real_name: 'Thando Hlophe',
        genre: 'Afro Soul',
        bio: 'An emerging voice in Afro Soul from Mpumalanga.',
        phone_number: '0721234567',
        instagram: 'https://instagram.com/thandovibes',
        facebook: 'https://facebook.com/thandovibes',
        twitter: 'https://twitter.com/thandovibes',
        profile_picture: '/images/artists/thando.jpg',
      });

      console.log("✅ Dummy artist added");

    } else {
      console.log("ℹ️ Admin user already exists");
    }

    // Dummy artist profile
    const artistExists = await db.artist.findOne({ where: { userId: admin.id } });

    if (!artistExists) {
      await db.artist.create({
        userId: admin.id,
        stage_name: 'Thando Vibes',
        real_name: 'Thando Hlophe',
        genre: 'Afro Soul',
        bio: 'An emerging voice in Afro Soul from Mpumalanga.',
        phone_number: '0721234567',
        instagram: 'https://instagram.com/thandovibes',
        facebook: 'https://facebook.com/thandovibes',
        twitter: 'https://twitter.com/thandovibes',
        profile_picture: '/images/artists/thando.jpg',
      });
      console.log("✅ Dummy artist added successfully.");
    } else {
      console.log("ℹ️ Dummy artist already exists.");
    }
  } catch (error) {
    console.error("❌ Error during initial setup:", error);
  }
};

module.exports = db;