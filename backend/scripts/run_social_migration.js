#!/usr/bin/env node
/**
 * One-off runner to apply add_social_auth_fields migration
 */
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });
const { Sequelize } = require('sequelize');
const dbConfig = require('../config/db.config');
const migration = require('../migrations/add_social_auth_fields');

async function main() {
  const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
    host: dbConfig.HOST,
    port: dbConfig.PORT,
    dialect: dbConfig.dialect,
    logging: false,
  });
  const queryInterface = sequelize.getQueryInterface();
  try {
    console.log('Running social auth fields migration...');
    await migration.up(queryInterface, Sequelize);
    console.log('✅ Migration completed');
  } catch (err) {
    console.error('❌ Migration failed:', err.message);
    process.exitCode = 1;
  } finally {
    await sequelize.close();
  }
}

main();


