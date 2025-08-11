const express = require('express');
const router = express.Router();
const { createSpecializationHandler,getSpecializationsHandler , deleteSpecializationHandler, updateSpecializationHandler} = require('../Controllers/specializationController');
const {authenticateToken,authorizeRoles}= require('../middlewares');

router.post('/addSpecialization',authenticateToken,createSpecializationHandler);
router.get('/specializations',authenticateToken, getSpecializationsHandler);
router.delete('/deleteSpecialization/:specialization_id',authenticateToken, deleteSpecializationHandler);
router.put('/updateSpecialization/:specialization_id',authenticateToken, updateSpecializationHandler);
module.exports = router;