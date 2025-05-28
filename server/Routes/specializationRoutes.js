const express = require('express');
const router = express.Router();
const { createSpecializationHandler,getSpecializationsHandler } = require('../Controllers/specializationController');

router.post('/addSpecialization',createSpecializationHandler);
router.get('/specializations', getSpecializationsHandler);

module.exports = router;