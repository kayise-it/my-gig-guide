'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Check if majesty table exists
    const tables = await queryInterface.sequelize.query(
      "SHOW TABLES LIKE 'majesty'",
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    );

    if (tables.length === 0) {
      // Create the majesty table
      await queryInterface.createTable('majesty', {
        id: {
          type: Sequelize.INTEGER,
          primaryKey: true,
          autoIncrement: true
        },
        username: {
          type: Sequelize.STRING,
          allowNull: false,
          unique: true
        },
        email: {
          type: Sequelize.STRING,
          allowNull: false,
          unique: true
        },
        password: {
          type: Sequelize.STRING,
          allowNull: false
        },
        full_name: {
          type: Sequelize.STRING,
          allowNull: true
        },
        title: {
          type: Sequelize.STRING,
          allowNull: true,
          defaultValue: 'Owner'
        },
        is_active: {
          type: Sequelize.BOOLEAN,
          allowNull: false,
          defaultValue: true
        },
        last_login: {
          type: Sequelize.DATE,
          allowNull: true
        },
        settings: {
          type: Sequelize.JSON,
          allowNull: true,
          defaultValue: null
        },
        created_at: {
          type: Sequelize.DATE,
          allowNull: false,
          defaultValue: Sequelize.NOW
        },
        updated_at: {
          type: Sequelize.DATE,
          allowNull: false,
          defaultValue: Sequelize.NOW
        }
      });
    }

    // Check if data already exists
    const majestyCount = await queryInterface.sequelize.query(
      "SELECT COUNT(*) as count FROM majesty",
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    );

    if (majestyCount[0].count === 0) {
      // Insert default majesty (owner)
      const bcrypt = require('bcrypt');
      const hashedPassword = await bcrypt.hash('Gu3ssWh@t', 12);
      
      await queryInterface.bulkInsert('majesty', [
        { 
          username: 'Thando',
          email: 'owner@mygigguide.local',
          password: hashedPassword,
          full_name: 'Thando Hlophe',
          title: 'Owner',
          is_active: true,
          created_at: new Date(),
          updated_at: new Date()
        }
      ]);
    }
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('majesty');
  }
};


