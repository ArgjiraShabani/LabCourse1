const express = require('express');
const router = express.Router();
const { authenticateToken, authorizeRoles } = require('../../middlewares');

const {
  getSchedulesByDoctorHandler,
} = require('../../Controllers/standardScheduleController');

const {
  getWeeklyScheduleByDoctorHandler,
} = require('../../Controllers/weeklyScheduleController');

router.use(authenticateToken);
router.use(authorizeRoles('doctor'));
router.get('/standard-schedule', getSchedulesByDoctorHandler);
router.get('/weekly-schedule', getWeeklyScheduleByDoctorHandler);
router.get('/dashboard', (req, res) => {
  res.json({ message: "Welcome Doctor", user: req.user });
});

module.exports = router;