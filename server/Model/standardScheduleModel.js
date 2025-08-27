const db = require("../db");

const getAllSchedules = (callback) => {
  const query = `
    SELECT ss.schedule_id, ss.doctor_id, CONCAT(d.first_name, " ", d.last_name) AS doctor_name, 
           ss.weekday, ss.start_time, ss.end_time
    FROM standard_schedules ss
    JOIN doctors d ON ss.doctor_id = d.doctor_id
    WHERE d.is_active = 1
  `;
  db.query(query, (err, results) => {
    callback(err, results);
  });
};

const getSchedulesByDoctorId = (doctor_id, callback) => {
  const query = `
    SELECT schedule_id, doctor_id, weekday, start_time, end_time 
    FROM standard_schedules 
    WHERE doctor_id = ?
  `;
  db.query(query, [doctor_id], (err, results) => {
    callback(err, results);
  });
};

const addSchedule = (doctor_id, weekday, start_time, end_time, callback) => {
  const query = `
    INSERT INTO standard_schedules (doctor_id, weekday, start_time, end_time)
    VALUES (?, ?, ?, ?)
  `;
  db.query(query, [doctor_id, weekday, start_time, end_time], (err, result) => {
    callback(err, result);
  });
};

const updateSchedule = (schedule_id, start_time, end_time, callback) => {
  const query = `
    UPDATE standard_schedules 
    SET start_time = ?, end_time = ?
    WHERE schedule_id = ?
  `;
  db.query(query, [start_time, end_time, schedule_id], (err, result) => {
    callback(err, result);
  });
};

const deleteSchedule = (schedule_id, callback) => {
  const query = `
    DELETE FROM standard_schedules 
    WHERE schedule_id = ?
  `;
  db.query(query, [schedule_id], (err, result) => {
    callback(err, result);
  });
};

const deleteDaySchedulesByDoctor = (doctor_id, weekday, callback) => {
  const query = `
    DELETE FROM standard_schedules 
    WHERE doctor_id = ? AND weekday = ?
  `;
  db.query(query, [doctor_id, weekday], (err, result) => {
    callback(err, result);
  });
};

module.exports = {
  getAllSchedules,
  getSchedulesByDoctorId,
  addSchedule,
  updateSchedule,
  deleteSchedule,
  deleteDaySchedulesByDoctor, 
};