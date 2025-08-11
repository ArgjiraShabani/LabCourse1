const express = require("express");
const router = express.Router();
const adminController = require("../Controllers/adminController");

router.get("/stats", adminController.getAdminStats);
router.get("/monthly-appointments", adminController.getMonthlyAppointmentsStats);
module.exports = router;
