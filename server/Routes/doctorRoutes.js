const express= require('express');
const router=express.Router();
const multer=require('multer');
const path=require('path');
const {createDoctorHandler, updateDoctorHandler,getAllDoctorsHandlers,
    deleteDoctorHandler,getDoctorByIdHandler,getAppointments,getStaffHandler,getAllActiveDoctorsHandler
}=require('../Controllers/doctorController');
const {authenticateToken}=require("../middlewares.js");


const userStorage=multer.diskStorage({
  destination: (req,file,cb)=>{
    cb(null,'public/userUploads');
  },
  filename: (req,file,cb)=>{
    cb(null,'user_' + Date.now()+ path.extname(file.originalname));
  },
});
const userUpload=multer({storage: userStorage});

router.post('/doctors',authenticateToken, userUpload.single('img'),createDoctorHandler);
router.put('/updateDoctors/:doctor_id',authenticateToken,userUpload.single('img'),updateDoctorHandler);
router.get('/viewDoctors',authenticateToken, getAllDoctorsHandlers);
router.delete('/deleteDoctor/:doctor_id',authenticateToken,deleteDoctorHandler);
router.get('/doctorId',authenticateToken,getDoctorByIdHandler);
router.get('/appointments',authenticateToken,getAppointments);
router.get('/staff',getStaffHandler);
router.get('/allDoctors', getAllActiveDoctorsHandler); 




module.exports=router;