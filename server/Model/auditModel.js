const db = require("../db");

const createLog = (data, callback) => {
  const { admin_id, table_name, record_id, action, description } = data;

  const sql = `
    INSERT INTO audit_log (admin_id, table_name, record_id, action, description, created_at)
    VALUES (?, ?, ?, ?, ?, NOW())
  `;

  db.query(sql, [admin_id, table_name, record_id, action, description], callback);
};

const getAllLogs = (callback) => {
  const sql = `SELECT * FROM audit_log ORDER BY created_at DESC`;
  db.query(sql, callback);
};
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

module.exports = {
  createLog,
  getAllLogs
};