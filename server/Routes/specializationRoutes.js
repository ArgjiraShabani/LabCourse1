const express = require('express');
const router = express.Router();
const { getSpecializationsHandler } = require('../Controllers/specializationController');

router.get('/specializations', getSpecializationsHandler);

module.exports = router;