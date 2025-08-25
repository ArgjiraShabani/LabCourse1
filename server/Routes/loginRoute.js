const express = require("express");
const jwt = require("jsonwebtoken");
const db = require("../db"); // Your MySQL connection
const router = express.Router();
const bcrypt = require("bcrypt");
require('dotenv').config();


// Login route
router.post("/login", (req, res) => {
  const { email, password } = req.body;

  // Patient login check
  const patientQuery = `
    SELECT patients.patient_id AS id, patients.password, roles.role_name AS role
    FROM patients
    INNER JOIN roles ON roles.role_id = patients.role_id
    INNER JOIN status ON status.status_id = patients.status_id
    WHERE patients.email = ? AND status.status_name = 'active'
  `;

  db.query(patientQuery, [email], (err, data) => {
    if (err) return res.status(500).json("Database error (patients)");

    if (data.length > 0) {
      const user = data[0];
      bcrypt.compare(password, user.password).then((match) => {
        if (match) return sendToken(res, user.id, user.role);

        // Check doctor if password doesn't match
        checkDoctor(email, password, res);
      }).catch((err) => {
        return res.status(500).json("Bcrypt error (patients)");
      });
    } else {
      // No patient found, check doctor
      checkDoctor(email, password, res);
    }
  });

   function checkDoctor(email, password, res) {
    const doctorQuery = `
      SELECT doctors.doctor_id AS id, doctors.password, roles.role_name AS role
      FROM doctors
      INNER JOIN roles ON roles.role_id = doctors.role_id
      WHERE doctors.email = ?
    `;

    db.query(doctorQuery, [email], (err, data) => {
      if (err) return res.status(500).json("Database error (doctors)");

       if (data.length > 0) {
      const user = data[0];
      bcrypt.compare(password, user.password).then((match) => {
        if (match) return sendToken(res, user.id, user.role);

        // Check admin if password doesn't match
        checkAdmin(email, password, res);
      }).catch((err) => {
        return res.status(500).json("Bcrypt error (doctors)");
      });
    } else {
      // No doctor found, check admin
      checkAdmin(email, password, res);
    }
  })
};

   function checkAdmin(email, password, res) {
      const adminQuery = `
        SELECT admin.admin_id AS id,admin.password, roles.role_name AS role
        FROM admin
        INNER JOIN roles ON roles.role_id = admin.role_id
        WHERE admin.email = ?
      `;

      db.query(adminQuery, [email], (err, data) => {
        if (err) return res.status(500).json("Database error (admin)");

         if (data.length > 0) {
              const user = data[0];
              bcrypt.compare(password, user.password).then((match) => {
                if (match) return sendToken(res, user.id, user.role);
                return res.status(401).json({ message: "Invalid email or password" });
              }).catch((err) => {
                return res.status(500).json("Bcrypt error (admin)");
              });
            } else {
              // No user found
              return res.status(401).json({ message: "Invalid email or password" });
            }
          });
      };
    });

    



function sendToken(res, id, role) {
  const accessToken = jwt.sign({ id, role }, process.env.JWT_SECRET, {
    expiresIn:24 * 60 * 60 * 1000,
  });

  const refreshToken = jwt.sign({ id, role }, process.env.REFRESH_TOKEN_SECRET, {
    expiresIn: 7 * 24 * 60 * 60 * 1000, // longer-lived
  });

  res.cookie("accessToken", accessToken, {
    httpOnly: true,
    sameSite: "strict",
    secure: process.env.NODE_ENV === "production"
, // Set to true in production with HTTPS
    maxAge: 24 * 60 * 60 * 1000,
  },);

   res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    sameSite: "strict",
    secure: process.env.NODE_ENV === "production",
    maxAge:7 * 24 * 60 * 60 * 1000, // 7 days
  });

  return res.json({ message: "Success", id, role });
};

module.exports = router;
