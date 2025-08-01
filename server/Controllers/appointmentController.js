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
      return res
        .status(500)
        .json({ error: "Error while booking the appointment." });
    }
    res.json({ message: "Appointment booked successfully!" });
  });
};

module.exports = {
  getServices,
  getDoctors,
  getBookedSlots,
  bookAppointment,
};
