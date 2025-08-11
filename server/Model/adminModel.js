const db = require("../db");

const getStats = (callback) => {
  const queries = [
    { key: "roles", query: "SELECT COUNT(*) AS count FROM roles" },
    { key: "patients", query: "SELECT COUNT(*) AS count FROM patients" },
    { key: "doctors", query: "SELECT COUNT(*) AS count FROM doctors" },
    { key: "departments", query: "SELECT COUNT(*) AS count FROM departments" },
    { key: "appointments", query: "SELECT COUNT(*) AS count FROM appointments" },
    { key: "results", query: "SELECT COUNT(*) AS count FROM results" }
  ];

  const stats = {};
  let completed = 0;

  queries.forEach((item) => {
    db.query(item.query, (err, result) => {
      if (err) return callback(err, null);

      stats[item.key] = result[0].count;
      completed++;

      if (completed === queries.length) {
        callback(null, stats);
      }
    });
  });
};

const getMonthlyAppointments = (year, callback) => {
  const query = `
    SELECT 
      MONTH(appointment_datetime) AS month,
      COUNT(*) AS count
    FROM appointments
    WHERE YEAR(appointment_datetime) = ?
    GROUP BY MONTH(appointment_datetime)
    ORDER BY MONTH(appointment_datetime);
  `;

  db.query(query, [year], (err, results) => {
    if (err) return callback(err, null);

    const monthlyData = Array(12).fill(0);
    results.forEach(row => {
      monthlyData[row.month - 1] = row.count;
    });

    callback(null, monthlyData);
  });
};

module.exports = { getStats,   getMonthlyAppointments };
