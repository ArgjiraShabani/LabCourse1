const db = require('../db');

const getAllWeeklySchedules = (callback) => {
  const query = `
    SELECT ws.schedule_id, ws.doctor_id, 
           CONCAT(d.first_name, ' ', d.last_name) AS doctor_name,
           ws.date, ws.start_time, ws.end_time, ws.is_custom,
           DAYNAME(ws.date) as weekday
    FROM weekly_schedules ws
    JOIN doctors d ON ws.doctor_id = d.doctor_id
    ORDER BY ws.doctor_id, ws.date;
  `;
  db.query(query, callback);
};

const addOrUpdateWeeklySchedule = (data, callback) => {
  const { doctor_id, date, start_time, end_time, is_custom } = data;
  const query = `
    INSERT INTO weekly_schedules (doctor_id, date, start_time, end_time, is_custom)
    VALUES (?, ?, ?, ?, ?)
    ON DUPLICATE KEY UPDATE
      start_time = VALUES(start_time),
      end_time = VALUES(end_time),
      is_custom = VALUES(is_custom)
  `;
  db.query(query, [doctor_id, date, start_time, end_time, is_custom || false], callback);
};

const updateWeeklySchedule = (scheduleId, data, callback) => {
  const { start_time, end_time, is_custom } = data;
  const query = `
    UPDATE weekly_schedules
    SET start_time = ?, end_time = ?, is_custom = ?
    WHERE schedule_id = ?
  `;
  db.query(query, [start_time, end_time, is_custom || false, scheduleId], callback);
};

const deleteWeeklySchedule = (scheduleId, callback) => {
  const query = "DELETE FROM weekly_schedules WHERE schedule_id = ?";
  db.query(query, [scheduleId], callback);
};

const getWeeklyScheduleByDoctor = (doctorId, callback) => {
  const query = `
    SELECT schedule_id, doctor_id, date, start_time, end_time, is_custom
    FROM weekly_schedules
    WHERE doctor_id = ?
    ORDER BY date
  `;
  db.query(query, [doctorId], callback);
};

module.exports = {
  getAllWeeklySchedules,
  addOrUpdateWeeklySchedule,
  updateWeeklySchedule,
  deleteWeeklySchedule,
  getWeeklyScheduleByDoctor,
};