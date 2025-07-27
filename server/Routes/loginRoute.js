const express = require("express");
const jwt = require("jsonwebtoken");
const db = require("../db"); // Your MySQL connection
const router = express.Router();
require('dotenv').config();


// Login route
router.post("/login", (req, res) => {
  const { email, password } = req.body;

  // Patient login check
  const patientQuery = `
    SELECT patients.patient_id AS id, roles.role_name AS role
    FROM patients
    INNER JOIN roles ON roles.role_id = patients.role_id
    INNER JOIN status ON status.status_id = patients.status_id
    WHERE patients.email = ? AND patients.password = ? AND status.status_name = 'active'
  `;

  db.query(patientQuery, [email, password], (err, data) => {
    if (err) return res.status(500).json("Database error (patients)");

    if (data.length > 0) {
      return sendToken(res, data[0].id, data[0].role);
    }

    // Doctor login check
    const doctorQuery = `
      SELECT doctors.doctor_id AS id, roles.role_name AS role
      FROM doctors
      INNER JOIN roles ON roles.role_id = doctors.role_id
      WHERE doctors.email = ? AND doctors.password = ?
    `;

    db.query(doctorQuery, [email, password], (err, data) => {
      if (err) return res.status(500).json("Database error (doctors)");

      if (data.length > 0) {
        return sendToken(res, data[0].id, data[0].role);
      }

      // Admin login check
      const adminQuery = `
        SELECT admin.admin_id AS id, roles.role_name AS role
        FROM admin
        INNER JOIN roles ON roles.role_id = admin.role_id
        WHERE admin.email = ? AND admin.password = ?
      `;

      db.query(adminQuery, [email, password], (err, data) => {
        if (err) return res.status(500).json("Database error (admin)");

        if (data.length > 0) {
          return sendToken(res, data[0].id, data[0].role);
        }

        // If no user matched
        return res.status(401).json({ message: "Invalid email or password" });
      });
    });
  });
});



function sendToken(res, id, role) {
  const accessToken = jwt.sign({ id, role }, process.env.JWT_SECRET, {
    expiresIn: "1h",
  });

  const refreshToken = jwt.sign({ id, role }, process.env.REFRESH_TOKEN_SECRET, {
    expiresIn: "7d", // longer-lived
  });

  res.cookie("accessToken", accessToken, {
    httpOnly: true,
    sameSite: "strict",
    secure: process.env.NODE_ENV === "production"
, // Set to true in production with HTTPS
    maxAge: 60 * 60 * 1000,
  },);

   res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    sameSite: "strict",
    secure: process.env.NODE_ENV === "production",
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });

  return res.json({ message: "Success", id, role });
};

module.exports = router;
