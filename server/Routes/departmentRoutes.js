const express = require('express');
const router = express.Router();
const { getDepartmentsHandler } = require('../Controllers/departmentController');

router.get('/departments', getDepartmentsHandler);

module.exports = router;