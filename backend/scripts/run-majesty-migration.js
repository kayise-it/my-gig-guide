// File: backend/scripts/run-majesty-migration.js
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables from .env file
dotenv.config({ path: path.join(__dirname, '../.env') });

const db = require('../models');
const bcrypt = require('bcrypt');

async function runMajestyMigration() {
  try {
    console.log('🚀 Starting Majesty migration...');

    // Check if majesty table exists
    const tables = await db.sequelize.query(
      "SHOW TABLES LIKE 'majesty'",
      { type: db.sequelize.QueryTypes.SELECT }
    );

    if (tables.length === 0) {
      console.log('📋 Creating majesty table...');
      
      // Create the majesty table
      await db.sequelize.query(`
        CREATE TABLE majesty (
          id INT PRIMARY KEY AUTO_INCREMENT,
          username VARCHAR(255) NOT NULL UNIQUE,
          email VARCHAR(255) NOT NULL UNIQUE,
          password VARCHAR(255) NOT NULL,
          full_name VARCHAR(255),
          title VARCHAR(255) DEFAULT 'Owner',
          is_active BOOLEAN NOT NULL DEFAULT true,
          last_login DATETIME,
          settings JSON,
          created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
          updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
        )
      `, { type: db.sequelize.QueryTypes.RAW });
      
      console.log('✅ Majesty table created');
    } else {
      console.log('ℹ️ Majesty table already exists');
    }

    // Check if majesty data exists
    const majestyCount = await db.sequelize.query(
      "SELECT COUNT(*) as count FROM majesty",
      { type: db.sequelize.QueryTypes.SELECT }
    );

    if (majestyCount[0].count === 0) {
      console.log('👑 Creating default Majesty (Owner)...');
      
      const hashedPassword = await bcrypt.hash('Gu3ssWh@t', 12);
      
      await db.sequelize.query(`
        INSERT INTO majesty (username, email, password, full_name, title, is_active, created_at, updated_at)
        VALUES ('Thando', 'owner@mygigguide.local', ?, 'Thando Hlophe', 'Owner', true, NOW(), NOW())
      `, {
        replacements: [hashedPassword],
        type: db.sequelize.QueryTypes.INSERT
      });
      
      console.log('✅ Default Majesty created');
    } else {
      console.log('ℹ️ Majesty data already exists');
    }

    console.log('🎉 Majesty migration completed successfully!');
    console.log('📝 Login credentials:');
    console.log('   Username: Thando');
    console.log('   Password: Gu3ssWh@t');
    console.log('   Endpoint: POST /api/majesty/login');

  } catch (error) {
    console.error('❌ Migration error:', error);
  } finally {
    process.exit();
  }
}

runMajestyMigration();
