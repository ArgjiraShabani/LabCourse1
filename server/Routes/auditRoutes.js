const express = require("express");
const router = express.Router();
const auditController = require("../Controllers/auditController");
const { authenticateToken, authorizeRoles } = require("../middlewares"); 

router.get(
  "/audit-log",
  authenticateToken,   
  authorizeRoles("admin"),
  auditController.getAllAuditLogs
);

module.exports = router;
