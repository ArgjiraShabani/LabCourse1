const db = require('../db');

exports.getSettings = (req, res) => {
  db.query("SELECT * FROM settings LIMIT 1", (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    if (result.length === 0) {
      db.query(
        "INSERT INTO settings (booking_days_limit, appointment_duration_minutes) VALUES (?, ?)",
        [30, 30],
        (err2) => {
          if (err2) return res.status(500).json({ error: err2.message });

          db.query("SELECT * FROM settings LIMIT 1", (err3, finalResult) => {
            if (err3) return res.status(500).json({ error: err3.message });
            res.json(finalResult[0]);
          });
        }
      );
    } else {
      res.json(result[0]);
    }
  });
};

exports.updateSettings = (req, res) => {
  const { booking_days_limit, appointment_duration_minutes } = req.body;

  db.query("SELECT * FROM settings LIMIT 1", (err, result) => {
    if (err) return res.status(500).json({ error: err.message });

    if (result.length === 0) {
      db.query(
        "INSERT INTO settings (booking_days_limit, appointment_duration_minutes) VALUES (?, ?)",
        [
          booking_days_limit ?? 30, 
          appointment_duration_minutes ?? 30
        ],
        (err2) => {
          if (err2) return res.status(500).json({ error: err2.message });
          res.json({ message: "Settings created successfully!" });
        }
      );
    } else {
      const current = result[0];
      const newBookingDaysLimit = booking_days_limit ?? current.booking_days_limit;
      const newAppointmentDuration = appointment_duration_minutes ?? current.appointment_duration_minutes;

      db.query(
        "UPDATE settings SET booking_days_limit = ?, appointment_duration_minutes = ? WHERE settings_id = ?",
        [newBookingDaysLimit, newAppointmentDuration, current.settings_id],
        (err2) => {
          if (err2) return res.status(500).json({ error: err2.message });
          res.json({ message: "Settings updated successfully!" });
        }
      );
    }
  });
};