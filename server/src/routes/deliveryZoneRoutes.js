const express = require('express');
const { getZones, createZone, updateZone, deleteZone } = require('../controllers/deliveryZoneController');
const { protect, admin } = require('../middleware/authMiddleware');
const router = express.Router();

router.route('/')
  .get(getZones)
  .post(protect, admin, createZone);

router.route('/:id')
  .put(protect, admin, updateZone)
  .delete(protect, admin, deleteZone);

module.exports = router;