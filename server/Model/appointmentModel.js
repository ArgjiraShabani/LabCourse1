const db = require("../db");

// Merr të gjithë shërbimet
const getAllServices = (callback) => {
  db.query("SELECT * FROM services", callback);
};

// Merr mjekët për një departament
const getDoctorsByDepartment = (departmentId, callback) => {
  const sql = `
    SELECT doctor_id, first_name, last_name 
    FROM doctors 
    WHERE department_id = ?`;
  db.query(sql, [departmentId], callback);
};

// Merr oraret e zëna për një mjek në një ditë
const getBookedSlots = (doctorId, date, callback) => {
  const sql = `
    SELECT TIME(appointment_datetime) AS time
    FROM appointments
    WHERE doctor_id = ? AND DATE(appointment_datetime) = ?`;
  db.query(sql, [doctorId, date], callback);
};

// Krijon një takim të ri
const createAppointment = (data, callback) => {
  const sql = `
    INSERT INTO appointments 
    (patient_id, doctor_id, service_id, name, lastname, appointment_datetime, purpose, status)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;

  const {
    patient_id,
    doctor_id,
    service_id,
    name,
    lastname,
    appointment_datetime,
    purpose,
    status,
  } = data;

  db.query(
    sql,
    [
      patient_id,
      doctor_id,
      service_id,
      name,
      lastname,
      appointment_datetime,
      purpose,
      status || "pending",
    ],
    callback
  );
};

module.exports = {
  getAllServices,
  getDoctorsByDepartment,
  getBookedSlots,
  createAppointment,
};
