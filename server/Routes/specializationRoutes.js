const express = require('express');
const router = express.Router();
const { createSpecializationHandler,getSpecializationsHandler , deleteSpecializationHandler, updateSpecializationHandler} = require('../Controllers/specializationController');

router.post('/addSpecialization',createSpecializationHandler);
router.get('/specializations', getSpecializationsHandler);
router.delete('/deleteSpecialization/:specialization_id', deleteSpecializationHandler);
router.put('/updateSpecialization/:specialization_id', updateSpecializationHandler);
module.exports = router;