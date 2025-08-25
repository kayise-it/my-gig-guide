'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Drop existing ratings table if it exists
    await queryInterface.sequelize.query('DROP TABLE IF EXISTS ratings', { 
      type: queryInterface.sequelize.QueryTypes.RAW 
    });

    // Create ratings table with proper structure
    await queryInterface.createTable('ratings', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      userId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'users',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      rateableId: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      rateableType: {
        type: Sequelize.ENUM('artist', 'event', 'venue', 'organiser'),
        allowNull: false
      },
      rating: {
        type: Sequelize.DECIMAL(2, 1),
        allowNull: false,
        validate: {
          min: 1.0,
          max: 5.0
        }
      },
      review: {
        type: Sequelize.TEXT,
        allowNull: true
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

    // Add unique constraint
    await queryInterface.addIndex('ratings', ['userId', 'rateableId', 'rateableType'], {
      unique: true,
      name: 'unique_user_rating'
    });

    // Add indexes for better performance
    await queryInterface.addIndex('ratings', ['rateableType', 'rateableId'], {
      name: 'idx_rateable'
    });

    await queryInterface.addIndex('ratings', ['rating'], {
      name: 'idx_rating'
    });

    await queryInterface.addIndex('ratings', ['userId'], {
      name: 'idx_user'
    });

    await queryInterface.addIndex('ratings', ['createdAt'], {
      name: 'idx_created_at'
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('ratings');
  }
};

