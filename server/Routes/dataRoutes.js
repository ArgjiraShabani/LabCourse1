const express = require('express');
const router = express.Router();
const { authenticateToken, authorizeRoles } = require("../middlewares.js");

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
router.post('/addGender',authenticateToken,setGenderHandler);
router.post('/addBlood',authenticateToken,setBloodHandler);
router.get('/status',authenticateToken,getStatusHandler);
router.put('/updateStatus',authenticateToken,updateStatusHandler);
router.put('/updateDataBlood',authenticateToken,updateBloodHandler);
router.put('/updateDataGender',authenticateToken,updateGenderHandler);
router.get('/blood',getBloodHandler);
router.delete('/deleteDataGender',authenticateToken,deleteGenderHandler);
router.delete('/deleteDataBlood',authenticateToken,deleteBloodHandler);
router.post('/addRole',authenticateToken,setRoleHandler);
router.get('/feedbacksAdmin',authenticateToken,getFeedbacksAdminHandler);
router.patch('/updateFeedback/:id',authenticateToken,updateFeedbacksAdminHandler);




module.exports = router;