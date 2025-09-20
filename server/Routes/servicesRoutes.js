const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middlewares');

const {
  getServicesHandler,
  createServiceHandler,
  updateServiceHandler,
  deleteServiceHandler
} = require('../Controllers/servicesController');

router.get('/services', getServicesHandler);
router.post('/services', authenticateToken, createServiceHandler);
router.put('/services/:id', authenticateToken, updateServiceHandler);
router.delete('/services/:id', authenticateToken, deleteServiceHandler);

module.exports = router;