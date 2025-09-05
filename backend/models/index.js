//File location: backend/models/index.js
const dbConfig = require("../config/db.config.js");
const { Sequelize, DataTypes } = require("sequelize");
const bcrypt = require('bcrypt');

// ✅ Initialize Sequelize
const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
  host: dbConfig.HOST,
  port: dbConfig.PORT,
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
// Favorite models (separate tables for better performance and integrity)
db.user_artist_favorite = require("./user_artist_favorite.model.js")(sequelize, DataTypes);
db.user_event_favorite = require("./user_event_favorite.model.js")(sequelize, DataTypes);
db.user_venue_favorite = require("./user_venue_favorite.model.js")(sequelize, DataTypes);
db.user_organiser_favorite = require("./user_organiser_favorite.model.js")(sequelize, DataTypes);

// Rating model (polymorphic for flexibility)
db.rating = require("./rating.model.js")(sequelize, DataTypes);

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

// ✅ Initial Setup: Insert roles and dummy data AFTER sync
db.initializeData = async () => {
  try {
    // STEP 0: Check and add missing columns to artists table
    try {
      const columns = await db.sequelize.query(
        "DESCRIBE artists",
        { type: db.sequelize.QueryTypes.SELECT }
      );
      
      const columnNames = columns.map(col => col.Field);
      
      if (!columnNames.includes('gallery')) {
        console.log('🔧 Adding missing gallery column to artists table...');
        await db.sequelize.query(
          "ALTER TABLE artists ADD COLUMN gallery TEXT COMMENT 'JSON string containing array of gallery image paths'",
          { type: db.sequelize.QueryTypes.RAW }
        );
        console.log('✅ gallery column added to artists table');
      }
    } catch (error) {
      console.log('ℹ️ Could not check artists table structure:', error.message);
    }

    // STEP 1: Insert ACL Trust roles
    const aclCount = await db.acl_trust.count();
    if (aclCount === 0) {
      await db.acl_trust.bulkCreate([
        { acl_id: 1, acl_name: "superuser", acl_display: "Superuser" },
        { acl_id: 2, acl_name: "admin", acl_display: "Administrator" },
        { acl_id: 3, acl_name: "artist", acl_display: "Artist" },
        { acl_id: 4, acl_name: "organiser", acl_display: "Event Organiser" },
        { acl_id: 5, acl_name: "venue", acl_display: "Venue Owner" },
        { acl_id: 6, acl_name: "user", acl_display: "User" },
      ]);
      console.log("✅ ACL trust roles inserted");
    }

    // STEP 2: Create or ensure Superadmin (Owner)
    const [superadmin, superadminCreated] = await db.user.findOrCreate({
      where: { username: "Thando" },
      defaults: {
        username: "Thando",
        email: "owner@mygigguide.local",
        password: await bcrypt.hash("Gu3ssWh@t", 12),
        role: 1, // superuser
      },
    });

    if (superadminCreated) {
      console.log("✅ Superadmin user 'Thando' created (role: superuser)");
    } else {
      // Ensure credentials/role are correct if user already exists
      const updates = {};
      if (superadmin.role !== 1) updates.role = 1;
      // Only reset password if not set
      if (!superadmin.password) updates.password = await bcrypt.hash("Gu3ssWh@t", 12);
      if (!superadmin.email) updates.email = "owner@mygigguide.local";
      if (Object.keys(updates).length > 0) {
        await superadmin.update(updates);
        console.log("🔄 Superadmin 'Thando' updated to correct role/credentials");
      } else {
        console.log("ℹ️ Superadmin 'Thando' already exists");
      }
    }
  } catch (error) {
    console.error("❌ Error during initial setup:", error);
  }
};

module.exports = db;