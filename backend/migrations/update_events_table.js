'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Check if the events table exists
    const tables = await queryInterface.sequelize.query(
      "SHOW TABLES LIKE 'events'",
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    );

    if (tables.length === 0) {
      console.log('Events table does not exist. Skipping migration.');
      return;
    }

    // Check if the new columns already exist
    const tableInfo = await queryInterface.sequelize.query(
      "DESCRIBE events",
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    );

    const hasNewColumns = tableInfo.some(col => col.Field === 'owner_id' || col.Field === 'owner_type');
    const hasOldColumns = tableInfo.some(col => col.Field === 'organiser_id' || col.Field === 'artist_id');

    if (hasNewColumns && !hasOldColumns) {
      console.log('Migration already completed. New structure is in place.');
      return;
    }

    // Add new columns if they don't exist
    if (!hasNewColumns) {
      await queryInterface.addColumn('events', 'owner_id', {
        type: Sequelize.INTEGER,
        allowNull: true
      });
      
      await queryInterface.addColumn('events', 'owner_type', {
        type: Sequelize.ENUM('artist', 'organiser'),
        allowNull: true
      });
    }

    // Migrate existing data
    await queryInterface.sequelize.query(
      "UPDATE events SET owner_id = organiser_id, owner_type = 'organiser' WHERE organiser_id IS NOT NULL AND organiser_id != 0",
      { type: queryInterface.sequelize.QueryTypes.UPDATE }
    );

    await queryInterface.sequelize.query(
      "UPDATE events SET owner_id = artist_id, owner_type = 'artist' WHERE artist_id IS NOT NULL AND artist_id != 0",
      { type: queryInterface.sequelize.QueryTypes.UPDATE }
    );

    // Make owner_id NOT NULL after migration
    await queryInterface.changeColumn('events', 'owner_id', {
      type: Sequelize.INTEGER,
      allowNull: false
    });

    await queryInterface.changeColumn('events', 'owner_type', {
      type: Sequelize.ENUM('artist', 'organiser'),
      allowNull: false
    });

    // Remove old columns if they exist
    if (hasOldColumns) {
      await queryInterface.removeColumn('events', 'organiser_id');
      await queryInterface.removeColumn('events', 'artist_id');
    }
  },

  down: async (queryInterface, Sequelize) => {
    // Add back old columns
    await queryInterface.addColumn('events', 'organiser_id', {
      type: Sequelize.INTEGER,
      allowNull: true
    });

    await queryInterface.addColumn('events', 'artist_id', {
      type: Sequelize.INTEGER,
      allowNull: true
    });

    // Migrate data back
    await queryInterface.sequelize.query(
      "UPDATE events SET organiser_id = owner_id WHERE owner_type = 'organiser'",
      { type: queryInterface.sequelize.QueryTypes.UPDATE }
    );

    await queryInterface.sequelize.query(
      "UPDATE events SET artist_id = owner_id WHERE owner_type = 'artist'",
      { type: queryInterface.sequelize.QueryTypes.UPDATE }
    );

    // Remove new columns
    await queryInterface.removeColumn('events', 'owner_id');
    await queryInterface.removeColumn('events', 'owner_type');
  }
};
