const jwt = require("jsonwebtoken");
const multer = require("multer");
const path = require("path");
require("dotenv").config();
const express=require("express");
const app=express();

const cookieParser = require("cookie-parser");
app.use(cookieParser());



const authenticateToken = (req, res, next) => {
  const accessToken = req.cookies.accessToken;
  const refreshToken = req.cookies.refreshToken;

  // If no access token but refresh token exists, try to issue new one
  if (!accessToken && refreshToken) {
    return tryRefreshToken(req, res, next);
  }

  // Try to verify access token first
  jwt.verify(accessToken, process.env.JWT_SECRET, (err, user) => {
    if (!err) {
      req.user = user;
      return next();
    }

    // If token expired and refresh token exists, try refreshing
    if (err.name === "TokenExpiredError" && refreshToken) {
      return tryRefreshToken(req, res, next);
    }

    return res.status(401).json({ message: "Not authenticated" });
  });
};

function tryRefreshToken(req, res, next) {
  const refreshToken = req.cookies.refreshToken;

  if (!refreshToken) {
    return res.status(401).json({ message: "Refresh token not found" });
  }

  jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, decoded) => {
    if (err) return res.status(403).json({ message: "Invalid refresh token" });

    // Issue new access token
    const newAccessToken = jwt.sign(
      { id: decoded.id, role: decoded.role },
      process.env.JWT_SECRET,
      { expiresIn:'1d'},
    );
      console.log("New access token issued"),


    res.cookie("accessToken", newAccessToken, {
      httpOnly: true,
      sameSite: "strict",
      path: '/',
      secure: process.env.NODE_ENV === "production", // must be false in dev if no HTTPS
      maxAge: 24 * 60 * 60 * 1000
    });
    req.user = decoded;

    return next();
  });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/uploads'); 
  },
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + path.extname(file.originalname);
    cb(null, uniqueName);
  }
});

const upload = multer({ storage });




const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: "Access denied" });
    }
    next();
  };
};

module.exports = { authenticateToken, authorizeRoles, upload };
