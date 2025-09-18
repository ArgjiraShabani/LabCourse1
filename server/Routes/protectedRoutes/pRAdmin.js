const express = require("express");
const { authenticateToken, authorizeRoles } = require("../../middlewares");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const router = express.Router();
/*
app.use(express.json());
app.use(require("cookie-parser")());
const app = express();
*/

router.get("/adminDashboard", authenticateToken, authorizeRoles("admin"), (req, res) => {
  res.json({ message: "Welcome Admin", user: req.user });
});

router.get("/patient", authenticateToken, authorizeRoles("admin"), (req, res) => {
  res.json({ message: "Welcome Admin", user: req.user });
});

router.get("/FeedbacksAdmin", authenticateToken, authorizeRoles("admin"), (req, res) => {
  res.json({ message: "Welcome Admin", user: req.user });
});

router.get("/updateData", authenticateToken, authorizeRoles("admin"), (req, res) => {
  res.json({ message: "Welcome Admin", user: req.user });
});

router.get("/ManageSchedule",authenticateToken,authorizeRoles("admin","doctor"),(req,res)=>{
  res.json({message : "Welcome Admin", user: req.user});
});

router.get("/WeeklySchedule",authenticateToken,authorizeRoles("admin","doctor"),(req,res)=>{
  res.json({message : "Welcome Admin", user: req.user});
})

router.get('/updatePatient/:id',authenticateToken,authorizeRoles('admin'),(req,res)=>{
    res.json({ message: "Welcome Admin", user: req.user });
});

router.get("/PatientAppointments", authenticateToken, authorizeRoles("admin"), (req, res) => {
  res.json({ message: "Welcome Admin", user: req.user });
});

router.get("/ManageDepartments", authenticateToken, authorizeRoles("admin"), (req, res) => {
  res.json({ message: "Welcome Admin to Manage Departments", user: req.user });
});

router.get("/ManageServices", authenticateToken, authorizeRoles("admin"), (req, res) => {
  res.json({ message: "Welcome Admin to Manage Services", user: req.user });
});
router.get("/registerPatient",authenticateToken,authorizeRoles("admin"),(req,res)=>{
  res.json({message : "Welcome Admin", user: req.user});
})

router.get("/addDoc",authenticateToken,authorizeRoles("admin"),(req,res)=>{
  res.json({message : "Welcome Admin", user: req.user});

})
router.get("/updateDoc",authenticateToken,authorizeRoles("admin"),(req,res)=>{
  res.json({message : "Welcome Admin", user: req.user});

})
router.get("/viewDoc",authenticateToken,authorizeRoles("admin"),(req,res)=>{
  res.json({message : "Welcome Admin", user: req.user});

})
router.get("/specialization",authenticateToken,authorizeRoles("admin"),(req,res)=>{
  res.json({message : "Welcome Admin", user: req.user});

})
router.get("/auditLog",authenticateToken,authorizeRoles("admin"),(req,res)=>{
  res.json({message : "Welcome Admin", user: req.user});

})

module.exports = router;