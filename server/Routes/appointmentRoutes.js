const express = require("express");
const router = express.Router();

const {
  getServices,
  getDoctors,
  getBookedSlots,
  bookAppointment,
} = require("../Controllers/appointmentController");

const { authenticateToken, authorizeRoles } = require("../middlewares");

// Këto nuk kanë nevojë për autentikim
router.get("/services", getServices);
router.get("/doctors/byDepartment/:department_id", getDoctors);

// Këto kërkojnë që përdoruesi të jetë i autentikuar (p.sh. pacient ose mjek)
router.get("/appointments/bookedSlots", authenticateToken, getBookedSlots);
router.post("/appointments", authenticateToken, bookAppointment);

module.exports = router;
