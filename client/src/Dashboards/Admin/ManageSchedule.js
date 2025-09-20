import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import Sidebar from "../../Components/AdminSidebar";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import Select from "react-select";

const api = axios.create({
  baseURL: "http://localhost:3001/api",
  withCredentials: true,
});

const ManageSchedule = () => {
  const [doctors, setDoctors] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState(null); // react-select object
  const [weeklyData, setWeeklyData] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [schedules, setSchedules] = useState([]);
  const navigate = useNavigate();

  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

  useEffect(() => {
    axios.get(`http://localhost:3001/ManageSchedule`, { withCredentials: true }) 
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

  const fetchDoctors = async () => {
    try {
      const res = await api.get("/allDoctors");
      // Transform data for react-select
      const options = res.data.map((d) => ({ value: d.id, label: d.name }));
      setDoctors(options);
    } catch (err) {
      console.error(err);
      setError("Error fetching doctors");
    }
  };

  const fetchAllSchedules = useCallback(async () => {
    try {
      const res = await api.get("/standardSchedules");
      setSchedules(res.data);
    } catch (err) {
      console.error(err);
      setError("Error fetching schedules");
    }
  }, []);

  const fetchDoctorSchedule = useCallback(async (doctorId) => {
    try {
      const res = await api.get(`/standardSchedules/${doctorId}`);
      const scheduleMap = {};
      res.data.forEach((item) => {
        scheduleMap[item.weekday] = {
          start_time: item.start_time?.slice(0, 5),
          end_time: item.end_time?.slice(0, 5),
          schedule_id: item.schedule_id,
        };
      });
      setWeeklyData(scheduleMap);
    } catch (err) {
      console.error(err);
      setError("Error fetching doctor's schedule");
    }
  }, []);

  useEffect(() => {
    fetchDoctors();
    fetchAllSchedules();
  }, [fetchAllSchedules]);

  useEffect(() => {
    if (selectedDoctor) {
      fetchDoctorSchedule(selectedDoctor.value);
    } else {
      setWeeklyData({});
    }
  }, [selectedDoctor, fetchDoctorSchedule]);

  const handleChange = (day, field, value) => {
    setWeeklyData((prev) => ({
      ...prev,
      [day]: {
        ...prev[day],
        [field]: value,
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
    text: "Do you want to save changes for this doctor?",
    icon: "question",
    showCancelButton: true,
    confirmButtonText: "Yes, save it!",
    cancelButtonText: "Cancel",
    confirmButtonColor: "#51A485",
  });
  if (!result.isConfirmed) return;

  setLoading(true);
  setError("");

  try {
    const requests = days.map((day) => {
      const dayData = weeklyData[day];
      if (dayData?.start_time && dayData?.end_time) {
        if (dayData.schedule_id) {
          return api.put(`/standardSchedules/${dayData.schedule_id}`, {
            start_time: dayData.start_time,
            end_time: dayData.end_time,
          });
        } else {
          return api.post("/standardSchedules", {
            doctor_id: selectedDoctor.value,
            weekday: day,
            start_time: dayData.start_time,
            end_time: dayData.end_time,
          });
        }
      }
      return null;
    });

    await Promise.all(requests.filter(Boolean));

    Swal.fire({
      icon: "success",
      title: "Saved",
      timer: 1500,
      showConfirmButton: false,
    });

    fetchDoctorSchedule(selectedDoctor.value);
    fetchAllSchedules();

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


  const handleDeleteDay = async (doctorId, day) => {
  const confirm = await Swal.fire({
    title: `Delete all schedules for ${day}?`,
    text: "This cannot be undone!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "Yes, delete!",
    cancelButtonText: "Cancel",
    confirmButtonColor: "#51A485",
  });
  if (!confirm.isConfirmed) return;

  try {
    await api.delete(`/standardSchedules/day/${doctorId}/${day}`);

    Swal.fire({
      icon: "success",
      title: "Deleted",
      timer: 1500,
      showConfirmButton: false,
    });

    fetchDoctorSchedule(doctorId);
    fetchAllSchedules();

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
      console.error("Error deleting day schedule:", err);
      const msg = err.response?.data?.error || err.message || "Could not delete day schedule";
      Swal.fire("Error", msg, "error");
      setError(msg);
    }
  }
};


  return (
    <div className="d-flex flex-column flex-lg-row" style={{ minHeight: "100vh" }}>
      <Sidebar role="admin" />
      <div className="container mt-4 flex-grow-1">
        <h2 className="mb-4">Set Weekly Schedule for Doctor</h2>
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
            {days.map((day) => (
              <div key={day} className="border p-3 rounded mb-3">
                <strong>{day}</strong>
                <div className="row mt-2 g-2">
                  <div className="col-12 col-md-6">
                    <label>Start Time:</label>
                    <input
                      type="time"
                      className="form-control"
                      value={weeklyData[day]?.start_time || ""}
                      onChange={(e) => handleChange(day, "start_time", e.target.value)}
                    />
                  </div>
                  <div className="col-12 col-md-6">
                    <label>End Time:</label>
                    <input
                      type="time"
                      className="form-control"
                      value={weeklyData[day]?.end_time || ""}
                      onChange={(e) => handleChange(day, "end_time", e.target.value)}
                    />
                  </div>
                  {weeklyData[day]?.schedule_id && (
                    <div className="col-12 mt-2">
                      <button
                        type="button"
                        className="btn btn-sm btn-danger"
                        onClick={() => handleDeleteDay(selectedDoctor.value, day)}
                      >
                        Delete Day
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
            <button
              type="submit"
              className="btn mt-3"
              style={{ backgroundColor: "#51A485", color: "white" }}
              disabled={loading}
            >
              {loading ? "Saving..." : "Save Schedule"}
            </button>
          </form>
        )}

        <h4 className="mt-5">Standard Schedule Table</h4>
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
                  .map((schedule) => (
                    <tr key={schedule.doctor_id}>
                      <td>{schedule.doctor_name}</td>
                      {days.map((day) => (
                        <td key={day}>
                          {schedule[day]?.start_time
                            ? `${schedule[day].start_time} - ${schedule[day].end_time}`
                            : "-"}
                          {schedule[day]?.schedule_id && (
                            <button
                              className="btn btn-sm btn-danger ms-2 mt-1"
                              onClick={() => handleDeleteDay(schedule.doctor_id, day)}
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
                  <td colSpan={days.length + 1}>No schedules recorded</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ManageSchedule;