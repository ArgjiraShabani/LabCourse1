const weeklyScheduleModel = require("../Model/weeklyScheduleModel");

const getAllWeeklySchedulesHandler = (req, res) => {
  weeklyScheduleModel.getAllWeeklySchedules((err, results) => {
    if (err) {
      console.error("Error retrieving schedules:", err);
      return res
        .status(500)
        .json({ message: "Error while retrieving existing schedules" });
    }
    res.json(results);
  });
};

const addOrUpdateWeeklyScheduleHandler = (req, res) => {
  weeklyScheduleModel.addOrUpdateWeeklySchedule(req.body, (err, result) => {
    if (err) {
      console.error("Error adding schedule:", err);
      return res
        .status(500)
        .json({ message: "Error while adding the schedule" });
    }
    res.json({
      message: "Schedule added successfully",
      schedule_id: result.insertId,
    });
  });
};

const updateWeeklyScheduleHandler = (req, res) => {
  const scheduleId = req.params.scheduleId;
  weeklyScheduleModel.updateWeeklySchedule(
    scheduleId,
    req.body,
    (err, result) => {
      if (err) {
        console.error("Error updating schedule:", err);
        return res
          .status(500)
          .json({ message: "Error while updating the schedule" });
      }
      res.json({ message: "Schedule updated successfully" });
    }
  );
};

const deleteWeeklyScheduleHandler = (req, res) => {
  const scheduleId = req.params.scheduleId;
  weeklyScheduleModel.deleteWeeklySchedule(scheduleId, (err, result) => {
    if (err) {
      console.error("Error deleting schedule:", err);
      return res
        .status(500)
        .json({ message: "Error while deleting the schedule" });
    }
    res.json({ message: "Schedule deleted successfully" });
  });
};

const getWeeklyScheduleByDoctorHandler = (req, res) => {
  const doctorId = req.user.id;

  weeklyScheduleModel.getWeeklyScheduleByDoctor(doctorId, (err, results) => {
    if (err) {
      console.error("Error fetching weekly schedule for doctor:", err);
      return res.status(500).json({ message: "Error fetching schedule" });
    }
    res.json(results);
  });
};

module.exports = {
  getAllWeeklySchedulesHandler,
  addOrUpdateWeeklyScheduleHandler,
  updateWeeklyScheduleHandler,
  deleteWeeklyScheduleHandler,
  getWeeklyScheduleByDoctorHandler,
};
