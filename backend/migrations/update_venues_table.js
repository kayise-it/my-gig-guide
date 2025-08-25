'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Check if the venues table exists
    const tables = await queryInterface.sequelize.query(
      "SHOW TABLES LIKE 'venues'",
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    );

    if (tables.length === 0) {
      console.log('Venues table does not exist. Skipping migration.');
      return;
    }

    // Check if the new columns already exist
    const tableInfo = await queryInterface.sequelize.query(
      "DESCRIBE venues",
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    );

    const hasNewColumns = tableInfo.some(col => col.Field === 'owner_id' || col.Field === 'owner_type');
    const hasOldColumns = tableInfo.some(col => col.Field === 'artist_id' || col.Field === 'organiser_id');

    if (hasNewColumns && !hasOldColumns) {
      console.log('Migration already completed. New structure is in place.');
      return;
    }

    // Add new columns if they don't exist
    if (!hasNewColumns) {
      await queryInterface.addColumn('venues', 'owner_id', {
        type: Sequelize.INTEGER,
        allowNull: true
      });
      
      await queryInterface.addColumn('venues', 'owner_type', {
        type: Sequelize.ENUM('artist', 'organiser'),
        allowNull: true
      });
    }

    // Migrate existing data
    await queryInterface.sequelize.query(
      "UPDATE venues SET owner_id = artist_id, owner_type = 'artist' WHERE artist_id IS NOT NULL AND artist_id != 0",
      { type: queryInterface.sequelize.QueryTypes.UPDATE }
    );

    await queryInterface.sequelize.query(
      "UPDATE venues SET owner_id = organiser_id, owner_type = 'organiser' WHERE organiser_id IS NOT NULL AND organiser_id != 0",
      { type: queryInterface.sequelize.QueryTypes.UPDATE }
    );

    // Make owner_id NOT NULL after migration
    await queryInterface.changeColumn('venues', 'owner_id', {
      type: Sequelize.INTEGER,
      allowNull: false
    });

    await queryInterface.changeColumn('venues', 'owner_type', {
      type: Sequelize.ENUM('artist', 'organiser'),
      allowNull: false
    });

    // Remove old columns if they exist
    if (hasOldColumns) {
      await queryInterface.removeColumn('venues', 'artist_id');
      await queryInterface.removeColumn('venues', 'organiser_id');
    }
  },

  down: async (queryInterface, Sequelize) => {
    // Add back old columns
    await queryInterface.addColumn('venues', 'artist_id', {
      type: Sequelize.INTEGER,
      allowNull: true
    });

    await queryInterface.addColumn('venues', 'organiser_id', {
      type: Sequelize.INTEGER,
      allowNull: true
    });

    // Migrate data back
    await queryInterface.sequelize.query(
      "UPDATE venues SET artist_id = owner_id WHERE owner_type = 'artist'",
      { type: queryInterface.sequelize.QueryTypes.UPDATE }
    );

    await queryInterface.sequelize.query(
      "UPDATE venues SET organiser_id = owner_id WHERE owner_type = 'organiser'",
      { type: queryInterface.sequelize.QueryTypes.UPDATE }
    );

    // Remove new columns
    await queryInterface.removeColumn('venues', 'owner_id');
    await queryInterface.removeColumn('venues', 'owner_type');
  }
};
