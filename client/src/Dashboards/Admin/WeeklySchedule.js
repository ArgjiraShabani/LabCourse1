import React, { useEffect, useState } from "react";
import axios from "axios";
import Sidebar from "../../Components/AdminSidebar";
import {
  startOfWeek,
  addDays,
  format,
  parseISO,
} from "date-fns";

const WeeklySchedule = () => {
  const [doctors, setDoctors] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState("");
  const [weekDates, setWeekDates] = useState([]);
  const [weeklyData, setWeeklyData] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [schedules, setSchedules] = useState([]);

  const days = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];

  const getWeekDates = () => {
    const today = new Date();
    const start = startOfWeek(today, { weekStartsOn: 1 }); // Monday
    return Array.from({ length: 7 }, (_, i) =>
      format(addDays(start, i), "yyyy-MM-dd")
    );
  };

  useEffect(() => {
    setWeekDates(getWeekDates());
    fetchDoctors();
    fetchAllSchedules();
  }, []);

  useEffect(() => {
    if (selectedDoctor) {
      fetchWeeklySchedule(selectedDoctor);
    } else {
      setWeeklyData({});
    }
  }, [selectedDoctor, weekDates]);

  const fetchDoctors = async () => {
    try {
      const res = await axios.get("http://localhost:3001/api/doctors");
      setDoctors(res.data);
      setError("");
    } catch (err) {
      console.error("Error while fetching the doctors list:", err);
      setError("Error while fetching the doctors list");
    }
  };

  const fetchWeeklySchedule = async (doctorId) => {
    try {
      const res = await axios.get(
        `http://localhost:3001/api/weeklySchedules/${doctorId}`
      );

      const scheduleMap = {};
      res.data.forEach((item) => {
        scheduleMap[item.date] = {
          ...item,
          start_time: item.start_time?.slice(0, 5),
          end_time: item.end_time?.slice(0, 5),
        };
      });
      setWeeklyData(scheduleMap);
      setError("");
    } catch (err) {
      console.error("Error while fetching the weekly schedule:", err);
      setError("Error while fetching the weekly schedule");
    }
  };

  const fetchAllSchedules = async () => {
    try {
      const res = await axios.get("http://localhost:3001/api/weeklySchedules");
      setSchedules(res.data);
      setError("");
    } catch (err) {
      console.error("Error while fetching existing schedules:", err);
      setError("Error while fetching existing schedules");
    }
  };

  const handleChange = (date, field, value) => {
    setWeeklyData((prev) => ({
      ...prev,
      [date]: {
        ...prev[date],
        [field]: value,
        is_custom: true,
      },
    }));
  };

  const handleSave = async () => {
    setLoading(true);
    setError("");
    try {
      const requests = weekDates.map((date) => {
        const dayData = weeklyData[date];
        if (dayData?.start_time && dayData?.end_time) {
          if (dayData.schedule_id) {
            return axios.put(
              `http://localhost:3001/api/weeklySchedules/${dayData.schedule_id}`,
              {
                start_time: dayData.start_time,
                end_time: dayData.end_time,
                is_custom: true,
              }
            );
          } else {
            return axios.post("http://localhost:3001/api/weeklySchedules", {
              doctor_id: selectedDoctor,
              date,
              start_time: dayData.start_time,
              end_time: dayData.end_time,
              is_custom: true,
            });
          }
        }
        return null;
      });

      await Promise.all(requests.filter(Boolean));
      alert("Schedule saved successfully!");
      fetchWeeklySchedule(selectedDoctor);
      fetchAllSchedules();
    } catch (err) {
      console.error("Error while saving the schedule:", err);
      setError("Error while saving the schedule");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteSchedule = async (scheduleId) => {
    if (!window.confirm("Are you sure you want to delete this schedule?")) return;

    try {
      await axios.delete(
        `http://localhost:3001/api/weeklySchedules/${scheduleId}`
      );
      alert("Schedule deleted successfully");
      fetchAllSchedules();
      if (selectedDoctor) fetchWeeklySchedule(selectedDoctor);
    } catch (err) {
      console.error("Error while deleting the schedule:", err);
      setError("Error while deleting the schedule");
    }
  };

  return (
    <div className="d-flex" style={{ minHeight: "100vh" }}>
      <Sidebar role="admin" />
      <div className="container mt-4">
        <h2>Manage Weekly Schedule</h2>
        {error && <div className="alert alert-danger">{error}</div>}

        <div className="mb-3">
          <label>Select Doctor:</label>
          <select
            className="form-select"
            value={selectedDoctor}
            onChange={(e) => setSelectedDoctor(e.target.value)}
          >
            <option value="">Choose...</option>
            {doctors.map((d) => (
              <option key={d.id} value={d.id}>
                {d.name}
              </option>
            ))}
          </select>
        </div>

        {selectedDoctor && (
          <form onSubmit={(e) => e.preventDefault()}>
            {weekDates.map((date) => (
              <div key={date} className="border p-3 rounded mb-3">
                <strong>{format(parseISO(date), "EEEE, dd MMM yyyy")}</strong>
                <div className="row mt-2">
                  <div className="col-md-6">
                    <label>Start Time:</label>
                    <input
                      type="time"
                      className="form-control"
                      value={weeklyData[date]?.start_time || ""}
                      onChange={(e) =>
                        handleChange(date, "start_time", e.target.value)
                      }
                    />
                  </div>
                  <div className="col-md-6">
                    <label>End Time:</label>
                    <input
                      type="time"
                      className="form-control"
                      value={weeklyData[date]?.end_time || ""}
                      onChange={(e) =>
                        handleChange(date, "end_time", e.target.value)
                      }
                    />
                  </div>
                </div>
              </div>
            ))}

            <button
              className="btn btn-primary mt-3"
              onClick={handleSave}
              disabled={loading}
            >
              {loading ? "Saving..." : "Save Changes"}
            </button>
          </form>
        )}

        <h4 className="mb-3 mt-5">Special Schedules</h4>

        <div className="table-responsive">
          <table className="table table-bordered">
            <thead className="table-light">
              <tr>
                <th>Mjeku</th>
                {days.map((day) => (
                  <th key={day}>{day}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {schedules.length > 0 ? (
                schedules
                  .filter(
                    (item) =>
                      !selectedDoctor ||
                      item.doctor_id === parseInt(selectedDoctor)
                  )
                  .reduce((acc, item) => {
                    let existing = acc.find(
                      (s) => s.doctor_id === item.doctor_id
                    );
                    if (!existing) {
                      existing = {
                        doctor_id: item.doctor_id,
                        doctor_name: item.doctor_name,
                      };
                      days.forEach((day) => (existing[day] = {}));
                      acc.push(existing);
                    }
                    existing[item.weekday] = {
                      start_time: item.start_time.slice(0, 5),
                      end_time: item.end_time.slice(0, 5),
                      schedule_id: item.schedule_id,
                    };
                    return acc;
                  }, [])

                  .map((schedule, idx) => (
                    <tr key={idx}>
                      <td>{schedule.doctor_name}</td>
                      {days.map((day) => (
                        <td key={day}>
                          {schedule[day]?.start_time
                            ? `${schedule[day].start_time} - ${schedule[day].end_time}`
                            : "-"}
                          {schedule[day]?.schedule_id && (
                            <button
                              className="btn btn-sm btn-danger ms-2"
                              onClick={() =>
                                handleDeleteSchedule(schedule[day].schedule_id)
                              }
                            >
                              Delete
                            </button>
                          )}
                        </td>
                      ))}
                    </tr>
                  ))
              ) : (
                <tr>
                  <td colSpan={days.length + 1}>No schedules registered.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default WeeklySchedule;
