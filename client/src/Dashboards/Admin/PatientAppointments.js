import React, { useEffect, useState } from "react";
import axios from "axios";
import Sidebar from "../../Components/AdminSidebar";
import Swal from "sweetalert2";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useNavigate } from "react-router-dom";

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

const PatientAppointments = () => {
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
      .get("http://localhost:3001/PatientAppointments", {
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
          return;
        }
        setUserRole(res.data.user.role);
        setLoading(false);
      })
      .catch(() => {
        Swal.fire({
          icon: "error",
          title: "Access Denied",
          text: "Authentication failed.",
          confirmButtonColor: "#51A485",
        });
        navigate("/login");
      });
  }, [navigate]);

  useEffect(() => {
    if (userRole !== "admin") return;

    const fetchData = async () => {
      try {
        const [appsRes, servicesRes, patientsRes] = await Promise.all([
          axios.get("http://localhost:3001/all-patient-appointments", {
            withCredentials: true,
          }),
          axios.get("http://localhost:3001/services"),
          axios.get("http://localhost:3001/patient/patients-dropdown", {
            withCredentials: true,
          }),
        ]);
        setAppointments(appsRes.data);
        setServices(servicesRes.data);
        setPatients(patientsRes.data);
      } catch {
        setAppointments([]);
        setServices([]);
        setPatients([]);
      }
    };
    fetchData();
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
        `http://localhost:3001/doctors/byDepartment/${service.department_Id}`
      )
      .then((res) => setDoctors(res.data))
      .catch(() => setDoctors([]));
    setValue("doctor_id", "");
    setAvailableSlots([]);
  }, [watchService, services, setValue]);
  useEffect(() => {
    if (!watchDate || !watchDoctor) {
      setAvailableSlots([]);
      return;
    }

    (async () => {
      try {
        const [standardRes, customRes, bookedRes] = await Promise.all([
          axios.get("http://localhost:3001/api/standardSchedules", {
            withCredentials: true,
          }),
          axios.get("http://localhost:3001/api/weekly-schedules", {
            withCredentials: true,
          }),
          axios.get("http://localhost:3001/appointments/bookedSlots", {
            params: { doctor_id: watchDoctor, date: watchDate },
            withCredentials: true,
          }),
        ]);

        const weekday = new Date(watchDate).toLocaleDateString("en-US", {
          weekday: "long",
        });

        const customSchedule = customRes.data.find(
          (s) => s.doctor_id === parseInt(watchDoctor) && s.weekday === weekday
        );
        const standardSchedule = standardRes.data.find(
          (s) => s.doctor_id === parseInt(watchDoctor) && s.weekday === weekday
        );
        const schedule = customSchedule || standardSchedule;

        if (!schedule) {
          setAvailableSlots([]);
          return;
        }

        let slots = [];
        let [h, m] = schedule.start_time.split(":").map(Number);
        const [endH, endM] = schedule.end_time.split(":").map(Number);

        while (h < endH || (h === endH && m < endM)) {
          slots.push(
            `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`
          );
          m += 30;
          if (m >= 60) {
            h++;
            m -= 60;
          }
        }

        const freeSlots = slots.filter(
          (slot) => !bookedRes.data.includes(slot)
        );
        setAvailableSlots(freeSlots);
      } catch {
        setAvailableSlots([]);
      }
    })();
  }, [watchDate, watchDoctor]);

  const openForm = (appointment = null) => {
    if (appointment) {
      const datetime = new Date(appointment.appointment_datetime);
      reset({
        patient_id: appointment.patient_id,
        name: appointment.patient_name,
        lastname: appointment.patient_lastname,
        service_id: appointment.service_id,
        doctor_id: appointment.doctor_id,
        date: datetime.toISOString().split("T")[0],
        time: datetime.toTimeString().slice(0, 5),
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
            Swal.fire("Deleted!", "", "success");
            setAppointments((prev) => prev.filter((a) => a.id !== id));
          })
          .catch(() => Swal.fire("Failed to delete", "", "error"));
      }
    });
  };

  const onSubmit = (data) => {
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
        // Rifresko takimet
        axios
          .get("http://localhost:3001/all-patient-appointments", {
            withCredentials: true,
          })
          .then((res) => setAppointments(res.data));
      })
      .catch(() => Swal.fire("Something went wrong", "", "error"));
  };

  if (loading) return <div>Loading...</div>;
  if (userRole !== "admin") return null;

  return (
    <div className="d-flex" style={{ minHeight: "100vh" }}>
      <Sidebar role={userRole} />
      <div className="container py-4 flex-grow-1">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2>Appointments</h2>
          <button className="btn btn-success btn-sm" onClick={() => openForm()}>
            Book Appointment
          </button>
        </div>

        <table className="table table-bordered table-hover">
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
            {appointments.length === 0 ? (
              <tr>
                <td colSpan="7" className="text-center">
                  No appointments found
                </td>
              </tr>
            ) : (
              appointments.map((app) => (
                <tr key={app.id}>
                  <td>{app.id}</td>
                  <td>
                    {app.patient_name} {app.patient_lastname}
                  </td>
                  <td>
                    {app.doctor_name ||
                      `${app.doctor_firstname} ${app.doctor_lastname}`}
                  </td>
                  <td>{new Date(app.appointment_datetime).toLocaleString()}</td>
                  <td>{app.purpose}</td>
                  <td>{app.service_name}</td>
                  <td>
                    <button
                      className="btn btn-sm btn-outline-success me-2"
                      onClick={() => openForm(app)}
                    >
                      Edit
                    </button>
                    <button
                      className="btn btn-sm btn-danger"
                      onClick={() => handleDelete(app.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>

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

                {userRole === "admin" && (
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
                )}

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
                    min={new Date().toISOString().split("T")[0]}
                  />
                  <div className="invalid-feedback">{errors.date?.message}</div>
                </div>

                {watchDate && availableSlots.length === 0 && (
                  <div className="alert alert-warning">
                    No available time slots for this date. Please choose another
                    date.
                  </div>
                )}

                {availableSlots.length > 0 && (
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

                <div className="mb-3">
                  <label>Purpose</label>
                  <textarea {...register("purpose")} className="form-control" />
                </div>

                <div className="d-flex">
                  <button type="submit" className="btn btn-success btn-sm me-2">
                    {editingId ? "Update" : "Book"}
                  </button>
                  <button
                    type="button"
                    className="btn btn-danger btn-sm"
                    onClick={() => setShowForm(false)}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PatientAppointments;
