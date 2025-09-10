// backend/models/paid_feature.model.js
module.exports = (sequelize, DataTypes) => {
  const PaidFeature = sequelize.define(
    "paid_feature",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      key: {
        type: DataTypes.STRING(100),
        allowNull: false,
        unique: true,
      },
      name: {
        type: DataTypes.STRING(150),
        allowNull: false,
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      target: {
        type: DataTypes.ENUM("artist", "venue", "event", "any"),
        allowNull: false,
        defaultValue: "any",
      },
      billing_type: {
        type: DataTypes.ENUM("one_time", "recurring", "consumption"),
        allowNull: false,
        defaultValue: "one_time",
      },
      default_price: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: true,
      },
      is_active: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },
    },
    {
      tableName: "paid_features",
      underscored: true,
    }
  );

  PaidFeature.associate = (db) => {
    PaidFeature.hasMany(db.purchased_feature, {
      foreignKey: "feature_id",
      as: "purchases",
    });
  };

  return PaidFeature;
};


