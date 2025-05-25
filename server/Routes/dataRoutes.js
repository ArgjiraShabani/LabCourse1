const express = require('express');
const router = express.Router();
const { getRolesHandler, getGenderHandler } = require('../Controllers/dataController');

router.get('/roles', getRolesHandler);
router.get('/gender', getGenderHandler);

module.exports = router;