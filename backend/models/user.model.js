//File: backend/models/user.model.js
module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define("user", {
    username: {
      type: DataTypes.STRING,
      allowNull: true, // Optional for social auth
      unique: true,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: true, // Optional for social auth
    },
    role: {
      //refers to the ACL trust table
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'acl_trusts', // name of the target model
        key: 'acl_id' // key in the target model that we're referencing
      }
    },
    auth_provider: {
      type: DataTypes.ENUM('local', 'google', 'facebook'),
      allowNull: false,
      defaultValue: 'local'
    },
    auth_provider_id: {
      type: DataTypes.STRING,
      allowNull: true,
      unique: true
    },
    profile_picture: {
      type: DataTypes.STRING,
      allowNull: true
    },
    email_verified: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    settings: {
      type: DataTypes.JSON,
      allowNull: true,
      defaultValue: null
    }
  });


  return User;
};