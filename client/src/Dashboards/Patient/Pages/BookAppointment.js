import Sidebar from "../../../Components/AdminSidebar";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";
import { useState,useEffect } from "react";

const api = axios.create({
  baseURL: "http://localhost:3001/api",
  withCredentials: true,
});

function BookAppointment() {
  const [services, setServices] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [availableSlots, setAvailableSlots] = useState([]);
  const [daysLimit, setDaysLimit] = useState(30);
  const [maxDate, setMaxDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTimeSlot, setSelectedTimeSlot] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    lastname: "",
    service_id: "",
    doctor_id: "",
    purpose: "",
  });

  const navigate = useNavigate();
  const { id } = useParams();

  const api = axios.create({
  baseURL: "http://localhost:3001/api",
  withCredentials: true,
});

  function generateSlots(start, end) {
    const slots = [];
    let [h, m] = start.split(":").map(Number);
    const [endH, endM] = end.split(":").map(Number);

    while (h < endH || (h === endH && m < endM)) {
      slots.push(`${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`);
      m += 30;
      if (m >= 60) {
        h++;
        m -= 60;
      }
    }
    return slots;
  }

  useEffect(() => {
    const today = new Date();
    axios
      .get("http://localhost:3001/api/settings", { withCredentials: true })
      .then((res) => {
        const limit = res.data?.booking_days_limit ?? 30;
        setDaysLimit(limit);

        const max = new Date(today);
        max.setDate(max.getDate() + limit);
        setMaxDate(max);
      })
      .catch(() => {
        const max = new Date(today);
        max.setDate(max.getDate() + 30);
        setMaxDate(max);
      });
  }, []);

  useEffect(() => {
    axios
      .get(`http://localhost:3001/BookAppointment`, { withCredentials: true })
      .then((res) => {
        if (res.data.user?.role !== "patient") {
          Swal.fire({
            icon: "error",
            title: "Access Denied",
            text: "Only patients can access this page.",
            confirmButtonColor: "#51A485",
          });
          navigate("/");
        }
      })
      .catch((err) => {
            if (err.response && (err.response.status === 401 || err.response.status === 403)) {
                 Swal.fire({
                                          icon: "error",
                                          title: "Access Denied",
                                          text: "Please login.",
                                          confirmButtonColor: "#51A485",
                                        });
      
              navigate('/');
            } else {
              console.error("Unexpected error", err);
            }
          });
      }, [navigate]);

  useEffect(() => {
    axios
      .get("http://localhost:3001/services")
      .then((res) => setServices(res.data))
      .catch((err) => console.error("Error fetching services:", err.message));
  }, []);

  useEffect(() => {
    if (formData.service_id && services.length > 0) {
      const selectedService = services.find(
        (s) => parseInt(s.service_id) === parseInt(formData.service_id)
      );

      if (selectedService?.department_Id) {
        axios
          .get(
            `http://localhost:3001/doctors/byDepartment/${selectedService.department_Id}`
          )
          .then((res) => setDoctors(res.data))
          .catch(() => setDoctors([]));
      } else setDoctors([]);
    } else setDoctors([]);
  }, [formData.service_id, services]);

  useEffect(() => {
  const fetchSlots = async () => {
    if (!selectedDate || !formData.doctor_id) return;

   const selDateObj = new Date(selectedDate);
const todayOnly = new Date();
todayOnly.setHours(0, 0, 0, 0); 

if (selDateObj < todayOnly || selDateObj > maxDate) return;



    try {
      const [standardRes, customRes] = await Promise.all([
        axios.get("http://localhost:3001/api/standardSchedules", { withCredentials: true }),
        axios.get("http://localhost:3001/api/weekly-schedules", { withCredentials: true }),
      ]);

      const weekday = selDateObj.toLocaleDateString("en-US", { weekday: "long" });
      const custom = customRes.data.find(
        (s) => s.doctor_id === parseInt(formData.doctor_id) && s.weekday === weekday
      );
      const standard = standardRes.data.find(
        (s) => s.doctor_id === parseInt(formData.doctor_id) && s.weekday === weekday
      );

      let todaySchedule = custom || standard;

      const prevDay = new Date(selDateObj);
      prevDay.setDate(prevDay.getDate() - 1);
      const prevWeekday = prevDay.toLocaleDateString("en-US", { weekday: "long" });

      const prevCustom = customRes.data.find(
        (s) => s.doctor_id === parseInt(formData.doctor_id) && s.weekday === prevWeekday
      );
      const prevStandard = standardRes.data.find(
        (s) => s.doctor_id === parseInt(formData.doctor_id) && s.weekday === prevWeekday
      );

      let prevSchedule = prevCustom || prevStandard;

      let allSlots = [];

      if (prevSchedule) {
        const [prevStartH, prevStartM] = prevSchedule.start_time.split(":").map(Number);
        const [prevEndH, prevEndM] = prevSchedule.end_time.split(":").map(Number);
        if (prevEndH < prevStartH || (prevEndH === prevStartH && prevEndM < prevStartM)) {
          allSlots = [...allSlots, ...generateSlots("00:00", prevSchedule.end_time)];
        }
      }

      if (todaySchedule) {
        const [startH, startM] = todaySchedule.start_time.split(":").map(Number);
        const [endH, endM] = todaySchedule.end_time.split(":").map(Number);

        if (endH < startH || (endH === startH && endM < startM)) {
          allSlots = [...allSlots, ...generateSlots(todaySchedule.start_time, "23:59")];
        } else {
          allSlots = [...allSlots, ...generateSlots(todaySchedule.start_time, todaySchedule.end_time)];
        }
      }

      const bookedRes = await axios.get("http://localhost:3001/appointments/bookedSlots", {
        params: { doctor_id: formData.doctor_id, date: selectedDate },
        withCredentials: true,
      });

      const bookedSlots = bookedRes.data;
      setAvailableSlots(allSlots.filter((slot) => !bookedSlots.includes(slot)));
    } catch (err) {
      console.error("Error fetching available slots:", err.message);
      setAvailableSlots([]);
    }
  };

  fetchSlots();
}, [formData.doctor_id, selectedDate, maxDate]);


  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "service_id" || name === "doctor_id" ? parseInt(value) : value,
    }));
  };

  const handleDateChange = (e) => {
    setSelectedDate(e.target.value);
    setSelectedTimeSlot("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!selectedDate || !selectedTimeSlot) {
      Swal.fire({
        icon: "warning",
        title: "Missing Information",
        text: "Please select a date and time slot.",
        confirmButtonColor: "#51A485",
        confirmButtonText: "OK",
      });
      return;
    }

    axios
      .post(
        "http://localhost:3001/appointments",
        {
          ...formData,
          patient_id: parseInt(id),
          appointment_datetime: `${selectedDate}T${selectedTimeSlot}`,
          status: "pending",
        },
        { withCredentials: true }
      )
      .then((res) => {
        Swal.fire({
          icon: "success",
          title: "Appointment Booked!",
          text: res.data.message || "Your appointment has been successfully booked.",
          confirmButtonColor: "#51A485",
          confirmButtonText: "OK",
        });

        setFormData({ name: "", lastname: "", service_id: "", doctor_id: "", purpose: "" });
        setSelectedDate("");
        setSelectedTimeSlot("");
        setAvailableSlots([]);
      })
      .catch((err) => {
        console.error("Error while booking:", err.message);
        Swal.fire({
          icon: "error",
          title: "Booking Failed",
          text: "Please try again.",
          confirmButtonColor: "#d33",
          confirmButtonText: "OK",
        });
      });
  };

  const today = new Date();

  return (
    <div className="d-flex" style={{ minHeight: "100vh" }}>
      <Sidebar role="patient" id={id} />
      <div className="container mt-5">
        <h2>Book Appointment</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label>First Name</label>
            <input type="text" className="form-control" name="name" value={formData.name} onChange={handleChange} required />
          </div>

          <div className="mb-3">
            <label>Last Name</label>
            <input type="text" className="form-control" name="lastname" value={formData.lastname} onChange={handleChange} required />
          </div>

          <div className="mb-3">
            <label>Service</label>
            <select className="form-control" name="service_id" value={formData.service_id} onChange={handleChange} required>
              <option value="">Select Service</option>
              {services.map((s) => (
                <option key={s.service_id} value={s.service_id}>
                  {s.service_name}
                </option>
              ))}
            </select>
          </div>

          <div className="mb-3">
            <label>Doctor</label>
            <select className="form-control" name="doctor_id" value={formData.doctor_id} onChange={handleChange} required>
              <option value="">Select Doctor</option>
              {doctors.map((d) => (
                <option key={d.doctor_id} value={d.doctor_id}>
                  {d.first_name} {d.last_name}
                </option>
              ))}
            </select>
          </div>

          <div className="mb-3">
            <label>Select Date</label>
            <input
              type="date"
              className="form-control"
              value={selectedDate}
              onChange={handleDateChange}
              min={today.toISOString().split("T")[0]}
              max={maxDate.toISOString().split("T")[0]}
              required
              disabled={!formData.doctor_id}
            />
          </div>

          {selectedDate && availableSlots.length === 0 && <div className="alert alert-warning">No available slots for this date.</div>}

          {selectedDate && availableSlots.length > 0 && (
            <div className="mb-3">
              <label>Available Time Slots</label>
              <select className="form-control" value={selectedTimeSlot} onChange={(e) => setSelectedTimeSlot(e.target.value)} required>
                <option value="">Select Time Slot</option>
                {availableSlots.map((slot) => (
                  <option key={slot} value={slot}>
                    {slot}
                  </option>
                ))}
              </select>
            </div>
          )}

          <div className="mb-3">
            <label>Purpose</label>
            <textarea className="form-control" name="purpose" value={formData.purpose} onChange={handleChange} />
          </div>

          <button type="submit" className="btn btn-success">Book Appointment</button>
        </form>
      </div>
    </div>
  );
}

export default BookAppointment;
