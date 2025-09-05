#!/usr/bin/env node

const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });
const { Sequelize } = require('sequelize');
const dbConfig = require('../config/db.config');
const migration = require('../migrations/add_user_settings_column');

async function main() {
  const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
    host: dbConfig.HOST,
    port: dbConfig.PORT,
    dialect: dbConfig.dialect,
    logging: false,
  });
  const queryInterface = sequelize.getQueryInterface();
  
  try {
    console.log('🔧 Running user settings column migration...');
    await migration.up(queryInterface, Sequelize);
    console.log('✅ User settings column migration completed successfully!');
    console.log('📝 Added "settings" JSON column to users table');
  } catch (err) {
    console.error('❌ Migration failed:', err.message);
    process.exitCode = 1;
  } finally {
    await sequelize.close();
  }
}

main();
