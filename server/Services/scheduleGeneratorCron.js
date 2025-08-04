const cron = require("node-cron");
const moment = require("moment");
const db = require("../db.js");

cron.schedule("0 23 * * 0", async () => {
  try {
    const [doctors] = await db.query("SELECT doctor_id FROM doctors");
    const [standardSchedules] = await db.query("SELECT * FROM standard_schedules");

    const nextWeek = [];
    for (let i = 0; i < 7; i++) {
      const date = moment()
        .add(1, "weeks")
        .startOf("isoWeek")
        .add(i, "days")
        .format("YYYY-MM-DD");
      const weekday = moment(date).format("dddd");
      nextWeek.push({ weekday, date });
    }

    for (const doctor of doctors) {
      for (const day of nextWeek) {
        const schedule = standardSchedules.find(
          (s) => s.doctor_id === doctor.doctor_id && s.weekday === day.weekday
        );

        if (schedule) {
          try {
            await db.query(
              `INSERT IGNORE INTO weekly_schedules (doctor_id, date, start_time, end_time, is_custom)
               VALUES (?, ?, ?, ?, false)`,
              [
                doctor.doctor_id,
                day.date,
                schedule.start_time,
                schedule.end_time,
              ]
            );
          } catch (err) {
            console.error(
              `Error inserting schedule for ${doctor.doctor_id} on ${day.date}:`,
              err
            );
          }
        }
      }
    }

    console.log("Weekly schedule generated successfully!");
  } catch (err) {
    console.error("Error while generating the weekly schedule:", err);
  }
});
