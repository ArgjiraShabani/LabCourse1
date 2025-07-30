const express = require("express");
const router = express.Router();

const { authenticateToken, authorizeRoles } = require("../middlewares");

const {
  getStandardSchedulesHandler,
  getSchedulesByDoctorHandler,
  addStandardScheduleHandler,
  updateStandardScheduleHandler,
  deleteStandardScheduleHandler,
} = require("../Controllers/standardScheduleController");

router.get(
  "/standardSchedules",
  authenticateToken,
  authorizeRoles("admin"),
  getStandardSchedulesHandler
);

router.get(
  "/standardSchedules/:doctor_id",
  authenticateToken,
  authorizeRoles("admin"),
  getSchedulesByDoctorHandler
);

router.post(
  "/standardSchedules",
  authenticateToken,
  authorizeRoles("admin"),
  addStandardScheduleHandler
);

router.put(
  "/standardSchedules/:schedule_id",
  authenticateToken,
  authorizeRoles("admin"),
  updateStandardScheduleHandler
);

router.delete(
  "/standardSchedules/:schedule_id",
  authenticateToken,
  authorizeRoles("admin"),
  deleteStandardScheduleHandler
);

module.exports = router;
