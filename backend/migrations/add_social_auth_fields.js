'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('users', 'auth_provider', {
      type: Sequelize.ENUM('local', 'google', 'facebook'),
      allowNull: false,
      defaultValue: 'local'
    });

    await queryInterface.addColumn('users', 'auth_provider_id', {
      type: Sequelize.STRING,
      allowNull: true,
      unique: true
    });

    await queryInterface.addColumn('users', 'profile_picture', {
      type: Sequelize.STRING,
      allowNull: true
    });

    await queryInterface.addColumn('users', 'email_verified', {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: false
    });

    // Make password optional for social auth users
    await queryInterface.changeColumn('users', 'password', {
      type: Sequelize.STRING,
      allowNull: true
    });

    // Make username optional for social auth users (can be generated)
    await queryInterface.changeColumn('users', 'username', {
      type: Sequelize.STRING,
      allowNull: true,
      unique: true
    });

    // Add unique constraint for auth_provider + auth_provider_id combination
    await queryInterface.addIndex('users', ['auth_provider', 'auth_provider_id'], {
      unique: true,
      where: {
        auth_provider_id: {
          [Sequelize.Op.ne]: null
        }
      }
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('users', 'auth_provider');
    await queryInterface.removeColumn('users', 'auth_provider_id');
    await queryInterface.removeColumn('users', 'profile_picture');
    await queryInterface.removeColumn('users', 'email_verified');
    
    // Revert password and username to required
    await queryInterface.changeColumn('users', 'password', {
      type: Sequelize.STRING,
      allowNull: false
    });
    
    await queryInterface.changeColumn('users', 'username', {
      type: Sequelize.STRING,
      allowNull: false,
      unique: true
    });
  }
};
