const express = require("express");
const router = express.Router();
const auditController = require("../Controllers/auditController");

router.get("/audit-log", auditController.getAllAuditLogs);

module.exports = router;