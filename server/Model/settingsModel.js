const db = require('../db');

exports.getSettings = async () => {
  try {
    const [rows] = await db.promise().query("SELECT * FROM settings LIMIT 1");
    if (rows.length === 0) {
      const [insert] = await db.promise().query(
        "INSERT INTO settings (booking_days_limit, appointment_duration_minutes) VALUES (?, ?)",
        [30, 30] 
      );
      return { settings_id: insert.insertId, booking_days_limit: 30, appointment_duration_minutes: 30 };
    }
    return rows[0];
  } catch (err) {
    throw err;
  }
};

exports.updateSettings = async (booking_days_limit, appointment_duration_minutes) => {
  try {
    const settings = await this.getSettings();
    const [result] = await db.promise().query(
      "UPDATE settings SET booking_days_limit = ?, appointment_duration_minutes = ? WHERE settings_id = ?",
      [booking_days_limit, appointment_duration_minutes, settings.settings_id]
    );
    return result;
  } catch (err) {
    throw err;
  }
};
