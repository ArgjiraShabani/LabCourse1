const express = require('express');
const router = express.Router();
const { authenticateToken, authorizeRoles } = require('../../middlewares');
const {getDoctorByIdHandler}= require('../../Controllers/doctorController');



router.get('/doctorDashboard',authenticateToken,authorizeRoles("doctor"), (req, res) => {
  res.json({ message: "Welcome Doctor", user: req.user });
});
router.get('/doctorProfile',authenticateToken,authorizeRoles('doctor'),(req,res)=>{
  res.json({message: "Welcome Doctor", user: req.user});
})
router.get('/doctorId',authenticateToken, authorizeRoles("doctor"),getDoctorByIdHandler);
router.get('/medRecords',authenticateToken, authorizeRoles("doctor"),(req,res)=>{
  res.json({message: "Welcome Doctor", user: req.user});
})
router.get('/docAppointments', authenticateToken,authorizeRoles("doctor"),(req,res)=>{
  res.json({message: "Welcome Doctor", user: req.user});
})



router.get("/DoctorSchedule",authenticateToken,authorizeRoles("doctor"),(req,res)=>{
  res.json({message : "Welcome Doctor", user: req.user});
})

router.get("/Appointment",authenticateToken,authorizeRoles("doctor"),(req,res)=>{
  res.json({message : "Welcome Doctor", user: req.user});
})

module.exports = router;