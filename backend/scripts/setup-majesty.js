// File: backend/scripts/setup-majesty.js
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables
dotenv.config({ path: path.join(__dirname, '../.env') });

const app = express();
app.use(cors());
app.use(express.json());

// Import models after env is loaded
const db = require('../models');
const bcrypt = require('bcrypt');

async function setupMajesty() {
  try {
    console.log('🚀 Setting up Majesty table...');

    // Test database connection
    await db.sequelize.authenticate();
    console.log('✅ Database connection established');

    // Create majesty table if it doesn't exist
    await db.sequelize.query(`
      CREATE TABLE IF NOT EXISTS majesty (
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

    console.log('✅ Majesty table created/verified');

    // Check if majesty already exists
    const existingMajesty = await db.sequelize.query(
      "SELECT COUNT(*) as count FROM majesty WHERE username = 'Thando'",
      { type: db.sequelize.QueryTypes.SELECT }
    );

    if (existingMajesty[0].count === 0) {
      console.log('👑 Creating default Majesty (Owner)...');
      
      const hashedPassword = await bcrypt.hash('Gu3ssWh@t', 12);
      
      await db.sequelize.query(`
        INSERT INTO majesty (username, email, password, full_name, title, is_active, created_at, updated_at)
        VALUES (?, ?, ?, ?, ?, ?, NOW(), NOW())
      `, {
        replacements: ['Thando', 'owner@mygigguide.local', hashedPassword, 'Thando Hlophe', 'Owner', true],
        type: db.sequelize.QueryTypes.INSERT
      });
      
      console.log('✅ Default Majesty created');
    } else {
      console.log('ℹ️ Majesty already exists');
    }

    console.log('🎉 Majesty setup completed successfully!');
    console.log('📝 Login credentials:');
    console.log('   Username: Thando');
    console.log('   Password: Gu3ssWh@t');
    console.log('   Endpoint: POST /api/majesty/login');

  } catch (error) {
    console.error('❌ Setup error:', error);
  } finally {
    await db.sequelize.close();
    process.exit();
  }
}

setupMajesty();
