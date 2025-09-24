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
    SELECT patients.patient_id AS id, patients.password, roles.role_name AS role,patients.isdeleted,status.status_name
    FROM patients
    INNER JOIN roles ON roles.role_id = patients.role_id
    INNER JOIN status ON status.status_id = patients.status_id
    WHERE patients.email = ?
  `;

  db.query(patientQuery, [email], (err, data) => {
    if (err) return res.status(500).json("Database error (patients)");

    if (data.length > 0) {
      const user = data[0];
      if(user.isdeleted===1 || user.status_name=='Inactive'){
        return res.status(403).json({message: "Your account is deactivated. Please contact the administrator"});
      }
      bcrypt.compare(password, user.password).then((match) => {
        if (match) return sendToken(res, user.id, user.role);

        // Check doctor if password doesn't match
        //checkDoctor(email, password, res);
         return res.status(401).json({ message: "Your password is incorrect!" });

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
      SELECT doctors.doctor_id AS id, doctors.password, doctors.is_active, roles.role_name AS role
      FROM doctors
      INNER JOIN roles ON roles.role_id = doctors.role_id
      WHERE doctors.email = ?
    `;

    db.query(doctorQuery, [email], (err, data) => {
      if (err) return res.status(500).json("Database error (doctors)");

       if (data.length > 0) {
      const user = data[0];

      if(user.is_active===0){
        return res.status(403).json({message: "Your account is deactivated. Please contact the administrator"});
      }
      bcrypt.compare(password, user.password).then((match) => {
        if (match) return sendToken(res, user.id, user.role);

        // Check admin if password doesn't match
        //checkAdmin(email, password, res);
        return res.status(401).json({ message: "Your password is incorrect!" });

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
                return res.status(401).json({ message: "Your password is incorrect!" });
              }).catch((err) => {
                return res.status(500).json("Bcrypt error (admin)");
              });
            } else {
              // No user found
              return res.status(401).json({ message: "Invalid email.Please check your email! " });
            }
          });
      };
    });

    



function sendToken(res, id, role) {
  const accessToken = jwt.sign({ id, role }, process.env.JWT_SECRET, {
   expiresIn:'7d',
   
  });

  const refreshToken = jwt.sign({ id, role }, process.env.REFRESH_TOKEN_SECRET, {
   expiresIn: '31d', // longer-lived
   
  });

  res.cookie("accessToken", accessToken, {
    httpOnly: true,
    sameSite: "strict",
    path: '/',
    secure: process.env.NODE_ENV === "production",
    maxAge:1000*60*60*24*7,
  },);

   res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    sameSite: "strict",
    path: '/',
    secure: process.env.NODE_ENV === "production",
    maxAge:1000*60*60*24*31, // 7 days
  });

  return res.json({ message: "Success", id, role });
};

module.exports = router;
