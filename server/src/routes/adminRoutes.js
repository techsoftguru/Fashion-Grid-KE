const express = require('express');
const { getUsers, getAllOrders, updateOrderStatus, getAnalytics } = require('../controllers/adminController');
const { protect, admin } = require('../middleware/authMiddleware');
const router = express.Router();

router.get('/users', protect, admin, getUsers);
router.get('/orders', protect, admin, getAllOrders);
router.put('/orders/:id', protect, admin, updateOrderStatus);
router.get('/analytics', protect, admin, getAnalytics);

module.exports = router;