import React, { useState, useEffect } from "react";
import Sidebar from "../../../Components/AdminSidebar";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

function BookAppointment() {
  const [services, setServices] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [availableSlots, setAvailableSlots] = useState([]);
  const navigate = useNavigate();
  const param = useParams();
  const { id } = param;

  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTimeSlot, setSelectedTimeSlot] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    lastname: "",
    service_id: "",
    doctor_id: "",
    purpose: "",
  });


  function getNextSunday(date) {
    const now = new Date(date);
    const day = now.getDay();
    const hour = now.getHours();

    let diff;
    if (day === 0 && hour >= 23) {
      diff = 7;
    } else {
      diff = day === 0 ? 0 : 7 - day;
    }

    const nextSunday = new Date(now);
    nextSunday.setDate(now.getDate() + diff);
    return nextSunday;
  }

  const today = new Date();
  const maxDate = getNextSunday(today);

  useEffect(() => {
    axios
      .get("http://localhost:3001/services")
      .then((res) => setServices(res.data))
      .catch((err) => console.error("Error fetching services:", err));
  }, []);

  useEffect(() => {
    if (formData.service_id && services.length > 0) {
      const selectedService = services.find(
        (service) =>
          parseInt(service.service_id) === parseInt(formData.service_id)
      );

      if (selectedService && selectedService.department_Id) {
        axios
          .get(
            `http://localhost:3001/doctors/byDepartment/${selectedService.department_Id}`
          )
          .then((res) => setDoctors(res.data))
          .catch((err) => {
            console.error("Error fetching doctors:", err);
            setDoctors([]);
          });
      } else {
        setDoctors([]);
      }
    } else {
      setDoctors([]);
    }
  }, [formData.service_id, services]);

  useEffect(() => {
    const fetchAvailableSlots = async () => {
      if (!selectedDate || !formData.doctor_id) {
        setAvailableSlots([]);
        return;
      }

      const weekday = new Date(selectedDate).toLocaleDateString("en-US", {
        weekday: "long",
      });

      try {
        const [standardRes, customRes] = await Promise.all([
          axios.get("http://localhost:3001/api/standardSchedules"),
          axios.get("http://localhost:3001/api/weeklySchedules"),
        ]);

        const custom = customRes.data.find(
          (s) =>
            s.doctor_id === parseInt(formData.doctor_id) &&
            s.weekday === weekday
        );

        const standard = standardRes.data.find(
          (s) =>
            s.doctor_id === parseInt(formData.doctor_id) &&
            s.weekday === weekday
        );

        const schedule = custom || standard;

        if (!schedule) {
          setAvailableSlots([]);
          return;
        }

        const generateSlots = (startTime, endTime) => {
          const slots = [];
          let [h, m] = startTime.split(":").map(Number);
          const [endH, endM] = endTime.split(":").map(Number);

          while (h < endH || (h === endH && m < endM)) {
            const slot = `${String(h).padStart(2, "0")}:${String(m).padStart(
              2,
              "0"
            )}`;
            slots.push(slot);
            m += 30;
            if (m >= 60) {
              h++;
              m -= 60;
            }
          }
          return slots;
        };

        const allSlots = generateSlots(schedule.start_time, schedule.end_time);

        try {
          const res = await axios.get(
            "http://localhost:3001/appointments/bookedSlots",
            {
              params: {
                doctor_id: formData.doctor_id,
                date: selectedDate,
              },
            }
          );

          const bookedSlots = res.data;
          const freeSlots = allSlots.filter(
            (slot) => !bookedSlots.includes(slot)
          );

          setAvailableSlots(freeSlots);
        } catch (err) {
          console.error("Error fetching booked slots:", err);
          setAvailableSlots(allSlots);
        }
      } catch (err) {
        console.error("Error fetching schedule:", err);
        setAvailableSlots([]);
      }
    };

    fetchAvailableSlots();
  }, [formData.doctor_id, selectedDate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        name === "service_id" || name === "doctor_id"
          ? parseInt(value)
          : value,
    }));
  };

  const handleDateChange = (e) => {
    setSelectedDate(e.target.value);
    setSelectedTimeSlot("");
  };

  const handleTimeSlotChange = (e) => {
    setSelectedTimeSlot(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const patient_id = localStorage.getItem("patient_id");
    if (!patient_id) {
      alert("You must be logged in to book an appointment.");
      return;
    }

    if (!selectedDate || !selectedTimeSlot) {
      alert("Please select a date and time slot.");
      return;
    }

    const appointment_datetime = `${selectedDate}T${selectedTimeSlot}`;

    axios
      .post("http://localhost:3001/appointments", {
        ...formData,
        appointment_datetime,
        patient_id: parseInt(patient_id),
        status: "pending",
      })
      .then((res) => {
        alert(res.data.message || "Appointment booked successfully!");
        setFormData({
          name: "",
          lastname: "",
          service_id: "",
          doctor_id: "",
          purpose: "",
        });
        setSelectedDate("");
        setSelectedTimeSlot("");
        setAvailableSlots([]);
      })
      .catch((err) => {
        console.error("Error while booking:", err);
        alert("Booking failed. Please try again.");
      });
  };

  return (
    <div className="d-flex" style={{ minHeight: "100vh" }}>
      <Sidebar role="patient" id={id} />
      <div className="container mt-5">
        <h2>Book Appointment</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label>First Name</label>
            <input
              type="text"
              className="form-control"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-3">
            <label>Last Name</label>
            <input
              type="text"
              className="form-control"
              name="lastname"
              value={formData.lastname}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-3">
            <label>Service</label>
            <select
              className="form-control"
              name="service_id"
              value={formData.service_id}
              onChange={handleChange}
              required
            >
              <option value="">Select Service</option>
              {services.map((service) => (
                <option key={service.service_id} value={service.service_id}>
                  {service.service_name}
                </option>
              ))}
            </select>
          </div>

          <div className="mb-3">
            <label>Doctor</label>
            <select
              className="form-control"
              name="doctor_id"
              value={formData.doctor_id}
              onChange={handleChange}
              required
            >
              <option value="">Select Doctor</option>
              {doctors.map((doc) => (
                <option key={doc.doctor_id} value={doc.doctor_id}>
                  {doc.first_name} {doc.last_name}
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

          {selectedDate && availableSlots.length === 0 && (
            <div className="alert alert-warning">
              There are no available time slots for this date. Please choose
              another one.
            </div>
          )}

          {selectedDate && availableSlots.length > 0 && (
            <div className="mb-3">
              <label>Available Time Slots</label>
              <select
                className="form-control"
                value={selectedTimeSlot}
                onChange={handleTimeSlotChange}
                required
              >
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
            <textarea
              className="form-control"
              name="purpose"
              value={formData.purpose}
              onChange={handleChange}
            />
          </div>

          <button type="submit" className="btn btn-success">
            Book Appointment
          </button>
        </form>
      </div>
    </div>
  );
}

export default BookAppointment;
