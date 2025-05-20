import React, { useEffect, useState } from "react";
import axios from "axios";
import Sidebar from "../../Components/AdminSidebar";

const DoctorSchedule = () => {
  const [schedule, setSchedule] = useState({});
  const [error, setError] = useState("");
  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

  const doctorId = localStorage.getItem("doctor_id");

useEffect(() => {
  if (!doctorId) {
    setError("Logged-in doctor's ID was not found.");
    return;
  }


    const fetchSchedule = async () => {
      try {
        const res = await axios.get("http://localhost:3001/api/standardSchedules");
        const standard = res.data.filter(s => s.doctor_id === parseInt(doctorId));

        const formatted = {};
        days.forEach(day => {
          formatted[day] = { start_time: "-", end_time: "-", isException: false };
        });

        standard.forEach(item => {
          formatted[item.weekday] = {
            start_time: item.start_time?.slice(0, 5),
            end_time: item.end_time?.slice(0, 5),
            isException: false
          };
        });
        const res2 = await axios.get("http://localhost:3001/api/weeklySchedules");
        const custom = res2.data.filter(s => s.doctor_id === parseInt(doctorId));

        custom.forEach(item => {
          if (item.weekday && formatted[item.weekday]) {
            formatted[item.weekday] = {
              start_time: item.start_time?.slice(0, 5),
              end_time: item.end_time?.slice(0, 5),
              isException: true
            };
          }
        });

  setSchedule(formatted);
} catch (err) {
  console.error("Error while loading schedule:", err);
  setError("Couldn't load the schedule.");
}
    };

    fetchSchedule();
  }, [doctorId]);

  return (
    <div className="d-flex" style={{ minHeight: "100vh" }}>
      <Sidebar role="doctor" />

      <div className="flex-grow-1 p-4">
        <h3> Work Schedule</h3>
        {error && <div className="alert alert-danger">{error}</div>}
        <table className="table table-bordered">
          <thead>
            <tr>
              <th>Day</th>
              <th>Start time</th>
              <th>End time</th>
            </tr>
          </thead>
          <tbody>
            {days.map(day => (
              <tr key={day}>
                <td>{day}</td>
                <td>
                  {schedule[day]?.start_time || "-"}
                  {schedule[day]?.isException ? " (exception)" : ""}
                </td>
                <td>
                  {schedule[day]?.end_time || "-"}
                  {schedule[day]?.isException ? " (exception)" : ""}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DoctorSchedule;

