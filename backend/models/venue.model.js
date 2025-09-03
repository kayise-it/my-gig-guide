// File: backend/models/venue.model.js
module.exports = (sequelize, DataTypes) => {
  const Venue = sequelize.define("venue", {
    name: { type: DataTypes.STRING, allowNull: false },
    location: DataTypes.STRING,
    capacity: DataTypes.INTEGER,
    contact_email: { type: DataTypes.STRING, unique: true },
    phone_number: DataTypes.STRING,
    website: DataTypes.STRING,
    address: DataTypes.STRING,
    latitude: DataTypes.FLOAT,
    longitude: DataTypes.FLOAT,
    userId: DataTypes.INTEGER,
    owner_id: { 
      type: DataTypes.INTEGER, 
      allowNull: true,
      comment: 'ID of the owner (artist or organiser). Null for unclaimed venues.'
    },
    owner_type: { 
      type: DataTypes.ENUM('artist', 'organiser', 'unclaimed'), 
      allowNull: true,
      defaultValue: 'unclaimed',
      validate: {
        isIn: [['artist', 'organiser', 'unclaimed']]
      },
      comment: 'Type of owner. "unclaimed" for venues without owners.'
    },
    main_picture: {
      type: DataTypes.STRING,
      allowNull: true,
      comment: 'Public path to the main venue image'
    },
    venue_gallery: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: 'JSON string containing array of gallery image paths'
    }
  });

  Venue.associate = (models) => {
    Venue.belongsTo(models.user, {
      foreignKey: 'userId',
      as: 'creator'
    });

    // Polymorphic associations for owner (join on owner_id only; filter owner_type at query time)
    Venue.belongsTo(models.artist, {
      foreignKey: 'owner_id',
      constraints: false,
      as: 'artistOwner'
    });

    Venue.belongsTo(models.organiser, {
      foreignKey: 'owner_id',
      constraints: false,
      as: 'organiserOwner'
    });

    // Venue can have many events
    Venue.hasMany(models.event, {
      foreignKey: 'venue_id',
      as: 'events'
    });
  };

  return Venue;
};