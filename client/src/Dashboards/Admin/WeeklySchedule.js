import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import Sidebar from "../../Components/AdminSidebar";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import { startOfWeek, addDays, format, parseISO } from "date-fns";
import Select from "react-select";

const api = axios.create({
  baseURL: "http://localhost:3001/api",
  withCredentials: true,
});

const WeeklySchedule = () => {
  const [doctors, setDoctors] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState(null); 
  const [weekDates, setWeekDates] = useState([]);
  const [weeklyData, setWeeklyData] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [schedules, setSchedules] = useState([]);
  const navigate = useNavigate();

  const days = ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"];

  useEffect(() => {
    axios.get(`http://localhost:3001/WeeklySchedule`, { withCredentials: true }) 
      .then((res) => {
        if (res.data.user?.role !== "admin") {
          Swal.fire({
            icon: "error",
            title: "Access Denied",
            text: "Only admin can access this page.",
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
        }
      });
  }, [navigate]);

  const getWeekDates = () => {
    const today = new Date();
    const start = startOfWeek(today, { weekStartsOn: 1 });
    return Array.from({ length: 7 }, (_, i) => format(addDays(start, i), "yyyy-MM-dd"));
  };

  useEffect(() => {
    setWeekDates(getWeekDates());
    fetchDoctors();
    fetchAllSchedules();
  }, []);

  const fetchDoctors = async () => {
    try {
      const res = await api.get("/alldoctors");
      const options = res.data.map((d) => ({ value: d.id, label: d.name }));
      setDoctors(options);
      setError("");
    } catch (err) {
      console.error("Error fetching doctors:", err);
      setError("Error while fetching the doctors list");
    }
  };

  const fetchAllSchedules = useCallback(async () => {
    try {
      const res = await api.get("/weekly-schedules");
      setSchedules(res.data);
      setError("");
    } catch (err) {
      console.error("Error fetching schedules:", err);
      setError("Error while fetching existing schedules");
    }
  }, []);

  const fetchWeeklySchedule = useCallback(async (doctorId) => {
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
  }, []);

  useEffect(() => {
    if (selectedDoctor) {
      fetchWeeklySchedule(selectedDoctor.value);
    } else {
      setWeeklyData({});
    }
  }, [selectedDoctor, weekDates, fetchWeeklySchedule]);

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
            doctor_id: selectedDoctor.value,
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

    await fetchWeeklySchedule(selectedDoctor.value);
    await fetchAllSchedules();
  } catch (err) {
    if (err.response && (err.response.status === 401 || err.response.status === 403)) {
      Swal.fire({
        icon: "error",
        title: "Access Denied",
        text: err.response.status === 401 ? "Please login." : "You do not have permission.",
        confirmButtonColor: "#51A485",
      });
      navigate("/");
    } else {
      console.error("Error saving schedule:", err);
      const msg = err.response?.data?.error || err.message || "Could not save schedule";
      Swal.fire("Error", msg, "error");
      setError(msg);
    }
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
      if (result.isConfirmed) handleDeleteSchedule(scheduleId);
    });
  };

  const handleDeleteSchedule = async (schedule_id) => {
  try {
    await api.delete(`/weekly-schedules/${schedule_id}`);

    Swal.fire({
      icon: "success",
      title: "Deleted",
      text: "Schedule deleted successfully!",
      timer: 1500,
      showConfirmButton: false,
    });

    await fetchAllSchedules();
    if (selectedDoctor) await fetchWeeklySchedule(selectedDoctor.value);

  } catch (err) {
    if (err.response && (err.response.status === 401 || err.response.status === 403)) {
      Swal.fire({
        icon: "error",
        title: "Access Denied",
        text: err.response.status === 401 ? "Please login." : "You do not have permission.",
        confirmButtonColor: "#51A485",
      });
      navigate("/");
    } else {
      console.error("Error deleting schedule:", err);
      const msg = err.response?.data?.error || err.message || "Could not delete schedule";
      Swal.fire("Error", msg, "error");
      setError(msg);
    }
  }
};


  return (
    <div className="d-flex flex-column flex-lg-row" style={{ minHeight: "100vh" }}>
      <Sidebar role="admin" />
      <div className="container mt-4 flex-grow-1">
        <h2 className="mb-4">Manage Weekly Schedule</h2>
        {error && <div className="alert alert-danger">{error}</div>}

        <div className="mb-3" style={{ maxWidth: "400px" }}>
          <label>Select Doctor:</label>
          <Select
            options={doctors}
            value={selectedDoctor}
            onChange={setSelectedDoctor}
            placeholder="Choose a doctor"
            isClearable
          />
        </div>

        {selectedDoctor && (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSave();
            }}
          >
            {weekDates.map((date) => (
              <div key={date} className="border p-3 rounded mb-3">
                <strong>{format(parseISO(date), "EEEE, dd MMM yyyy")}</strong>
                <div className="row g-2 mt-2">
                  <div className="col-12 col-md-6">
                    <label>Start Time:</label>
                    <input
                      type="time"
                      className="form-control"
                      value={weeklyData[date]?.start_time || ""}
                      onChange={(e) => handleChange(date, "start_time", e.target.value)}
                    />
                  </div>
                  <div className="col-12 col-md-6">
                    <label>End Time:</label>
                    <input
                      type="time"
                      className="form-control"
                      value={weeklyData[date]?.end_time || ""}
                      onChange={(e) => handleChange(date, "end_time", e.target.value)}
                    />
                  </div>
                </div>
              </div>
            ))}

            <button
              type="submit"
              className="btn mt-3"
              style={{ backgroundColor: "#51A485", color: "white" }}
              disabled={loading}
            >
              {loading ? "Saving..." : "Save Changes"}
            </button>
          </form>
        )}

        <h4 className="mb-3 mt-5">Special Schedules</h4>
        <div className="table-responsive">
          <table className="table table-bordered table-striped">
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
                      !selectedDoctor || item.doctor_id === selectedDoctor.value
                  )
                  .reduce((acc, item) => {
                    let existing = acc.find((s) => s.doctor_id === item.doctor_id);
                    if (!existing) {
                      existing = { doctor_id: item.doctor_id, doctor_name: item.doctor_name };
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
                              className="btn btn-sm btn-danger ms-2 mt-1"
                              onClick={() => confirmDeletion(schedule[day].schedule_id)}
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