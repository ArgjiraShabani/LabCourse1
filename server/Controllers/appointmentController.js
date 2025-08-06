const appointmentModel = require("../Model/appointmentModel");

const getServices = (req, res) => {
  appointmentModel.getAllServices((err, results) => {
    if (err) {
      console.error("Error fetching services:", err);
      return res.status(500).send("Error fetching services");
    }
    res.json(results);
  });
};

const getDoctors = (req, res) => {
  const departmentId = req.params.department_id;
  appointmentModel.getDoctorsByDepartment(departmentId, (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: "Database error" });
    }
    res.json(results);
  });
};

const getBookedSlots = (req, res) => {
  const { doctor_id, date } = req.query;
  appointmentModel.getBookedSlots(doctor_id, date, (err, results) => {
    if (err) {
      console.error("Error fetching booked slots:", err);
      return res.status(500).json({ error: "Database error" });
    }
    const bookedTimes = results.map((row) => row.time.slice(0, 5));
    res.json(bookedTimes);
  });
};

const bookAppointment = (req, res) => {
  const data = req.body;
  console.log("Received data:", data);

  appointmentModel.createAppointment(data, (err, result) => {
    if (err) {
      console.error("Error during INSERT:", err);
      return res.status(500).json({ error: "Error while booking the appointment." });
    }
    res.json({ message: "Appointment booked successfully!" });
  });
};

const getAllAppointments = (req, res) => {
  const doctorId = req.query.doctor_id;

  appointmentModel.getAllAppointments(doctorId, (err, results) => {
    if (err) {
      console.error("Error while retrieving the appointments:", err);
      return res.status(500).json({ error: "Unable to retrieve the appointments." });
    }
    res.json(results);
  });
};

const deleteAppointment = (req, res) => {
  const appointmentId = req.params.id;

  appointmentModel.deleteAppointment(appointmentId, (err, result) => {
    if (err) {
      console.error("Error while deleting the appointment:", err);
      return res.status(500).json({ error: "The appointment was not deleted." });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Appointment not found." });
    }

    res.json({ message: "Appointment deleted successfully." });
  });
};

const getMyAppointments = (req, res) => {
  const patientId = req.user.id; 

  if (!patientId) {
    return res.status(400).json({ error: "patient_id is required" });
  }

  appointmentModel.getAppointmentsByPatient(patientId, (err, results) => {
    if (err) {
      console.error("Error fetching appointments:", err);
      return res.status(500).json({ error: "Internal server error" });
    }
    res.json(results);
  });
};


const updateMyAppointment = (req, res) => {
  const appointmentId = req.params.id;
  const patientId = req.user.id; 
  const { name, lastname, purpose } = req.body;

  if (!name || !lastname || !purpose) {
    return res.status(400).json({ error: "All fields are required" });
  }

  appointmentModel.updateAppointment(appointmentId, patientId, { name, lastname, purpose }, (err, result) => {
    if (err) {
      console.error("Error updating appointment:", err);
      return res.status(500).json({ error: "Failed to update appointment" });
    }
    if (result === null) {
      return res.status(403).json({ error: "Unauthorized or appointment not found" });
    }
    res.json({ message: "Appointment updated successfully" });
  });
};


const cancelMyAppointment = (req, res) => {
  const appointmentId = req.params.id;

  appointmentModel.deleteAppointment(appointmentId, (err, result) => {
    if (err) {
      console.error("Error deleting appointment:", err);
      return res.status(500).json({ error: "Failed to delete appointment" });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Appointment not found" });
    }
    res.json({ message: "Appointment deleted successfully" });
  });
};

const getAppointmentsByPatientHandler = (req, res) => {
  const userId = req.user.id;

  console.log("Fetching appointments for patient ID:", userId);

  appointmentModel.getAppointmentsByPatient(userId, (err, results) => {
    if (err) {
      console.error("Error fetching patient appointments:", err);
      return res.status(500).json({ error: "Database error" });
    }

    if (results.length === 0) {
      return res.status(404).json({ message: "No appointments found." });
    }

    res.json(results);
  });
};

const updateAppointmentStatus = (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  console.log("Request to update appointment ID:", id);
  console.log("New status received:", status);

  if (!status) {
    return res.status(400).json({ error: "Status is required." });
  }

  appointmentModel.getAppointmentById(id, (err, results) => {
    if (err) return res.status(500).json({ error: "Server error" });
    if (!results.length) return res.status(404).json({ error: "Appointment not found" });

    appointmentModel.updateAppointmentStatus(id, status, (err) => {
      if (err) return res.status(500).json({ error: "Unable to update appointment status." });
      res.json({ message: "Appointment status updated successfully." });
    });
  });
};
const getDoctorAppointments = (req, res) => {
  const doctorId = req.user.id;

  appointmentModel.getAllAppointments(doctorId, (err, results) => {
    if (err) {
      console.error("Error fetching doctor appointments:", err);
      return res.status(500).json({ error: "Internal server error" });
    }
    res.json(results);
  });
};

const getAppointmentById = (req, res) => {
  const appointmentId = req.params.id;

  appointmentModel.getAppointmentById(appointmentId, (err, results) => {
    if (err) {
      console.error("Error fetching appointment by ID:", err);
      return res.status(500).json({ error: "Server error" });
    }

    if (results.length === 0) {
      return res.status(404).json({ error: "Appointment not found" });
    }

    res.json(results[0]); 
  });
};

module.exports = {
  getServices,
  getDoctors,
  getBookedSlots,
  bookAppointment,
  getAllAppointments,
  deleteAppointment, 
  getMyAppointments,
  updateMyAppointment,
  cancelMyAppointment,
  getAppointmentsByPatientHandler, 
  updateAppointmentStatus,
  getDoctorAppointments,
  getAppointmentById
};