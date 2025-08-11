const adminModel = require("../Model/adminModel");

const getAdminStats = (req, res) => {
  adminModel.getStats((err, stats) => {
    if (err) {
      console.error("Error while retrieving statistics:", err);
      return res.status(500).json({ error: "Error while retrieving statistics" });
    }
    res.json(stats);
  });
};

const getMonthlyAppointmentsStats = (req, res) => {
  const year = req.query.year || new Date().getFullYear();

  adminModel.getMonthlyAppointments(year, (err, data) => {
    if (err) {
      console.error("Error fetching monthly stats:", err);
      return res.status(500).json({ error: "Error fetching monthly stats" });
    }

    res.json({
      year,
      months: [
        "Janar", "Shkurt", "Mars", "Prill", "Maj", "Qershor",
        "Korrik", "Gusht", "Shtator", "Tetor", "Nëntor", "Dhjetor"
      ],
      counts: data
    });
  });
};
module.exports = { getAdminStats, getMonthlyAppointmentsStats};
