const db = require("../db");

const getAllServices = (callback) => {
  const sql = `
    SELECT s.*, d.status_id AS department_status, s.status_id AS service_status
    FROM services s
    JOIN departments d ON s.department_Id = d.department_Id
    WHERE s.status_id = 1
  `;
  db.query(sql, callback);
};




const getDoctorsByDepartment = (departmentId, callback) => {
  const sql = `
    SELECT d.doctor_id, d.first_name, d.last_name,
           dep.status_id AS department_status
    FROM doctors d
    JOIN departments dep ON d.department_id = dep.department_Id
    WHERE d.department_id = ? and is_active=1
  `;
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
      s.status_id AS service_status,       -- statusi i service-it
      d.first_name AS doctor_firstname,
      d.last_name AS doctor_lastname,
      dep.department_name,
      dep.status_id AS department_status   -- statusi i departmentit
    FROM appointments a
    LEFT JOIN doctors d ON a.doctor_id = d.doctor_id
    LEFT JOIN services s ON a.service_id = s.service_id
    LEFT JOIN departments dep ON s.department_Id = dep.department_Id
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

const updateAppointmentStatus = (appointmentId, status, callback) => {
  const sql = "UPDATE appointments SET status = ? WHERE appointment_id = ?";
  db.query(sql, [status, appointmentId], (err, result) => {
    if (err) {
      return callback(err);
    }
    callback(null, result);
  });
};

const getAppointmentById = (appointmentId, callback) => {
  const sql = "SELECT * FROM appointments WHERE appointment_id = ?";
  db.query(sql, [appointmentId], (err, results) => {
    if (err) return callback(err);
    callback(null, results);
  });
};

const getAllAppointmentsByDoctor = (doctorId, callback) => {
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

const updateAppointmentByAdmin = (appointmentId, data, callback) => {
  const {
    patient_id,
    doctor_id,
    service_id,
    name,
    lastname,
    appointment_datetime,
    purpose,
    status
  } = data;

  const sql = `
    UPDATE appointments
    SET 
      patient_id = COALESCE(?, patient_id),
      doctor_id = COALESCE(?, doctor_id),
      service_id = COALESCE(?, service_id),
      name = COALESCE(?, name),
      lastname = COALESCE(?, lastname),
      appointment_datetime = COALESCE(?, appointment_datetime),
      purpose = COALESCE(?, purpose),
      status = COALESCE(?, status)
    WHERE appointment_id = ?
  `;

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
      status,
      appointmentId
    ],
    callback
  );
};

const getServiceById = (serviceId, callback) => {
  const query = "SELECT * FROM services WHERE service_id = ?";
  db.query(query, [serviceId], (err, results) => {
    if (err) return callback(err);
    if (results.length === 0) return callback(null, null); 
    callback(null, results[0]);
  });
};

const getDoctorById = (doctorId, callback) => {
  const query = "SELECT first_name, last_name FROM doctors WHERE doctor_id = ? and is_active=1";
  db.query(query, [doctorId], (err, results) => {
    if (err) return callback(err);
    if (results.length === 0) return callback(null, null);
    callback(null, results[0]);
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
  updateAppointmentStatus,
  getAllAppointmentsByDoctor,
  getAppointmentById,
  updateAppointmentByAdmin,
    getServiceById,
      getDoctorById,
};