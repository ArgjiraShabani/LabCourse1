const {
  getAllSchedules,
  getSchedulesByDoctorId,
  addSchedule,
  updateSchedule,
  deleteSchedule,
  deleteDaySchedulesByDoctor,
} = require("../Model/standardScheduleModel");

const getStandardSchedulesHandler = (req, res) => {
  getAllSchedules((err, schedules) => {
    if (err) {
      console.error("Error while fetching schedules:", err.message);
      return res.status(500).json({ error: "Error while fetching schedules" });
    }
    res.json(schedules);
  });
};

const getSchedulesByDoctorHandler = (req, res) => {
  const doctor_id = req.user.id;

  getSchedulesByDoctorId(doctor_id, (err, schedules) => {
    if (err) {
      console.error("Error fetching schedules by doctor:", err.message);
      return res.status(500).json({ error: "Error fetching schedules by doctor" });
    }
    res.json(schedules);
  });
};

const addStandardScheduleHandler = (req, res) => {
  const { doctor_id, weekday, start_time, end_time } = req.body;
  if (!doctor_id || !weekday || !start_time || !end_time) {
    return res.status(400).json({ error: "The requested data is missing" });
  }

  addSchedule(doctor_id, weekday, start_time, end_time, (err, result) => {
    if (err) {
      console.error("Error while saving the schedule:", err.message);
      return res.status(500).json({ error: "Error while saving the schedule" });
    }
    res.status(201).json({ message: "The schedule was added successfully" });
  });
};

const updateStandardScheduleHandler = (req, res) => {
  const { schedule_id } = req.params;
  const { start_time, end_time } = req.body;
  if (!start_time || !end_time) {
    return res.status(400).json({ error: "The requested data is missing" });
  }

  updateSchedule(schedule_id, start_time, end_time, (err, result) => {
    if (err) {
      console.error("Error while updating the schedule:", err.message);
      return res.status(500).json({ error: "Error while updating the schedule" });
    }
    res.json({ message: "The schedule was updated successfully" });
  });
};

const deleteStandardScheduleHandler = (req, res) => {
  const { schedule_id } = req.params;
  deleteSchedule(schedule_id, (err, result) => {
    if (err) {
      console.error("Error while deleting the schedule:", err.message);
      return res.status(500).json({ error: "Error while deleting the schedule" });
    }
    res.json({ message: "The schedule was deleted successfully" });
  });
};

const deleteDayScheduleHandler = (req, res) => {
  const { doctor_id, day } = req.params;

  if (!doctor_id || !day) {
    return res.status(400).json({ error: "Doctor ID or day is missing" });
  }

  deleteDaySchedulesByDoctor(doctor_id, day, (err, result) => {
    if (err) {
      console.error("Error while deleting day schedules:", err.message);
      return res.status(500).json({ error: "Error while deleting schedules for the day" });
    }
    res.json({ message: `All schedules for ${day} deleted successfully` });
  });
};

module.exports = {
  getStandardSchedulesHandler,
  getSchedulesByDoctorHandler,
  addStandardScheduleHandler,
  updateStandardScheduleHandler,
  deleteStandardScheduleHandler,
  deleteDayScheduleHandler,
};