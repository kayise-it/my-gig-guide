// backend/models/purchased_feature.model.js
module.exports = (sequelize, DataTypes) => {
  const PurchasedFeature = sequelize.define(
    "purchased_feature",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      owner_type: {
        type: DataTypes.ENUM("artist", "venue", "event"),
        allowNull: false,
      },
      owner_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      feature_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      status: {
        type: DataTypes.ENUM("active", "pending", "canceled", "expired"),
        allowNull: false,
        defaultValue: "active",
      },
      starts_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
      ends_at: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      price_paid: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: true,
      },
      metadata: {
        type: DataTypes.JSON,
        allowNull: true,
      },
    },
    {
      tableName: "purchased_features",
      underscored: true,
      indexes: [
        { fields: ["owner_type", "owner_id"] },
        { fields: ["feature_id"] },
        { fields: ["status", "ends_at"] },
      ],
    }
  );

  PurchasedFeature.associate = (db) => {
    PurchasedFeature.belongsTo(db.paid_feature, {
      foreignKey: "feature_id",
      as: "feature",
    });
  };

  return PurchasedFeature;
};


