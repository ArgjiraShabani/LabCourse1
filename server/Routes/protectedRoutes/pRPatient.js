const express = require("express");
const { authenticateToken, authorizeRoles } = require("../../middlewares");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const router = express.Router();

/*const app = express();*/

/*
app.use(express.json());
app.use(require("cookie-parser")());
*/
/*
router.get("/adminDashboard/:id", authenticateToken, authorizeRoles("admin"), (req, res) => {
  res.json({ message: "Welcome Admin", user: req.user });
});
*/

router.get("/homePagePatient/:id", authenticateToken, authorizeRoles("patient"), (req, res) => {
  res.json({ message: "Welcome Patient", user: req.user });
});

router.get("/myAppointments", authenticateToken, authorizeRoles("patient"), (req, res) => {
  res.json({ message: "Welcome Patient", user: req.user });
});

router.get("/BookAppointments", authenticateToken, authorizeRoles("patient"), (req, res) => {
  res.json({ message: "Welcome Patient", user: req.user });
});

router.get("/myprofile/:id", authenticateToken, authorizeRoles("patient"), (req, res) => {
  res.json({ message: "Welcome Patient", user: req.user });
});

router.get("/feedbacksPatient/:id", authenticateToken, authorizeRoles("patient"), (req, res) => {
  res.json({ message: "Welcome Patient", user: req.user });
});

router.get("/staff/:id", authenticateToken, authorizeRoles("patient"), (req, res) => {
  res.json({ message: "Welcome Patient", user: req.user });
});

router.get("/BookAppointment", authenticateToken, authorizeRoles("patient"), (req, res) => {
  res.json({ message: "Welcome Patient", user: req.user });
});







router.get("/staff/:id", authenticateToken, authorizeRoles("doctor"), (req, res) => {
  res.json({ message: "Welcome Doctor", user: req.user });
});

module.exports = router;

