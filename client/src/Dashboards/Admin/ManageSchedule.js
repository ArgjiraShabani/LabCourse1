import React, { useEffect, useState } from "react";
import axios from "axios";
import Sidebar from "../../Components/AdminSidebar";

const ManageSchedule = () => {
  const [doctors, setDoctors] = useState([]);
  const [formData, setFormData] = useState({
    doctor_id: "",
    schedule: {
      Monday: { start_time: "", end_time: "", shift_type: "morning" },
      Tuesday: { start_time: "", end_time: "", shift_type: "morning" },
      Wednesday: { start_time: "", end_time: "", shift_type: "morning" },
      Thursday: { start_time: "", end_time: "", shift_type: "morning" },
      Friday: { start_time: "", end_time: "", shift_type: "morning" },
      Saturday: { start_time: "", end_time: "", shift_type: "morning" },
      Sunday: { start_time: "", end_time: "", shift_type: "morning" },
    },
  });
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

  useEffect(() => {
    fetchDoctors();
    fetchSchedules();
  }, []);

  const fetchDoctors = async () => {
    try {
      const res = await axios.get("http://localhost:3001/api/doctors");
      console.log("Doctors:", res.data);
      setDoctors(res.data);
    } catch (err) {
      setError("Gabim me listen e mjekeve");
    }
  };

  const fetchSchedules = async () => {
    try {
      const res = await axios.get(
        "http://localhost:3001/api/standardSchedules"
      );
      setSchedules(res.data);
    } catch (err) {
      console.error("Gabim gjate marrjes se orareve:", err);
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
        const res = await axios.get(
          "http://localhost:3001/api/standardSchedules"
        );
        const doctorSchedule = res.data.filter(
          (item) => item.doctor_id === parseInt(formData.doctor_id)
        );

        const updatedSchedule = { ...formData.schedule };

        doctorSchedule.forEach((entry) => {
          if (entry.schedule_id) {
            updatedSchedule[entry.weekday] = {
              start_time: entry.start_time?.slice(0, 5),
              end_time: entry.end_time?.slice(0, 5),
              shift_type: entry.shift_type,
              schedule_id: entry.schedule_id,
            };
          } else {
            updatedSchedule[entry.weekday] = {
              start_time: entry.start_time?.slice(0, 5),
              end_time: entry.end_time?.slice(0, 5),
              shift_type: entry.shift_type,
              schedule_id: null,
            };
          }
        });

        setFormData((prev) => ({
          ...prev,
          schedule: updatedSchedule,
        }));
      } catch (err) {
        console.error("Deshtoi ngarkimi i orarit te mjekut:", err);
      }
    };

    fetchDoctorSchedule();
  }, [formData.doctor_id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const { doctor_id, schedule } = formData;

    try {
      const requests = days
        .map((day) => {
          const { start_time, end_time, shift_type, schedule_id } =
            schedule[day];
          if (!start_time || !end_time || !shift_type) return null;

          if (schedule_id) {
            return axios.put(
              `http://localhost:3001/api/standardSchedules/${schedule_id}`,
              {
                start_time,
                end_time,
                shift_type,
              }
            );
          } else {
            return axios.post("http://localhost:3001/api/standardSchedules", {
              doctor_id,
              weekday: day,
              start_time,
              end_time,
              shift_type,
            });
          }
        })
        .filter(Boolean);

      await Promise.all(requests);

      alert("Orari u ruajt/përditësua me sukses!");

      setFormData({
        doctor_id: "",
        schedule: days.reduce((acc, day) => {
          acc[day] = { start_time: "", end_time: "", shift_type: "morning" };
          return acc;
        }, {}),
      });

      fetchSchedules();
    } catch (err) {
      console.error("Gabim gjate ruajtjes se orarit", err);
      setError("Gabim gjate ruajtjes se orarit");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="d-flex" style={{ minHeight: "100vh" }}>
      <Sidebar role="admin" />
      <div className="container mt-4">
        <h2>Cakto Orarin për Mjekun</h2>
        {error && <div className="alert alert-danger">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label>Mjeku:</label>
            <select
              name="doctor_id"
              className="form-select"
              value={formData.doctor_id}
              onChange={handleChange}
              required
            >
              <option value="">Zgjedh mjekun</option>
              {doctors.map((doctor) => (
                <option key={doctor.id} value={doctor.id}>
                  {doctor.name}
                </option>
              ))}
            </select>
          </div>

          <h5>Oraret për ditët e javës:</h5>
          {days.map((day) => (
            <div key={day} className="mb-4 border p-3 rounded">
              <h6>{day}</h6>
              <div className="row">
                <div className="col-md-4 mb-2">
                  <label>Ora e fillimit:</label>
                  <input
                    type="time"
                    name="start_time"
                    className="form-control"
                    value={formData.schedule[day].start_time}
                    onChange={(e) => handleChange(e, day)}
                  />
                </div>
                <div className="col-md-4 mb-2">
                  <label>Ora e mbarimit:</label>
                  <input
                    type="time"
                    name="end_time"
                    className="form-control"
                    value={formData.schedule[day].end_time}
                    onChange={(e) => handleChange(e, day)}
                  />
                </div>
                <div className="col-md-3 mb-2">
                  <label>Ndërrimi:</label>
                  <select
                    name="shift_type"
                    className="form-select"
                    value={formData.schedule[day].shift_type}
                    onChange={(e) => handleChange(e, day)}
                  >
                    <option value="morning">Paradite</option>
                    <option value="afternoon">Pasdite</option>
                    <option value="night">Nate</option>
                  </select>
                </div>
                <div className="col-md-1 d-flex align-items-end"></div>
              </div>
            </div>
          ))}

          <button
            type="submit"
            className="btn btn-success mt-3"
            disabled={loading}
          >
            {loading ? "Duke ruajtur..." : "Ruaj Orarin"}
          </button>
        </form>

        <hr className="my-4" />
        <h4 className="mb-3">Oraret ekzistuese</h4>
        <div className="table-responsive">
          <table className="table table-bordered">
            <thead className="table-light">
              <tr>
                <th>ID</th>
                <th>Mjeku</th>
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
                      (s) => s.doctor_name === item.doctor_name
                    );
                    if (!existing) {
                      existing = {
                        schedule_id: item.schedule_id,
                        doctor_name: item.doctor_name,
                      };
                      days.forEach((day) => (existing[day] = {}));
                      acc.push(existing);
                    }
                    existing[item.weekday] = {
                      start_time: item.start_time.slice(0, 5),
                      end_time: item.end_time.slice(0, 5),
                      shift_type: item.shift_type,
                    };
                    return acc;
                  }, [])
                  .map((schedule) => (
                    <tr key={schedule.schedule_id}>
                      <td>{schedule.schedule_id}</td>
                      <td>{schedule.doctor_name}</td>
                      {days.map((day) => (
                        <td key={day}>
                          {schedule[day]?.start_time
                            ? `${schedule[day].start_time} - ${schedule[day].end_time}`
                            : "-"}
                        </td>
                      ))}
                    </tr>
                  ))
              ) : (
                <tr>
                  <td colSpan={days.length + 2} className="text-center">
                    Nuk ka te dhena
                  </td>
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