const express = require('express');
const router = express.Router();
const settingsController = require('../Controllers/settingsController');
const { authenticateToken } = require('../middlewares');

router.get('/',authenticateToken, settingsController.getSettings);
router.put('/',authenticateToken, settingsController.updateSettings);

module.exports = router;