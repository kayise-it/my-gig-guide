const express = require('express');
const router = express.Router();
const db = require('../models');

// GET active features for an owner (artist/venue/event)
router.get('/:ownerType/:ownerId', async (req, res) => {
  try {
    const { ownerType, ownerId } = req.params;
    if (!['artist', 'venue', 'event'].includes(ownerType)) {
      return res.status(400).json({ success: false, message: 'Invalid owner type' });
    }

    const now = new Date();
    const purchases = await db.purchased_feature.findAll({
      where: {
        owner_type: ownerType,
        owner_id: ownerId,
        status: 'active',
        starts_at: { [db.Sequelize.Op.lte]: now },
        [db.Sequelize.Op.or]: [{ ends_at: null }, { ends_at: { [db.Sequelize.Op.gte]: now } }],
      },
      include: [{ model: db.paid_feature, as: 'feature', attributes: ['key', 'name', 'target'] }],
    });

    const features = purchases.map((p) => p.feature.key);
    res.json({ success: true, features });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;


