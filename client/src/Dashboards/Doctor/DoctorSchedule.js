import React, { useEffect, useState } from "react";
import axios from "axios";
import Sidebar from "../../Components/AdminSidebar";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";








const apiDoctor = axios.create({
  baseURL: "http://localhost:3001/api",
  withCredentials: true,
});

const apiSchedule = axios.create({
  baseURL: "http://localhost:3001/api",
  withCredentials: true,
});

const days = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

const DoctorSchedule = () => {
  const [schedule, setSchedule] = useState({});
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    apiDoctor
      .get("/DoctorSchedule")
      .then((res) => {
        if (res.data.user?.role !== "doctor") {
          Swal.fire({
            icon: "error",
            title: "Access Denied",
            text: "Only doctors can access this page.",
            confirmButtonColor: "#51A485",
          });
          navigate("/login");
        }
      })
      .catch((err) => {
        if (err.response && (err.response.status === 401 || err.response.status === 403)) {
          
          navigate("/login");
        } else {
          console.error("Unexpected error", err);
          Swal.fire({
            icon: "error",
            title: "Error",
            text: "Unexpected error occurred.",
            confirmButtonColor: "#51A485",
          });
        }
      });
  }, [navigate]);

  useEffect(() => {
    const fetchSchedule = async () => {
      try {
        const [resWeekly, resStandard] = await Promise.all([
          apiSchedule.get("/weekly-schedule"),
          apiSchedule.get("/standard-schedule"),
        ]);

        const weekly = resWeekly.data;
        const standard = resStandard.data;

        const formatted = {};
        days.forEach((day) => {
          formatted[day] = { start_time: "-", end_time: "-", isException: false };
        });

        standard.forEach((item) => {
          if (item.weekday) {
            formatted[item.weekday] = {
              start_time: item.start_time?.slice(0, 5) || "-",
              end_time: item.end_time?.slice(0, 5) || "-",
              isException: false,
            };
          }
        });

        const getDayNameFromDate = (dateString) => {
          const date = new Date(dateString);
          return date.toLocaleDateString("en-US", { weekday: "long" });
        };

        weekly.forEach((item) => {
          if (item.start_time && item.end_time && item.date) {
            const dayName = getDayNameFromDate(item.date);
            if (dayName in formatted) {
              formatted[dayName] = {
                start_time: item.start_time.slice(0, 5),
                end_time: item.end_time.slice(0, 5),
                isException: true,
              };
            }
          }
        });

        setSchedule(formatted);
        setError("");
      } catch (err) {
        console.error("Error while loading schedule:", err);
        setError("Could not load the schedule. Please try again later.");
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
                  {schedule[day]?.isException && <em>(exception)</em>}
                </td>
                <td>
                  {schedule[day]?.end_time}{" "}
                  {schedule[day]?.isException && <em>(exception)</em>}
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