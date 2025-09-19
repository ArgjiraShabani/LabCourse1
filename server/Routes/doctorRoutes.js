const express= require('express');
const router=express.Router();
const multer=require('multer');
const path=require('path');
const {
  createDoctorHandler,
  updateDoctorHandler,
  getAllDoctorsHandlers,
  deleteDoctorHandler,
  getDoctorByIdHandler,
  getAppointments,
  getStaffHandler,
  getAllActiveDoctorsHandler,
    getDoctorByIdAdminHandler,
    getAllPatientsHandler,
    getAppointmentNumberHandler,
    updateMyProfileHandler,
    
} = require('../Controllers/doctorController');

const {
  getSchedulesByDoctorHandler,
} = require('../Controllers/standardScheduleController');

const {
  getWeeklyScheduleByDoctorHandler,
} = require('../Controllers/weeklyScheduleController');

const { authenticateToken, authorizeRoles } = require("../middlewares.js");



const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/uploads");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage: storage });

router.post('/doctors',authenticateToken, upload.single('img'),createDoctorHandler);
router.put('/updateDoctors/:doctor_id',authenticateToken, upload.single('img'),updateDoctorHandler);
router.get('/viewDoctors',authenticateToken, getAllDoctorsHandlers);
router.delete('/deleteDoctor/:doctor_id',authenticateToken, deleteDoctorHandler);
//router.get('/doctorId',authenticateToken,  getDoctorByIdHandler);
router.get('/appointments',authenticateToken,getAppointments);
router.get('/staff',getStaffHandler);
router.get('/allDoctors', getAllActiveDoctorsHandler);
router.get('/doctorInfo/:doctor_id', authenticateToken,   getDoctorByIdAdminHandler); 
router.get('/totalPatients',authenticateToken,getAllPatientsHandler);
router.get('/appointmentNumber', authenticateToken,getAppointmentNumberHandler);
router.put('/updateMyProfile',authenticateToken,upload.single("img"),updateMyProfileHandler);



router.get('/standard-schedule', authenticateToken,getSchedulesByDoctorHandler);
router.get('/weekly-schedule', authenticateToken, getWeeklyScheduleByDoctorHandler);



module.exports=router;
