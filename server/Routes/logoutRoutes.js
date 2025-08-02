const express = require("express");
const jwt = require("jsonwebtoken");
const db = require("../db"); // Your MySQL connection
const router = express.Router();
require('dotenv').config();

router.post('/logout', (req, res) => {
  res.clearCookie('accessToken', {
    httpOnly: true,
    sameSite: "strict",
    secure: process.env.NODE_ENV === "production",
  });

  res.clearCookie('refreshToken', {
    httpOnly: true,
    sameSite: "strict",
    secure: process.env.NODE_ENV === "production",
  });
  return res.status(200).json({ message: 'Logged out successfully' });
});

module.exports = router;
