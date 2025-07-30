const express = require('express');
const router = express.Router();

const {
  getServicesHandler,
  createServiceHandler,
  updateServiceHandler,
  deleteServiceHandler
} = require('../Controllers/servicesController');

router.get('/services', getServicesHandler);
router.post('/services', createServiceHandler);
router.put('/services/:id', updateServiceHandler);
router.delete('/services/:id', deleteServiceHandler);

module.exports = router;