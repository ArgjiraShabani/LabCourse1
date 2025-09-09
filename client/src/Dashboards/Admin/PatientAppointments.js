/*import React, { useEffect, useState } from "react";
import axios from "axios";
import Sidebar from "../../Components/AdminSidebar";
import Swal from "sweetalert2";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useNavigate } from "react-router-dom";
import Button from "react-bootstrap/Button";

const schema = yup.object().shape({
  patient_id: yup.number().required("Patient is required"),
  name: yup.string().required("First name is required"),
  lastname: yup.string().required("Last name is required"),
  service_id: yup.number().required("Service is required"),
  doctor_id: yup.number().required("Doctor is required"),
  date: yup.string().required("Date is required"),
  time: yup.string().required("Time is required"),
  purpose: yup.string(),
});

function PatientAppointments() {
  const navigate = useNavigate();
  const [userRole, setUserRole] = useState(null);
  const [loading, setLoading] = useState(true);

  const [appointments, setAppointments] = useState([]);
  const [services, setServices] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [patients, setPatients] = useState([]);
  const [availableSlots, setAvailableSlots] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [filterPatient, setFilterPatient] = useState("");
  const [filterDoctor, setFilterDoctor] = useState("");
  const [filterService, setFilterService] = useState("");
  const [filterDate, setFilterDate] = useState("");

  const today = new Date();
  const [daysLimit, setDaysLimit] = useState(30);
  const [maxDate, setMaxDate] = useState(new Date());

  const [selectedDate, setSelectedDate] = useState("");
  const [formData, setFormData] = useState({ doctor_id: "", service_id: "" });

  const allPatients = Array.from(
    new Set(appointments.map((a) => `${a.patient_name} ${a.patient_lastname}`))
  );
  const allDoctors = Array.from(
    new Set(
      appointments.map(
        (a) => a.doctor_name || `${a.doctor_firstname} ${a.doctor_lastname}`
      )
    )
  );
  const allServices = Array.from(
    new Set(appointments.map((a) => a.service_name))
  );

  const filteredAppointments = appointments.filter((app) => {
    const patientFullName = `${app.patient_name} ${app.patient_lastname}`;
    const doctorFullName =
      app.doctor_name || `${app.doctor_firstname} ${app.doctor_lastname}`;
    const dateOnly = app.appointment_datetime.split("T")[0];

    return (
      (filterPatient === "" || patientFullName === filterPatient) &&
      (filterDoctor === "" || doctorFullName === filterDoctor) &&
      (filterService === "" || app.service_name === filterService) &&
      (filterDate === "" || dateOnly === filterDate)
    );
  });

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const watchService = watch("service_id");
  const watchDoctor = watch("doctor_id");
  const watchDate = watch("date");

  useEffect(() => {
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
      .get("http://localhost:3001/PatientAppointments", {
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
          return;
        }
        setUserRole(res.data.user.role);
        setLoading(false);
      })
      .catch(() => navigate("/login"));
  }, [navigate]);

  useEffect(() => {
    if (userRole !== "admin") return;

    axios
      .all([
        axios.get("http://localhost:3001/all-patient-appointments", {
          withCredentials: true,
        }),
        axios.get("http://localhost:3001/services", { withCredentials: true }),
        axios.get("http://localhost:3001/patient/patients-dropdown", {
          withCredentials: true,
        }),
      ])
      .then(
        axios.spread((appsRes, servicesRes, patientsRes) => {
          setAppointments(appsRes.data);
          setServices(servicesRes.data);
          setPatients(patientsRes.data);
        })
      )
      .catch((err) => console.error(err));
  }, [userRole]);

  useEffect(() => {
    if (!watchService) {
      setDoctors([]);
      setValue("doctor_id", "");
      setAvailableSlots([]);
      return;
    }
    const service = services.find(
      (s) => s.service_id === parseInt(watchService)
    );
    if (!service) return;

    axios
      .get(
        `http://localhost:3001/doctors/byDepartment/${service.department_Id}`,
        {
          withCredentials: true,
        }
      )
      .then((res) => setDoctors(res.data))
      .catch(() => setDoctors([]));

    setValue("doctor_id", "");
    setAvailableSlots([]);
  }, [watchService, services, setValue]);

  useEffect(() => {
    setFormData((prev) => ({ ...prev, doctor_id: watchDoctor }));
    setSelectedDate(watchDate);
  }, [watchDoctor, watchDate]);

  useEffect(() => {
    const generateSlots = (start, end) => {
      const slots = [];
      let [h, m] = start.split(":").map(Number);
      const [endH, endM] = end.split(":").map(Number);

      while (h < endH || (h === endH && m <= endM)) {
        slots.push(
          `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`
        );
        m += 30;
        if (m >= 60) {
          h++;
          m -= 60;
        }
      }
      return slots;
    };

    const fetchSlots = async () => {
      if (!selectedDate || !formData.doctor_id) return;

      const todayDate = new Date();
      const selDateObj = new Date(selectedDate);
      if (selDateObj < todayDate || selDateObj > maxDate) return;

      try {
        const [standardRes, customRes] = await Promise.all([
          axios.get("http://localhost:3001/api/standardSchedules", {
            withCredentials: true,
          }),
          axios.get("http://localhost:3001/api/weekly-schedules", {
            withCredentials: true,
          }),
        ]);

        const weekday = selDateObj.toLocaleDateString("en-US", {
          weekday: "long",
        });
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

        let todaySchedule = custom || standard;

        const prevDay = new Date(selDateObj);
        prevDay.setDate(prevDay.getDate() - 1);
        const prevWeekday = prevDay.toLocaleDateString("en-US", {
          weekday: "long",
        });

        const prevCustom = customRes.data.find(
          (s) =>
            s.doctor_id === parseInt(formData.doctor_id) &&
            s.weekday === prevWeekday
        );
        const prevStandard = standardRes.data.find(
          (s) =>
            s.doctor_id === parseInt(formData.doctor_id) &&
            s.weekday === prevWeekday
        );

        let prevSchedule = prevCustom || prevStandard;

        let allSlots = [];

        if (prevSchedule) {
          const [prevStartH, prevStartM] = prevSchedule.start_time
            .split(":")
            .map(Number);
          const [prevEndH, prevEndM] = prevSchedule.end_time
            .split(":")
            .map(Number);
          if (
            prevEndH < prevStartH ||
            (prevEndH === prevStartH && prevEndM < prevStartM)
          ) {
            allSlots = [
              ...allSlots,
              ...generateSlots("00:00", prevSchedule.end_time),
            ];
          }
        }

        if (todaySchedule) {
          const [startH, startM] = todaySchedule.start_time
            .split(":")
            .map(Number);
          const [endH, endM] = todaySchedule.end_time.split(":").map(Number);

          if (endH < startH || (endH === startH && endM < startM)) {
            allSlots = [
              ...allSlots,
              ...generateSlots(todaySchedule.start_time, "23:59"),
            ];
          } else {
            allSlots = [
              ...allSlots,
              ...generateSlots(
                todaySchedule.start_time,
                todaySchedule.end_time
              ),
            ];
          }
        }

        const bookedRes = await axios.get(
          "http://localhost:3001/appointments/bookedSlots",
          {
            params: { doctor_id: formData.doctor_id, date: selectedDate },
            withCredentials: true,
          }
        );

        const bookedSlots = bookedRes.data;
        setAvailableSlots(
          allSlots.filter((slot) => !bookedSlots.includes(slot))
        );
      } catch (err) {
        console.error("Error fetching available slots:", err.message);
        setAvailableSlots([]);
      }
    };

    fetchSlots();
  }, [formData.doctor_id, selectedDate, maxDate]);

  const openForm = (appointment = null) => {
    if (appointment) {
      reset({
        patient_id: appointment.patient_id,
        name: appointment.patient_name,
        lastname: appointment.patient_lastname,
        service_id: appointment.service_id,
        doctor_id: appointment.doctor_id,
        date: appointment.appointment_datetime.split("T")[0],
        time: appointment.appointment_time || "",
        purpose: appointment.purpose,
      });
      setEditingId(appointment.id);
    } else {
      reset({
        patient_id: "",
        name: "",
        lastname: "",
        service_id: "",
        doctor_id: "",
        date: "",
        time: "",
        purpose: "",
      });
      setEditingId(null);
      setAvailableSlots([]);
    }
    setShowForm(true);
  };

  const onSubmit = (data) => {
    if (!data.date || !data.time) {
      Swal.fire("Missing Info", "Please select date and time.", "warning");
      return;
    }

    const payload = {
      ...data,
      appointment_datetime: `${data.date}T${data.time}`,
      status: "pending",
    };

    const req = editingId
      ? axios.put(`http://localhost:3001/appointments/${editingId}`, payload, {
          withCredentials: true,
        })
      : axios.post("http://localhost:3001/appointments", payload, {
          withCredentials: true,
        });

    req
      .then(() => {
        Swal.fire(editingId ? "Updated!" : "Booked!", "", "success");
        setShowForm(false);
        axios
          .get("http://localhost:3001/all-patient-appointments", {
            withCredentials: true,
          })
          .then((res) => setAppointments(res.data));
      })
      .catch(() => Swal.fire("Error", "Something went wrong", "error"));
  };

  const handleDelete = (id) => {
    Swal.fire({
      title: "Delete this appointment?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Delete",
    }).then((result) => {
      if (result.isConfirmed) {
        axios
          .delete(`http://localhost:3001/all-patient-appointments/${id}`, {
            withCredentials: true,
          })
          .then(() => {
            setAppointments((prev) => prev.filter((a) => a.id !== id));
            Swal.fire("Deleted!", "", "success");
          })
          .catch(() => Swal.fire("Failed", "", "error"));
      }
    });
  };

  if (loading) return <div>Loading...</div>;
  if (userRole !== "admin") return null;

  return (
    <div className="d-flex" style={{ minHeight: "100vh" }}>
      <Sidebar role={userRole} />
      <div className="container py-4 flex-grow-1">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2>Appointments</h2>
          <Button
            style={{ backgroundColor: "#51A485", borderColor: "#51A485" }}
            size="md"
            onClick={() => openForm()}
          >
            Book Appointment
          </Button>
        </div>

        <div className="table-responsive">
          <div className="mb-3 d-flex gap-2">
            <select
              className="form-select"
              onChange={(e) => setFilterPatient(e.target.value)}
              style={{ border: "2px solid #51A485", borderRadius: "5px" }}
            >
              <option value="">All Patients</option>
              {allPatients.map((name, i) => (
                <option key={i} value={name}>
                  {name}
                </option>
              ))}
            </select>

            <select
              className="form-select"
              onChange={(e) => setFilterDoctor(e.target.value)}
              style={{ border: "2px solid #51A485", borderRadius: "5px" }}
            >
              <option value="">All Doctors</option>
              {allDoctors.map((name, i) => (
                <option key={i} value={name}>
                  {name}
                </option>
              ))}
            </select>

            <select
              className="form-select"
              onChange={(e) => setFilterService(e.target.value)}
              style={{ border: "2px solid #51A485", borderRadius: "5px" }}
            >
              <option value="">All Services</option>
              {allServices.map((name, i) => (
                <option key={i} value={name}>
                  {name}
                </option>
              ))}
            </select>

            <input
              type="date"
              className="form-control"
              onChange={(e) => setFilterDate(e.target.value)}
              style={{ border: "2px solid #51A485", borderRadius: "5px" }}
            />
          </div>

          <table className="table table-bordered table-hover align-middle">
            <thead>
              <tr>
                <th>ID</th>
                <th>Patient</th>
                <th>Doctor</th>
                <th>Date & Time</th>
                <th>Purpose</th>
                <th>Service</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredAppointments.length === 0 ? (
                <tr>
                  <td colSpan="7" className="text-center">
                    No appointments found
                  </td>
                </tr>
              ) : (
                filteredAppointments.map((app) => (
                  <tr key={app.id}>
                    <td>{app.id}</td>
                    <td>
                      {app.patient_name} {app.patient_lastname}
                    </td>
                    <td>
                      {app.doctor_name ||
                        `${app.doctor_firstname} ${app.doctor_lastname}`}
                    </td>
                    <td>{app.appointment_datetime}</td>
                    <td>{app.purpose}</td>
                    <td>{app.service_name}</td>
                    <td style={{ display: "flex", gap: "5px" }}>
                      <Button
                        size="sm"
                        style={{
                          backgroundColor: "#51A485",
                          borderColor: "#51A485",
                          color: "#fff",
                        }}
                        onClick={() => openForm(app)}
                      >
                        Edit
                      </Button>
                      <Button
                        size="sm"
                        variant="danger"
                        onClick={() => handleDelete(app.id)}
                      >
                        Delete
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {showForm && (
          <div
            className="modal"
            style={{ display: "block", backgroundColor: "rgba(0,0,0,0.5)" }}
          >
            <div className="modal-dialog">
              <form
                className="modal-content p-3"
                onSubmit={handleSubmit(onSubmit)}
              >
                <h5>{editingId ? "Edit Appointment" : "Book Appointment"}</h5>

                <div className="mb-3">
                  <label>Patient</label>
                  <select
                    {...register("patient_id")}
                    className={`form-control ${
                      errors.patient_id ? "is-invalid" : ""
                    }`}
                  >
                    <option value="">Select Patient</option>
                    {patients.map((p) => (
                      <option key={p.patient_id} value={p.patient_id}>
                        {p.first_name} {p.last_name}
                      </option>
                    ))}
                  </select>
                  <div className="invalid-feedback">
                    {errors.patient_id?.message}
                  </div>
                </div>

                <div className="mb-3">
                  <label>First Name</label>
                  <input
                    {...register("name")}
                    className={`form-control ${
                      errors.name ? "is-invalid" : ""
                    }`}
                  />
                  <div className="invalid-feedback">{errors.name?.message}</div>
                </div>

                <div className="mb-3">
                  <label>Last Name</label>
                  <input
                    {...register("lastname")}
                    className={`form-control ${
                      errors.lastname ? "is-invalid" : ""
                    }`}
                  />
                  <div className="invalid-feedback">
                    {errors.lastname?.message}
                  </div>
                </div>

                <div className="mb-3">
                  <label>Service</label>
                  <select
                    {...register("service_id")}
                    className={`form-control ${
                      errors.service_id ? "is-invalid" : ""
                    }`}
                  >
                    <option value="">Select Service</option>
                    {services.map((s) => (
                      <option key={s.service_id} value={s.service_id}>
                        {s.service_name}
                      </option>
                    ))}
                  </select>
                  <div className="invalid-feedback">
                    {errors.service_id?.message}
                  </div>
                </div>

                <div className="mb-3">
                  <label>Doctor</label>
                  <select
                    {...register("doctor_id")}
                    className={`form-control ${
                      errors.doctor_id ? "is-invalid" : ""
                    }`}
                    disabled={!watchService}
                  >
                    <option value="">Select Doctor</option>
                    {doctors.map((d) => (
                      <option key={d.doctor_id} value={d.doctor_id}>
                        {d.first_name} {d.last_name}
                      </option>
                    ))}
                  </select>
                  <div className="invalid-feedback">
                    {errors.doctor_id?.message}
                  </div>
                </div>

                <div className="mb-3">
                  <label>Date</label>
                  <input
                    type="date"
                    {...register("date")}
                    className={`form-control ${
                      errors.date ? "is-invalid" : ""
                    }`}
                    min={today.toISOString().split("T")[0]}
                    max={maxDate.toISOString().split("T")[0]}
                  />
                  <div className="invalid-feedback">{errors.date?.message}</div>
                </div>

                {watchDate && availableSlots.length > 0 && (
                  <div className="mb-3">
                    <label>Time Slot</label>
                    <select
                      {...register("time")}
                      className={`form-control ${
                        errors.time ? "is-invalid" : ""
                      }`}
                    >
                      <option value="">Select Time Slot</option>
                      {availableSlots.map((slot) => (
                        <option key={slot} value={slot}>
                          {slot}
                        </option>
                      ))}
                    </select>
                    <div className="invalid-feedback">
                      {errors.time?.message}
                    </div>
                  </div>
                )}

                {watchDate && availableSlots.length === 0 && (
                  <div className="alert alert-warning">
                    No available slots for this date.
                  </div>
                )}

                <div className="mb-3">
                  <label>Purpose</label>
                  <textarea {...register("purpose")} className="form-control" />
                </div>

                <div className="d-flex">
                  <Button
                    type="submit"
                    size="sm"
                    style={{
                      backgroundColor: "#51A485",
                      borderColor: "#51A485",
                      color: "#fff",
                    }}
                    className="me-2"
                  >
                    {editingId ? "Update" : "Book"}
                  </Button>

                  <Button
                    type="button"
                    size="sm"
                    variant="danger"
                    onClick={() => setShowForm(false)}
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default PatientAppointments;
*/