const express = require('express');
const router = express.Router();
const { authenticateToken, authorizeRoles } = require('../../middlewares');



router.get('/doctorDashboard',authenticateToken,authorizeRoles("doctor"), (req, res) => {
  res.json({ message: "Welcome Doctor", user: req.user });
});
router.get('/docProfile',authenticateToken, authorizeRoles("doctor"),(req,res)=>{
  res.json({message: "Welcome Doctor", user: req.user});
})
router.get('/medRecords',authenticateToken, authorizeRoles("doctor"),(req,res)=>{
  res.json({message: "Welcome Doctor", user: req.user});
})
router.get('/docAppointments', authenticateToken,authorizeRoles("doctor"),(req,res)=>{
  res.json({message: "Welcome Doctor", user: req.user});
})



router.get("/DoctorSchedule",authenticateToken,authorizeRoles("doctor"),(req,res)=>{
  res.json({message : "Welcome Doctor", user: req.user});
})

module.exports = router;