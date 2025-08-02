const express = require("express");
const router = express.Router();

const appointmentController = require("../Controllers/appointmentController");
const { authenticateToken, authorizeRoles } = require("../middlewares");

router.get("/services", appointmentController.getServices);
router.get("/doctors/byDepartment/:department_id", appointmentController.getDoctors);

router.get("/appointments/bookedSlots", authenticateToken, appointmentController.getBookedSlots);
router.post("/appointments", authenticateToken, appointmentController.bookAppointment);

router.get("/all-patient-appointments", authenticateToken, authorizeRoles("admin"), appointmentController.getAllAppointments);
router.delete("/all-patient-appointments/:id", authenticateToken, authorizeRoles("admin"), appointmentController.deleteAppointment);

router.get("/my-appointments", authenticateToken, appointmentController.getMyAppointments);
router.delete("/my-appointments/:id", authenticateToken, appointmentController.cancelMyAppointment);
router.put("/my-appointments/:id", authenticateToken, appointmentController.updateMyAppointment);

router.get("/appointments/byPatient", authenticateToken, appointmentController.getAppointmentsByPatientHandler);

module.exports = router;