const express= require('express');
const router=express.Router();
const multer=require('multer');
const path=require('path');
const { authenticateToken, authorizeRoles } = require("../middlewares.js");
const {getPatientByIdHandler,
    getAllPatientsHandler,
    deletePatientByIdHandler,
    removePhotoHandler,
    changePasswordHandler,
    updatePatientHandler,
    registerPatientHandler,
    setFeedbacksHandler,
    getFeedbacksPatientHandler,
    deleteFeedbackHandler,
    getPatientForUpdationHandler,
    updatePatientAdminHandler,
    getPatientsForDropdownHandler}=require('../Controllers/patientController');


const userStorage=multer.diskStorage({
  destination: (req,file,cb)=>{
    cb(null,'public/uploads');
  },
  filename: (req,file,cb)=>{
    cb(null,'user_' + Date.now()+ path.extname(file.originalname));
  },
});
const upload=multer({storage: userStorage});

router.get('/infoPatient/:id',authenticateToken,getPatientByIdHandler);
router.get('/patient',authenticateToken,getAllPatientsHandler);
router.delete('/deletePatient/:id',authenticateToken,deletePatientByIdHandler);
router.post('/removePhotoPatient/:id',authenticateToken,removePhotoHandler);
router.patch('/changePassword',authenticateToken,changePasswordHandler);
router.put('/updatePatient/:id',authenticateToken,upload.single('image'),updatePatientHandler);
router.post('/registerPatient',authenticateToken,upload.single('image'),registerPatientHandler);
router.post('/feedbacks',authenticateToken,setFeedbacksHandler);
router.get('/feedbacksPatient/:id',authenticateToken,getFeedbacksPatientHandler);
router.delete('/deleteFeedback/:id',authenticateToken,deleteFeedbackHandler);
router.get('/patientInfoForUpdation/:id',authenticateToken,getPatientForUpdationHandler);
router.put('/updatePatientAdmin/:id',authenticateToken,updatePatientAdminHandler);
router.get('/patients-dropdown', getPatientsForDropdownHandler);
module.exports=router;