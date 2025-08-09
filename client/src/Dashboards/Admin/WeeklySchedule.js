import React, { useEffect, useState } from "react";
import axios from "axios";
import Sidebar from "../../Components/AdminSidebar";
import Swal from "sweetalert2";
import { useNavigate, useParams } from "react-router-dom";
import { startOfWeek, addDays, format, parseISO } from "date-fns";
const api = axios.create({
  baseURL: "http://localhost:3001/api",
  withCredentials: true,
});

const WeeklySchedule = () => {
  const [doctors, setDoctors] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState("");
  const [weekDates, setWeekDates] = useState([]);
  const [weeklyData, setWeeklyData] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [schedules, setSchedules] = useState([]);
  const navigate = useNavigate();
  const { id } = useParams();

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
    if (!id) {
      Swal.fire({
        icon: "error",
        title: "Access Denied",
        text: "Invalid user id.",
      });
      navigate("/");
      return;
    }

    axios
      .get(`http://localhost:3001/WeeklySchedule/${id}`, {
        withCredentials: true,
      })
      .then((res) => {
        if (res.data.user?.role !== "admin") {
          Swal.fire({
            icon: "error",
            title: "Access Denied",
            text: "Only admin can access this page.",
          });
          navigate("/");
        }
      })
      .catch(() => {
        Swal.fire({
          icon: "error",
          title: "Access Denied",
          text: "Authentication failed.",
        });
        navigate("/");
      });
  }, [id, navigate]);

  const getWeekDates = () => {
    const today = new Date();
    const start = startOfWeek(today, { weekStartsOn: 1 });
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
      const res = await api.get("/allDoctors");
      setDoctors(res.data);
      setError("");
    } catch (err) {
      console.error("Error fetching doctors:", err);
      setError("Error while fetching the doctors list");
    }
  };

  const fetchWeeklySchedule = async (doctorId) => {
    try {
      const res = await api.get(`/weekly-schedules/${doctorId}`);
      const scheduleMap = {};
      res.data.forEach((item) => {
        scheduleMap[item.date] = {
          ...item,
          start_time: item.start_time?.slice(0, 5),
          end_time: item.end_time?.slice(0, 5),
          schedule_id: item.schedule_id,
          is_custom: item.is_custom || false,
        };
      });
      setWeeklyData(scheduleMap);
      setError("");
    } catch (err) {
      console.error("Error fetching weekly schedule:", err);
      setError("Error while fetching the weekly schedule");
    }
  };

  const fetchAllSchedules = async () => {
    try {
      const res = await api.get("/weekly-schedules");
      setSchedules(res.data);
      setError("");
    } catch (err) {
      console.error("Error fetching schedules:", err);
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
    if (!selectedDoctor) {
      Swal.fire({
        icon: "warning",
        title: "Warning",
        text: "Please select a doctor first.",
        confirmButtonColor: "#51A485",
      });
      return;
    }

    const result = await Swal.fire({
      title: "Save Changes?",
      text: "Do you want to save the changes to the schedule?",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Yes, save it!",
      cancelButtonText: "Cancel",
      confirmButtonColor: "#51A485",
      cancelButtonColor: "#51A485",
    });

    if (!result.isConfirmed) return;

    setLoading(true);
    setError("");
    try {
      const requests = weekDates.map((date) => {
        const dayData = weeklyData[date];
        if (dayData?.start_time && dayData?.end_time) {
          if (dayData.schedule_id) {
            return api.put(`/weekly-schedules/${dayData.schedule_id}`, {
              start_time: dayData.start_time,
              end_time: dayData.end_time,
              is_custom: true,
            });
          } else {
            return api.post("/weekly-schedules", {
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
      Swal.fire({
        icon: "success",
        title: "Success",
        text: "Schedule saved successfully!",
        timer: 1500,
        showConfirmButton: false,
      });
      fetchWeeklySchedule(selectedDoctor);
      fetchAllSchedules();
    } catch (err) {
      console.error("Error saving schedule:", err);
      setError("Error while saving the schedule");
    } finally {
      setLoading(false);
    }
  };

  const confirmDeletion = (scheduleId) => {
    Swal.fire({
      title: "Are you sure you want to delete this schedule?",
      text: "This action cannot be undone!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
      confirmButtonColor: "#51A485",
      cancelButtonColor: "#d33",
    }).then((result) => {
      if (result.isConfirmed) {
        handleDeleteSchedule(scheduleId);
      }
    });
  };

  const handleDeleteSchedule = async (scheduleId) => {
    try {
      await api.delete(`/weekly-schedules/${scheduleId}`);
      Swal.fire({
        icon: "success",
        title: "Deleted",
        text: "Schedule deleted successfully",
        timer: 1500,
        showConfirmButton: false,
      });
      fetchAllSchedules();
      if (selectedDoctor) fetchWeeklySchedule(selectedDoctor);
    } catch (err) {
      console.error("Error deleting schedule:", err);
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
              className="btn mt-3"
              style={{
                backgroundColor: "#51A485",
                borderColor: "#51A485",
                color: "white",
              }}
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
                <th>Doctor</th>
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
                                confirmDeletion(schedule[day].schedule_id)
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