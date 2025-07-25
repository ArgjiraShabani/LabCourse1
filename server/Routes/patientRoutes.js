const express= require('express');
const router=express.Router();
const multer=require('multer');
const path=require('path');
const {getPatientByIdHandler,
    getAllPatientsHandler,
    deletePatientByIdHandler,
    removePhotoHandler,
    changePasswordHandler,
    updatePatientHandler,
    registerPatientHandler,
    setFeedbacksHandler,
    getFeedbacksPatientHandler,
    deleteFeedbackHandler}=require('../Controllers/patientController');


const userStorage=multer.diskStorage({
  destination: (req,file,cb)=>{
    cb(null,'public/uploads');
  },
  filename: (req,file,cb)=>{
    cb(null,'user_' + Date.now()+ path.extname(file.originalname));
  },
});
const upload=multer({storage: userStorage});

router.get('/infoPatient/:id',getPatientByIdHandler);
router.get('/patient',getAllPatientsHandler);
router.delete('/deletePatient/:id',deletePatientByIdHandler);
router.post('/removePhotoPatient/:id',removePhotoHandler);
router.patch('/changePassword',changePasswordHandler);
router.put('/updatePatient/:id',upload.single('image'),updatePatientHandler);
router.post('/registerPatient',upload.single('image'),registerPatientHandler);
router.post('/feedbacks',setFeedbacksHandler);
router.get('/feedbacksPatient/:id',getFeedbacksPatientHandler);
router.delete('/deleteFeedback/:id',deleteFeedbackHandler);

module.exports=router;