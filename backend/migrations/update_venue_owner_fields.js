'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    try {
      // First, update existing venues that might have null owner_id to have 'unclaimed' type
      await queryInterface.sequelize.query(`
        UPDATE venues 
        SET owner_type = 'unclaimed' 
        WHERE owner_id IS NULL OR owner_type IS NULL
      `, { type: queryInterface.sequelize.QueryTypes.UPDATE });

      // Modify the owner_id column to allow null
      await queryInterface.changeColumn('venues', 'owner_id', {
        type: Sequelize.INTEGER,
        allowNull: true,
        comment: 'ID of the owner (artist or organiser). Null for unclaimed venues.'
      });

      // Modify the owner_type column to allow null and add 'unclaimed' enum value
      await queryInterface.changeColumn('venues', 'owner_type', {
        type: Sequelize.ENUM('artist', 'organiser', 'unclaimed'),
        allowNull: true,
        defaultValue: 'unclaimed',
        comment: 'Type of owner. "unclaimed" for venues without owners.'
      });

      console.log('✅ Successfully updated venue table owner fields');
    } catch (error) {
      console.error('❌ Error updating venue table:', error);
      throw error;
    }
  },

  down: async (queryInterface, Sequelize) => {
    try {
      // Revert owner_id to not allow null
      await queryInterface.changeColumn('venues', 'owner_id', {
        type: Sequelize.INTEGER,
        allowNull: false
      });

      // Revert owner_type to not allow null and remove 'unclaimed' enum value
      await queryInterface.changeColumn('venues', 'owner_type', {
        type: Sequelize.ENUM('artist', 'organiser'),
        allowNull: false
      });

      console.log('✅ Successfully reverted venue table owner fields');
    } catch (error) {
      console.error('❌ Error reverting venue table:', error);
      throw error;
    }
  }
};

