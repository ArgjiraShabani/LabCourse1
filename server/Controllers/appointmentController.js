const appointmentModel = require("../Model/appointmentModel");
const auditModel = require("../Model/auditModel");

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
  const user = req.user;

  appointmentModel.createAppointment(data, (err, result) => {
    if (err) {
      console.error("Error during INSERT:", err);
      return res.status(500).json({ error: "Error while booking the appointment." });
    }

    if (user.role === 'admin') {
      auditModel.createLog({
        admin_id: user.id,
        table_name: "appointments",
        record_id: result.insertId,
        action: "INSERT",
        description: `Admin booked new appointment ID ${result.insertId} for patient ${data.patient_id}`
      }, (err) => {
        if (err) console.error("Error logging audit:", err);
      });
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
  const adminId = req.user.id; 
  appointmentModel.deleteAppointment(appointmentId, (err, result) => {
    if (err) {
      console.error("Error while deleting the appointment:", err);
      return res.status(500).json({ error: "The appointment was not deleted." });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Appointment not found." });
    }

    if (req.user.role === 'admin') {
  auditModel.createLog({
    admin_id: req.user.id,
    table_name: "appointments",
    record_id: appointmentId,
    action: "DELETE",
    description: `Admin deleted appointment ID ${appointmentId}`
  }, (err) => {
    if (err) console.error("Error logging audit:", err);
  });
}


    res.json({ message: "Appointment deleted successfully." });
  });
};


const getMyAppointments = (req, res) => {
  if (!req.user) {
    return res.status(401).json({ error: "Not logged in" });
  }

  const patientId = req.user.id;

  appointmentModel.getAppointmentsByPatient(patientId, (err, results) => {
    if (err) {
      console.error("Error fetching appointments:", err);
      return res.status(500).json({ error: "Internal server error" });
    }
    res.json({ user: req.user, appointments: results });
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

      const updatedAppointment = { ...results[0], status }; 
      res.json({ message: "Appointment status updated successfully.", appointment: updatedAppointment });
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

const updateAppointmentAdminHandler = (req, res) => {
  const appointmentId = req.params.id;
  const data = req.body; 
  const adminId = req.user.id;

  appointmentModel.getAppointmentById(appointmentId, (err, results) => {
    if (err) return res.status(500).json({ error: "Server error" });
    if (results.length === 0) return res.status(404).json({ error: "Appointment not found" });

    const oldAppointment = results[0];

    appointmentModel.getServiceById(oldAppointment.service_id, (err, oldService) => {
      if (err) return res.status(500).json({ error: "Server error" });

      const getNewService = (callback) => {
        if (data.service_id) {
          appointmentModel.getServiceById(data.service_id, (err, newService) => {
            if (err) return res.status(500).json({ error: "Server error" });
            callback(newService);
          });
        } else {
          callback(oldService);
        }
      };

      appointmentModel.getDoctorById(oldAppointment.doctor_id, (err, oldDoctor) => {
        if (err) return res.status(500).json({ error: "Server error" });

        const getNewDoctor = (callback) => {
          if (data.doctor_id) {
            appointmentModel.getDoctorById(data.doctor_id, (err, newDoctor) => {
              if (err) return res.status(500).json({ error: "Server error" });
              callback(newDoctor);
            });
          } else {
            callback(oldDoctor);
          }
        };

        getNewService((newService) => {
          getNewDoctor((newDoctor) => {
            appointmentModel.updateAppointmentByAdmin(appointmentId, data, (err, result) => {
              if (err) return res.status(500).json({ error: "Error updating appointment." });
              if (result.affectedRows === 0) return res.status(404).json({ error: "Appointment not found." });

              const oldTime = new Date(oldAppointment.appointment_datetime).toLocaleTimeString("en-GB", { hour: '2-digit', minute: '2-digit' });
              const newTime = data.appointment_datetime ? new Date(data.appointment_datetime).toLocaleTimeString("en-GB", { hour: '2-digit', minute: '2-digit' }) : oldTime;

              const oldDate = new Date(oldAppointment.appointment_datetime).toLocaleDateString("en-GB");
              const newDate = data.appointment_datetime ? new Date(data.appointment_datetime).toLocaleDateString("en-GB") : oldDate;

              const descriptionLines = [
                `time: ${oldTime} updated to ${newTime}`,
                `date: ${oldDate} updated to ${newDate}`
              ];

              if (oldAppointment.service_id && data.service_id && oldAppointment.service_id !== data.service_id) {
                descriptionLines.push(`service: ${oldService.service_name} updated to ${newService.service_name}`);
              }

              if (oldAppointment.doctor_id && data.doctor_id && oldAppointment.doctor_id !== data.doctor_id) {
                descriptionLines.push(`doctor: ${oldDoctor.first_name} ${oldDoctor.last_name} updated to ${newDoctor.first_name} ${newDoctor.last_name}`);
              }

              const description = descriptionLines.join("\n");

              auditModel.createLog({
                admin_id: adminId,
                table_name: "appointments",
                record_id: appointmentId,
                action: "UPDATE",
                description
              }, (err) => {
                if (err) console.error("Error logging audit:", err);
              });

              res.json({ message: "Appointment updated successfully!" });
            });
          });
        });

      });

    });

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
  getAppointmentById,
  updateAppointmentAdminHandler
};