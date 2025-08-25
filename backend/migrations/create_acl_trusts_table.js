'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Check if acl_trusts table exists
    const tables = await queryInterface.sequelize.query(
      "SHOW TABLES LIKE 'acl_trusts'",
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    );

    if (tables.length === 0) {
      // Create the acl_trusts table
      await queryInterface.createTable('acl_trusts', {
        acl_id: {
          type: Sequelize.INTEGER,
          primaryKey: true,
          autoIncrement: true
        },
        acl_name: {
          type: Sequelize.STRING,
          allowNull: false
        },
        acl_display: {
          type: Sequelize.STRING,
          allowNull: false
        },
        createdAt: {
          type: Sequelize.DATE,
          allowNull: false
        },
        updatedAt: {
          type: Sequelize.DATE,
          allowNull: false
        }
      });
    }

    // Check if data already exists
    const aclCount = await queryInterface.sequelize.query(
      "SELECT COUNT(*) as count FROM acl_trusts",
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    );

    if (aclCount[0].count === 0) {
      // Insert default ACL roles
      await queryInterface.bulkInsert('acl_trusts', [
        { acl_id: 1, acl_name: 'superuser', acl_display: 'Superuser', createdAt: new Date(), updatedAt: new Date() },
        { acl_id: 2, acl_name: 'admin', acl_display: 'Administrator', createdAt: new Date(), updatedAt: new Date() },
        { acl_id: 3, acl_name: 'artist', acl_display: 'Artist', createdAt: new Date(), updatedAt: new Date() },
        { acl_id: 4, acl_name: 'organiser', acl_display: 'Event Organiser', createdAt: new Date(), updatedAt: new Date() },
        { acl_id: 5, acl_name: 'venue', acl_display: 'Venue Owner', createdAt: new Date(), updatedAt: new Date() },
        { acl_id: 6, acl_name: 'user', acl_display: 'User', createdAt: new Date(), updatedAt: new Date() }
      ]);
    }
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('acl_trusts');
  }
};
