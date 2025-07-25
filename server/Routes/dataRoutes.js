const express = require('express');
const router = express.Router();
const { getRolesHandler,
     getGenderHandler,
     setGenderHandler,
     setBloodHandler,
     getStatusHandler,
     updateStatusHandler,
     getBloodHandler,
     deleteGenderHandler,
     deleteBloodHandler,
     updateBloodHandler,
     updateGenderHandler,
     setRoleHandler,
     getFeedbacksAdminHandler,
     updateFeedbacksAdminHandler,
     } = require('../Controllers/dataController');

router.get('/roles', getRolesHandler);
router.get('/gender', getGenderHandler);
router.post('/addGender',setGenderHandler);
router.post('/addBlood',setBloodHandler);
router.get('/status',getStatusHandler);
router.put('/updateStatus',updateStatusHandler);
router.put('/updateDataBlood',updateBloodHandler);
router.put('/updateDataGender',updateGenderHandler);
router.get('/blood',getBloodHandler);
router.delete('/deleteDataGender',deleteGenderHandler);
router.delete('/deleteDataBlood',deleteBloodHandler);
router.post('/addRole',setRoleHandler);
router.get('/feedbacksAdmin',getFeedbacksAdminHandler);
router.patch('/updateFeedback/:id',updateFeedbacksAdminHandler);




module.exports = router;