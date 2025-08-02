const express = require("express");
const router = express.Router();

const {
  getAllWeeklySchedulesHandler,
  addOrUpdateWeeklyScheduleHandler,
  updateWeeklyScheduleHandler,
  deleteWeeklyScheduleHandler,
  getWeeklyScheduleByDoctorHandler,
} = require("../Controllers/weeklyScheduleController");

const { authenticateToken, authorizeRoles } = require("../middlewares");

router.get(
  "/",
  authenticateToken,
  authorizeRoles("admin", "patient"),
  getAllWeeklySchedulesHandler
);
router.get(
  "/:doctorId",
  authenticateToken,
  authorizeRoles("admin", "patient"),
  getWeeklyScheduleByDoctorHandler
);
router.post(
  "/",
  authenticateToken,
  authorizeRoles("admin"),
  addOrUpdateWeeklyScheduleHandler
);
router.put(
  "/:scheduleId",
  authenticateToken,
  authorizeRoles("admin"),
  updateWeeklyScheduleHandler
);
router.delete(
  "/:scheduleId",
  authenticateToken,
  authorizeRoles("admin"),
  deleteWeeklyScheduleHandler
);

module.exports = router;