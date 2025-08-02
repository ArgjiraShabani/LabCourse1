const db = require("../db");

const getAllServices = (callback) => {
  db.query("SELECT * FROM services", callback);
};

const getDoctorsByDepartment = (departmentId, callback) => {
  const sql = `
    SELECT doctor_id, first_name, last_name 
    FROM doctors 
    WHERE department_id = ?`;
  db.query(sql, [departmentId], callback);
};

const getBookedSlots = (doctorId, date, callback) => {
  const sql = `
    SELECT TIME(appointment_datetime) AS time
    FROM appointments
    WHERE doctor_id = ? AND DATE(appointment_datetime) = ?`;
  db.query(sql, [doctorId, date], callback);
};

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

const getAllAppointments = (doctorId, callback) => {
  let sql = `
    SELECT 
      a.appointment_id AS id,
      a.name AS patient_name,
      a.lastname AS patient_lastname,
      a.appointment_datetime,
      a.purpose,
      a.status,
      CONCAT(p.first_name, ' ', p.last_name) AS booked_by,
      s.service_name,
      CONCAT(d.first_name, ' ', d.last_name) AS doctor_name,
      d.first_name AS doctor_firstname,
      d.last_name AS doctor_lastname
    FROM appointments a
    LEFT JOIN patients p ON a.patient_id = p.patient_id
    LEFT JOIN services s ON a.service_id = s.service_id
    LEFT JOIN doctors d ON a.doctor_id = d.doctor_id
  `;

  const values = [];

  if (doctorId) {
    sql += " WHERE a.doctor_id = ?";
    values.push(doctorId);
  }

  sql += " ORDER BY a.appointment_datetime DESC";

  db.query(sql, values, callback);
};

const deleteAppointment = (appointmentId, callback) => {
  const sql = "DELETE FROM appointments WHERE appointment_id = ?";
  db.query(sql, [appointmentId], callback);
};

const getAppointmentsByPatient = (patientId, callback) => {
  const sql = `
    SELECT 
      a.appointment_id AS id,
      a.name AS patient_name,
      a.lastname AS patient_lastname,
      a.appointment_datetime,
      a.purpose,
      s.service_name,
      d.first_name AS doctor_firstname,
      d.last_name AS doctor_lastname
    FROM appointments a
    LEFT JOIN doctors d ON a.doctor_id = d.doctor_id
    LEFT JOIN services s ON a.service_id = s.service_id
    WHERE a.patient_id = ?
    ORDER BY a.appointment_datetime DESC
  `;
  db.query(sql, [patientId], callback);
};

const updateAppointment = (appointmentId, patientId, data, callback) => {
  const { name, lastname, purpose } = data;

  const checkSql = `
    SELECT * FROM appointments 
    WHERE appointment_id = ? AND patient_id = ?`;

  db.query(checkSql, [appointmentId, patientId], (err, results) => {
    if (err) return callback(err);

    if (results.length === 0) {
      return callback(null, null);
    }

    const updateSql = `
      UPDATE appointments
      SET name = ?, lastname = ?, purpose = ?
      WHERE appointment_id = ? AND patient_id = ?`;

    db.query(
      updateSql,
      [name, lastname, purpose, appointmentId, patientId],
      callback
    );
  });
};

module.exports = {
  getAllServices,
  getDoctorsByDepartment,
  getBookedSlots,
  createAppointment,
  getAllAppointments,
  deleteAppointment,
  getAppointmentsByPatient,
  updateAppointment,
};