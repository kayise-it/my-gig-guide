// Migration to update events table to allow 'user' as owner_type
const { DataTypes } = require('sequelize');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    try {
      // For MySQL, we need to modify the ENUM constraint
      await queryInterface.sequelize.query(`
        ALTER TABLE events 
        MODIFY COLUMN owner_type ENUM('artist', 'organiser', 'user') NOT NULL
      `);
      
      console.log('Successfully updated events table owner_type ENUM');
    } catch (error) {
      console.error('Error updating events table:', error);
      throw error;
    }
  },

  down: async (queryInterface, Sequelize) => {
    try {
      // Revert back to original ENUM values
      await queryInterface.sequelize.query(`
        ALTER TABLE events 
        MODIFY COLUMN owner_type ENUM('artist', 'organiser') NOT NULL
      `);
      
      console.log('Successfully reverted events table owner_type ENUM');
    } catch (error) {
      console.error('Error reverting events table:', error);
      throw error;
    }
  }
};
