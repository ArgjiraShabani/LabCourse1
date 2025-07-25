const express = require("express");
const { authenticateToken, authorizeRoles } = require("../../middlewares");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const router = express.Router();
/*
app.use(express.json());
app.use(require("cookie-parser")());
const app = express();
*/


router.get("/adminDashboard/:id", authenticateToken, authorizeRoles("admin"), (req, res) => {
  res.json({ message: "Welcome Admin", user: req.user });
});



module.exports = router;