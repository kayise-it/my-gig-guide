const db = require('../models');

async function hasFeature(ownerType, ownerId, featureKey, at = new Date()) {
  const purchase = await db.purchased_feature.findOne({
    include: [{ model: db.paid_feature, as: 'feature', where: { key: featureKey } }],
    where: {
      owner_type: ownerType,
      owner_id: ownerId,
      status: 'active',
      starts_at: { [db.Sequelize.Op.lte]: at },
      [db.Sequelize.Op.or]: [{ ends_at: null }, { ends_at: { [db.Sequelize.Op.gte]: at } }],
    },
  });
  return Boolean(purchase);
}

module.exports = { hasFeature };


