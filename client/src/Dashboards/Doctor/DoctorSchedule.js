import React, { useEffect, useState } from "react";
import axios from "axios";
import Sidebar from "../../Components/AdminSidebar";

const api = axios.create({
  baseURL: "http://localhost:3001/doctor",
  withCredentials: true,
});

const DoctorSchedule = () => {
  const [schedule, setSchedule] = useState({});
  const [error, setError] = useState("");
  const days = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];

  useEffect(() => {
    const fetchSchedule = async () => {
      try {
        const resWeekly = await api.get("/weekly-schedule");
        const weekly = resWeekly.data;
        console.log("Weekly schedule data:", weekly);

        const resStandard = await api.get("/standard-schedule");
        const standard = resStandard.data;

        const days = [
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday",
          "Saturday",
          "Sunday",
        ];

        const formatted = {};
        days.forEach((day) => {
          formatted[day] = {
            start_time: "-",
            end_time: "-",
            isException: false,
          };
        });

        standard.forEach((item) => {
          formatted[item.weekday] = {
            start_time: item.start_time?.slice(0, 5) || "-",
            end_time: item.end_time?.slice(0, 5) || "-",
            isException: false,
          };
        });

        const getDayNameFromDate = (dateString) => {
          const date = new Date(dateString);
          return date.toLocaleDateString("en-US", { weekday: "long" });
        };

        weekly.forEach((item) => {
          if (item.start_time && item.end_time) {
            const dayName = getDayNameFromDate(item.date);
            formatted[dayName] = {
              start_time: item.start_time.slice(0, 5),
              end_time: item.end_time.slice(0, 5),
              isException: true,
            };
          }
        });

        setSchedule(formatted);
        setError("");
      } catch (err) {
        console.error("Error while loading schedule:", err);
        setError("Couldn't load the schedule.");
      }
    };

    fetchSchedule();
  }, []);

  return (
    <div className="d-flex" style={{ minHeight: "100vh" }}>
      <Sidebar role="doctor" />
      <div className="flex-grow-1 p-4">
        <h3>Work Schedule</h3>
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
            {days.map((day) => (
              <tr key={day}>
                <td>{day}</td>
                <td>
                  {schedule[day]?.start_time}{" "}
                  {schedule[day]?.isException ? "(exception)" : ""}
                </td>
                <td>
                  {schedule[day]?.end_time}{" "}
                  {schedule[day]?.isException ? "(exception)" : ""}
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
