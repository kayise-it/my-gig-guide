// File: backend/routes/admin.routes.js
const express = require("express");
const router = express.Router();
const adminController = require("../controllers/admin.controller");
const { verifyMajestyToken } = require("../middleware/majesty.middleware");
const db = require("../models");

// All admin routes require Majesty authentication
router.use(verifyMajestyToken);

// Dashboard statistics
router.get("/stats", adminController.getDashboardStats);

// Entity management routes
// Users CRUD
router.get("/users", adminController.getUsers);
router.get("/users/:id", adminController.getUser);
router.post("/users", adminController.createUser);
router.put("/users/:id", adminController.updateUser);
router.delete("/users/:id", adminController.deleteUser);

// Artists CRUD
router.get("/artists", adminController.getArtists);
router.get("/artists/:id", adminController.getArtist);
router.post("/artists", adminController.createArtist);
router.put("/artists/:id", adminController.updateArtist);
router.delete("/artists/:id", adminController.deleteArtist);

// Organisers CRUD
router.get("/organisers", adminController.getOrganisers);
router.get("/organisers/:id", adminController.getOrganiser);
router.post("/organisers", adminController.createOrganiser);
router.put("/organisers/:id", adminController.updateOrganiser);
router.delete("/organisers/:id", adminController.deleteOrganiser);

// Venues CRUD
router.get("/venues", adminController.getVenues);
router.get("/venues/:id", adminController.getVenue);
router.post("/venues", adminController.createVenue);
router.put("/venues/:id", adminController.updateVenue);
router.delete("/venues/:id", adminController.deleteVenue);

// Events CRUD
router.get("/events", adminController.getEvents);
router.get("/events/:id", adminController.getEvent);
router.post("/events", adminController.createEvent);
router.put("/events/:id", adminController.updateEvent);
router.delete("/events/:id", adminController.deleteEvent);

// ===== Paid Features CRUD =====
router.get('/paid-features', async (req, res) => {
  try {
    const { q, status } = req.query;
    const where = {};
    if (q) where.name = { [db.Sequelize.Op.like]: `%${q}%` };
    if (status === 'active') where.is_active = true;
    if (status === 'inactive') where.is_active = false;
    const features = await db.paid_feature.findAll({ where, order: [['created_at','DESC']] });
    res.json({ success: true, data: features });
  } catch (e) {
    res.status(500).json({ success: false, message: e.message });
  }
});

router.post('/paid-features', async (req, res) => {
  try {
    const { name, slug, description, default_price, durationDays, isActive, target, billing_type } = req.body;
    if (!name || !slug) return res.status(400).json({ success: false, message: 'name and slug are required' });
    if (default_price != null && Number(default_price) < 0) return res.status(400).json({ success: false, message: 'price must be >= 0' });
    if (durationDays != null && Number(durationDays) < 1) return res.status(400).json({ success: false, message: 'durationDays must be >= 1' });

    const existing = await db.paid_feature.findOne({ where: { key: slug } });
    if (existing) return res.status(409).json({ success: false, message: 'Slug already exists' });

    const feature = await db.paid_feature.create({
      key: slug,
      name,
      description,
      default_price,
      is_active: isActive !== false,
      target: target || 'any',
      billing_type: billing_type || 'one_time',
    });

    res.status(201).json({ success: true, data: feature });
  } catch (e) {
    res.status(500).json({ success: false, message: e.message });
  }
});

router.put('/paid-features/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, slug, description, default_price, isActive, target } = req.body;
    const feature = await db.paid_feature.findByPk(id);
    if (!feature) return res.status(404).json({ success: false, message: 'Not found' });

    if (slug && slug !== feature.key) {
      const exists = await db.paid_feature.findOne({ where: { key: slug } });
      if (exists) return res.status(409).json({ success: false, message: 'Slug already exists' });
      feature.key = slug;
    }

    if (name != null) feature.name = name;
    if (description != null) feature.description = description;
    if (default_price != null) {
      if (Number(default_price) < 0) return res.status(400).json({ success: false, message: 'price must be >= 0' });
      feature.default_price = default_price;
    }
    if (isActive != null) feature.is_active = Boolean(isActive);
    if (target != null) {
      const allowed = ['artist','venue','event','any'];
      if (!allowed.includes(target)) return res.status(400).json({ success: false, message: 'Invalid target' });
      feature.target = target;
    }

    await feature.save();
    res.json({ success: true, data: feature });
  } catch (e) {
    res.status(500).json({ success: false, message: e.message });
  }
});

