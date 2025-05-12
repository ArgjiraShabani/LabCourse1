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
      setError("Nuk u gjet ID e mjekut të loguar.");
      return;
    }

    const fetchSchedule = async () => {
      try {
        const res = await axios.get("http://localhost:3001/api/standardSchedules");
        const doctorSchedule = res.data.filter(s => s.doctor_id === parseInt(doctorId));

        const formatted = {};
        days.forEach(day => {
          formatted[day] = { start_time: "-", end_time: "-" };
        });

        doctorSchedule.forEach(item => {
          formatted[item.weekday] = {
            start_time: item.start_time?.slice(0, 5),
            end_time: item.end_time?.slice(0, 5),
          };
        });

        setSchedule(formatted);
      } catch (err) {
        console.error("Gabim gjatë ngarkimit të orarit:", err);
        setError("Gabim gjatë ngarkimit të orarit.");
      }
    };

    fetchSchedule();
  }, [doctorId]);

  return (
    <div className="d-flex" style={{ minHeight: "100vh" }}>
      <Sidebar role="doctor" />

      <div className="flex-grow-1 p-4">
        <h3>Orari i punës</h3>
        {error && <div className="alert alert-danger">{error}</div>}
        <table className="table table-bordered">
          <thead>
            <tr>
              <th>Dita</th>
              <th>Ora e fillimit</th>
              <th>Ora e mbarimit</th>
            </tr>
          </thead>
          <tbody>
            {days.map(day => (
              <tr key={day}>
                <td>{day}</td>
                <td>{schedule[day]?.start_time || "-"}</td>
                <td>{schedule[day]?.end_time || "-"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DoctorSchedule;

