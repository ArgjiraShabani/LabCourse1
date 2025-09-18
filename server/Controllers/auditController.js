
const auditModel = require("../Model/auditModel");

const getAllAuditLogs = (req, res) => {
  auditModel.getAllLogs((err, results) => {
    if (err) {
      console.error("Error fetching audit logs:", err);
      return res.status(500).json({ error: "Server error" });
    }
    res.json(results); 
  });
};

module.exports = { getAllAuditLogs };
