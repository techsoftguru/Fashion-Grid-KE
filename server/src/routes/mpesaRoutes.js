const express = require('express');
const { stkPush, mpesaCallback } = require('../controllers/mpesaController');
const { protect } = require('../middleware/authMiddleware');
const router = express.Router();

router.post('/stkpush', protect, stkPush);
router.post('/callback', mpesaCallback); // No auth, called by Safaricom

module.exports = router;