router.delete('/paid-features/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const feature = await db.paid_feature.findByPk(id);
    if (!feature) return res.status(404).json({ success: false, message: 'Not found' });

    const used = await db.purchased_feature.count({ where: { feature_id: id } });
    if (used > 0) return res.status(400).json({ success: false, message: 'Cannot delete: feature has purchases' });

    await feature.destroy();
    res.json({ success: true });
  } catch (e) {
    res.status(500).json({ success: false, message: e.message });
  }
});

// ===== Purchases (link owners to features) =====
router.post('/purchases', async (req, res) => {
  try {
    const { ownerType, ownerId, featureKey, featureId, durationDays, pricePaid, currency = 'ZAR', startAt } = req.body;
    if (!['artist','venue','event'].includes(ownerType)) return res.status(400).json({ success: false, message: 'Invalid ownerType' });
    if (!ownerId) return res.status(400).json({ success: false, message: 'ownerId required' });
    if (!featureKey && !featureId) return res.status(400).json({ success: false, message: 'featureKey or featureId required' });
    const feature = featureId ? await db.paid_feature.findByPk(featureId) : await db.paid_feature.findOne({ where: { key: featureKey } });
    if (!feature) return res.status(404).json({ success: false, message: 'Feature not found' });

    // Validate that the feature target is compatible with the owner type
    if (feature.target && feature.target !== 'any' && feature.target !== ownerType) {
      return res.status(400).json({ success: false, message: `Feature target '${feature.target}' is not compatible with ownerType '${ownerType}'` });
    }

    
    // Validate the owner exists
    const ownerModelByType = { artist: db.artist, venue: db.venue, event: db.event };
    const model = ownerModelByType[ownerType];
    if (!model) return res.status(400).json({ success: false, message: 'Unsupported ownerType' });
    const owner = await model.findByPk(ownerId);
    if (!owner) return res.status(404).json({ success: false, message: `Owner not found for ${ownerType} with id ${ownerId}` });

    const startsAt = startAt ? new Date(startAt) : new Date();
    const days = Number(durationDays || 7);
    if (!Number.isFinite(days) || days < 1) return res.status(400).json({ success: false, message: 'durationDays must be >= 1' });
    const endsAt = new Date(startsAt.getTime() + days * 24 * 60 * 60 * 1000);

    const purchase = await db.purchased_feature.create({
      owner_type: ownerType,
      owner_id: ownerId,
      feature_id: feature.id,
      status: 'active',
      starts_at: startsAt,
      ends_at: endsAt,
      price_paid: pricePaid != null ? Number(pricePaid) : feature.default_price,
      metadata: { currency, duration_days: days },
    });
    res.status(201).json({ success: true, data: purchase });
  } catch (e) {
    res.status(500).json({ success: false, message: e.message });
  }
});

router.get('/purchases', async (req, res) => {
  try {
    const { ownerType, ownerId, featureKey, active } = req.query;
    const where = {};
    if (ownerType) where.owner_type = ownerType;
    if (ownerId) where.owner_id = ownerId;
    if (active === '1' || active === 'true') {
      const now = new Date();
      where.status = 'active';
      where.starts_at = { [db.Sequelize.Op.lte]: now };
      where[db.Sequelize.Op.or] = [{ ends_at: null }, { ends_at: { [db.Sequelize.Op.gte]: now } }];
    }
    const include = [];
    if (featureKey) include.push({ model: db.paid_feature, as: 'feature', where: { key: featureKey } });
    else include.push({ model: db.paid_feature, as: 'feature' });
    const rows = await db.purchased_feature.findAll({ where, include, order: [['starts_at','DESC']] });
    res.json({ success: true, data: rows });
  } catch (e) {
    res.status(500).json({ success: false, message: e.message });
  }
});

module.exports = router;
