const express= require('express');
const router=express.Router();
const multer=require('multer');
const path=require('path');
const {createDoctorHandler, updateDoctorHandler,getAllDoctorsHandlers,
    deleteDoctorHandler,getDoctorByIdHandler
}=require('../Controllers/doctorController');


const userStorage=multer.diskStorage({
  destination: (req,file,cb)=>{
    cb(null,'public/userUploads');
  },
  filename: (req,file,cb)=>{
    cb(null,'user_' + Date.now()+ path.extname(file.originalname));
  },
});
const userUpload=multer({storage: userStorage});

router.post('/doctors',userUpload.single('img'),createDoctorHandler);
router.put('/updateDoctors/:id',userUpload.single('img'),updateDoctorHandler);
router.get('/viewDoctors',getAllDoctorsHandlers);
router.delete('/deleteDoctor/:doctor_id',deleteDoctorHandler);
router.get('/doctorId/:doctor_id',getDoctorByIdHandler);


module.exports=router;