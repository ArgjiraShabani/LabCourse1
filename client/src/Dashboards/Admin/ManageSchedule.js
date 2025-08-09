import React, { useEffect, useState } from "react";
import axios from "axios";
import Sidebar from "../../Components/AdminSidebar";
import Swal from "sweetalert2";
import { useNavigate, useParams } from "react-router-dom";

const api = axios.create({
  baseURL: "http://localhost:3001/api",
  withCredentials: true,
});

const ManageSchedule = () => {
  const [doctors, setDoctors] = useState([]);
  const [formData, setFormData] = useState({
    doctor_id: "",
    schedule: {
      Monday: { start_time: "", end_time: "", schedule_id: null },
      Tuesday: { start_time: "", end_time: "", schedule_id: null },
      Wednesday: { start_time: "", end_time: "", schedule_id: null },
      Thursday: { start_time: "", end_time: "", schedule_id: null },
      Friday: { start_time: "", end_time: "", schedule_id: null },
      Saturday: { start_time: "", end_time: "", schedule_id: null },
      Sunday: { start_time: "", end_time: "", schedule_id: null },
    },
  });
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
        confirmButtonColor: "#51A485",
      });
      navigate("/");
      return;
    }

    axios
      .get(`http://localhost:3001/ManageSchedule/${id}`, {
        withCredentials: true,
      })
      .then((res) => {
        if (res.data.user?.role !== "admin") {
          Swal.fire({
            icon: "error",
            title: "Access Denied",
            text: "Only admin can access this page.",
            confirmButtonColor: "#51A485",
          });
          navigate("/");
        }
      })
      .catch(() => {
        Swal.fire({
          icon: "error",
          title: "Access Denied",
          text: "Authentication failed.",
          confirmButtonColor: "#51A485",
        });
        navigate("/");
      });
  }, [id, navigate]);

  useEffect(() => {
    fetchDoctors();
    fetchSchedules();
  }, []);

  const fetchDoctors = async () => {
    try {
      const res = await api.get("/allDoctors");
      setDoctors(res.data);
    } catch (err) {
      setError("Error fetching the list of doctors");
    }
  };

  const fetchSchedules = async () => {
    try {
      const res = await api.get("/standardSchedules");
      setSchedules(res.data);
    } catch (err) {
      console.error("Error fetching schedules:", err);
    }
  };

  const handleChange = (e, day = null) => {
    const { name, value } = e.target;
    if (day) {
      setFormData((prev) => ({
        ...prev,
        schedule: {
          ...prev.schedule,
          [day]: {
            ...prev.schedule[day],
            [name]: value,
          },
        },
      }));
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  useEffect(() => {
    const fetchDoctorSchedule = async () => {
      if (!formData.doctor_id) return;

      try {
        const res = await api.get(`/standardSchedules/${formData.doctor_id}`);
        const doctorSchedule = res.data;

        const updatedSchedule = {
          Monday: { start_time: "", end_time: "", schedule_id: null },
          Tuesday: { start_time: "", end_time: "", schedule_id: null },
          Wednesday: { start_time: "", end_time: "", schedule_id: null },
          Thursday: { start_time: "", end_time: "", schedule_id: null },
          Friday: { start_time: "", end_time: "", schedule_id: null },
          Saturday: { start_time: "", end_time: "", schedule_id: null },
          Sunday: { start_time: "", end_time: "", schedule_id: null },
        };

        doctorSchedule.forEach((entry) => {
          updatedSchedule[entry.weekday] = {
            start_time: entry.start_time?.slice(0, 5) || "",
            end_time: entry.end_time?.slice(0, 5) || "",
            schedule_id: entry.schedule_id,
          };
        });

        setFormData((prev) => ({
          ...prev,
          schedule: updatedSchedule,
        }));
      } catch (err) {
        console.error("Failed to load doctor's schedule:", err);
      }
    };

    fetchDoctorSchedule();
  }, [formData.doctor_id]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.doctor_id) {
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
      cancelButtonColor: "#d33",
    });

    if (!result.isConfirmed) return;

    setLoading(true);
    setError("");

    const { doctor_id, schedule } = formData;

    try {
      const requests = days
        .map((day) => {
          const { start_time, end_time, schedule_id } = schedule[day];
          if (!start_time || !end_time) return null;

          if (schedule_id) {
            return api.put(`/standardSchedules/${schedule_id}`, {
              start_time,
              end_time,
            });
          } else {
            return api.post("/standardSchedules", {
              doctor_id,
              weekday: day,
              start_time,
              end_time,
            });
          }
        })
        .filter(Boolean);

      await Promise.all(requests);

      Swal.fire({
        icon: "success",
        title: "Success",
        text: "Schedule saved/updated successfully!",
        timer: 1500,
        showConfirmButton: false,
      });

      setFormData({
        doctor_id: "",
        schedule: days.reduce((acc, day) => {
          acc[day] = { start_time: "", end_time: "", schedule_id: null };
          return acc;
        }, {}),
      });

      fetchSchedules();
    } catch (err) {
      console.error("Error saving the schedule", err);
      setError("Error saving the schedule");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteSchedule = async (schedule_id) => {
    const result = await Swal.fire({
      title: "Are you sure you want to delete this schedule?",
      text: "This action cannot be undone!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
      confirmButtonColor: "#51A485",
      cancelButtonColor: "#d33",
    });

    if (!result.isConfirmed) return;

    try {
      await api.delete(`/standardSchedules/${schedule_id}`);
      Swal.fire({
        icon: "success",
        title: "Deleted",
        text: "Schedule deleted successfully!",
        timer: 1500,
        showConfirmButton: false,
      });
      fetchSchedules();
    } catch (err) {
      console.error("Error deleting the schedule:", err);
      setError("Error deleting the schedule");
    }
  };

  return (
    <div className="d-flex" style={{ minHeight: "100vh" }}>
      <Sidebar role="admin" />
      <div className="container mt-4">
        <h2>Set Schedule for Doctor</h2>
        {error && <div className="alert alert-danger">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label>Doctor:</label>
            <select
              name="doctor_id"
              className="form-select"
              value={formData.doctor_id}
              onChange={handleChange}
              required
            >
              <option value="">Select a doctor</option>
              {doctors.map((doctor) => (
                <option key={doctor.id} value={doctor.id}>
                  {doctor.name}
                </option>
              ))}
            </select>
          </div>

          <h5>Schedules for the days of the week:</h5>
          {days.map((day) => (
            <div key={day} className="mb-4 border p-3 rounded">
              <h6>{day}</h6>
              <div className="row">
                <div className="col-md-6 mb-2">
                  <label>Start time:</label>
                  <input
                    type="time"
                    name="start_time"
                    className="form-control"
                    value={formData.schedule[day].start_time}
                    onChange={(e) => handleChange(e, day)}
                  />
                </div>
                <div className="col-md-6 mb-2">
                  <label>End time:</label>
                  <input
                    type="time"
                    name="end_time"
                    className="form-control"
                    value={formData.schedule[day].end_time}
                    onChange={(e) => handleChange(e, day)}
                  />
                </div>
              </div>
            </div>
          ))}

          <button
            type="submit"
            className="btn mt-3"
            style={{
              backgroundColor: "#51A485",
              borderColor: "#51A485",
              color: "white",
            }}
            disabled={loading}
          >
            {loading ? "Saving..." : "Save Schedule"}
          </button>
        </form>

        <hr className="my-4" />
        <h4 className="mb-3">Standard Schedule</h4>
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
