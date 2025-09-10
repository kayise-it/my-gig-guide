// Migration to create paid_features and purchased_features tables if not exist
const db = require('../models');

module.exports = async function createPaidFeaturesTables() {
  const qi = db.sequelize.getQueryInterface();

  // paid_features
  const paidFeaturesExists = await qi.describeTable('paid_features').then(() => true).catch(() => false);
  if (!paidFeaturesExists) {
    await qi.createTable('paid_features', {
      id: { type: db.Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
      key: { type: db.Sequelize.STRING(100), allowNull: false, unique: true },
      name: { type: db.Sequelize.STRING(150), allowNull: false },
      description: { type: db.Sequelize.TEXT },
      target: { type: db.Sequelize.ENUM('artist','venue','event','any'), allowNull: false, defaultValue: 'any' },
      billing_type: { type: db.Sequelize.ENUM('one_time','recurring','consumption'), allowNull: false, defaultValue: 'one_time' },
      default_price: { type: db.Sequelize.DECIMAL(10,2) },
      is_active: { type: db.Sequelize.BOOLEAN, allowNull: false, defaultValue: true },
      created_at: { type: db.Sequelize.DATE, allowNull: false, defaultValue: db.Sequelize.fn('NOW') },
      updated_at: { type: db.Sequelize.DATE, allowNull: false, defaultValue: db.Sequelize.fn('NOW') },
    });
    console.log('✅ created table paid_features');
  } else {
    console.log('ℹ️ table paid_features already exists');
  }

  // purchased_features
  const purchasedFeaturesExists = await qi.describeTable('purchased_features').then(() => true).catch(() => false);
  if (!purchasedFeaturesExists) {
    await qi.createTable('purchased_features', {
      id: { type: db.Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
      owner_type: { type: db.Sequelize.ENUM('artist','venue','event'), allowNull: false },
      owner_id: { type: db.Sequelize.INTEGER, allowNull: false },
      feature_id: { type: db.Sequelize.INTEGER, allowNull: false, references: { model: 'paid_features', key: 'id' }, onDelete: 'CASCADE' },
      status: { type: db.Sequelize.ENUM('active','pending','canceled','expired'), allowNull: false, defaultValue: 'active' },
      starts_at: { type: db.Sequelize.DATE, allowNull: false, defaultValue: db.Sequelize.fn('NOW') },
      ends_at: { type: db.Sequelize.DATE },
      price_paid: { type: db.Sequelize.DECIMAL(10,2) },
      metadata: { type: db.Sequelize.JSON },
      created_at: { type: db.Sequelize.DATE, allowNull: false, defaultValue: db.Sequelize.fn('NOW') },
      updated_at: { type: db.Sequelize.DATE, allowNull: false, defaultValue: db.Sequelize.fn('NOW') },
    });
    await qi.addIndex('purchased_features', ['owner_type','owner_id']);
    await qi.addIndex('purchased_features', ['feature_id']);
    await qi.addIndex('purchased_features', ['status','ends_at']);
    console.log('✅ created table purchased_features');
  } else {
    console.log('ℹ️ table purchased_features already exists');
  }

  // Seed common features if empty
  const count = await db.paid_feature.count();
  if (count === 0) {
    await db.paid_feature.bulkCreate([
      { key: 'featured_badge', name: 'Featured Badge', target: 'artist', billing_type: 'recurring', default_price: 9.99 },
      { key: 'homepage_spotlight', name: 'Homepage Spotlight', target: 'artist', billing_type: 'consumption', default_price: 19.99 },
      { key: 'venue_featured', name: 'Featured Venue', target: 'venue', billing_type: 'recurring', default_price: 14.99 },
      { key: 'event_boost', name: 'Event Boost', target: 'event', billing_type: 'consumption', default_price: 4.99 },
    ]);
    console.log('✅ seeded default paid_features');
  }
}


