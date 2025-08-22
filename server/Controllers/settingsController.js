const db = require('../db');

const Settings = require("../Model/settingsModel");

exports.getSettings = (req, res) => {
  db.query("SELECT * FROM settings LIMIT 1", (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    if (result.length === 0) {
      db.query("INSERT INTO settings (booking_days_limit) VALUES (30)", (err2, result2) => {
        if (err2) return res.status(500).json({ error: err2.message });
        db.query("SELECT * FROM settings LIMIT 1", (err3, finalResult) => {
          if (err3) return res.status(500).json({ error: err3.message });
          res.json(finalResult[0]);
        });
      });
    } else {
      res.json(result[0]);
    }
  });
};

exports.updateSettings = (req, res) => {
  const { booking_days_limit } = req.body;

  if (booking_days_limit === undefined || booking_days_limit === null) {
    return res.status(400).json({ error: "booking_days_limit is required" });
  }

  db.query("SELECT * FROM settings LIMIT 1", (err, result) => {
    if (err) return res.status(500).json({ error: err.message });

    if (result.length === 0) {
      db.query(
        "INSERT INTO settings (booking_days_limit) VALUES (?)",
        [booking_days_limit],
        (err2) => {
          if (err2) return res.status(500).json({ error: err2.message });
          res.json({ message: "Settings created successfully!" });
        }
      );
    } else {
      db.query(
        "UPDATE settings SET booking_days_limit = ? WHERE settings_id = ?",
        [booking_days_limit, result[0].settings_id],
        (err2) => {
          if (err2) return res.status(500).json({ error: err2.message });
          res.json({ message: "Settings updated successfully!" });
        }
      );
    }
  });
};