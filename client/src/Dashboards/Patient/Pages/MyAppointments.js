import React, { useEffect, useState } from "react";
import axios from "axios";
import Sidebar from "../../../Components/AdminSidebar";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { FaCalendarCheck } from "react-icons/fa";

const api = axios.create({
  baseURL: "http://localhost:3001",
  withCredentials: true,
});

const MyAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [editingAppointment, setEditingAppointment] = useState(null);
  const [numberAppointments, setNumberAppointments] = useState(null);
  const [formData, setFormData] = useState({ name: "", lastname: "", purpose: "" });
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState(null); 
  const navigate = useNavigate();

  useEffect(() => {
    api
      .get("/my-appointments")
      .then((res) => {

        const user = res.data.user;

        if (!user) {
          Swal.fire({
            icon: "error",
            title: "Not logged in",
            text: "Please log in as a patient.",
            confirmButtonColor: "#51A485",
          });
          navigate("/login");
          return;
        }

        if (user.role !== "patient") {
          Swal.fire({
            icon: "error",
            title: "Access Denied",
            text: "Only patients can access this page.",
            confirmButtonColor: "#51A485",
          });
          navigate("/");
          return;
        }

        setUserId(user.id);

        const appointments = res.data.appointments || [];
        setAppointments(appointments);
        setNumberAppointments(appointments.length);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching appointments:", err);
        if (err.response && (err.response.status === 401 || err.response.status === 403)) {
          Swal.fire({
            icon: "error",
            title: "Access Denied",
            text: "Please log in.",
            confirmButtonColor: "#51A485",
          });
          navigate("/login");
        } else {
          Swal.fire({
            icon: "error",
            title: "Error",
            text: "Unexpected error occurred. Please try again later.",
            confirmButtonColor: "#51A485",
          });
        }
      });
  }, [navigate]);

  const cancelAppointment = (appointmentId) => {
    Swal.fire({
      title: "Are you sure?",
      text: "Do you really want to cancel this appointment?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#51A485",
      confirmButtonText: "Yes, cancel it!",
      cancelButtonText: "No, keep it",
    }).then((result) => {
      if (result.isConfirmed) {
        api
          .delete(`/my-appointments/${appointmentId}`)
          .then(() => {
            setAppointments((prev) => prev.filter((a) => a.id !== appointmentId));
            Swal.fire({
              icon: "success",
              title: "Cancelled!",
              text: "Your appointment has been cancelled.",
              confirmButtonColor: "#51A485",
            });
          })
          .catch((err) => {
            console.error("Error cancelling appointment:", err);
            Swal.fire({
              icon: "error",
              title: "Failed",
              text: "Appointment could not be cancelled.",
              confirmButtonColor: "#d33",
            });
          });
      }
    });
  };

  const editAppointment = (appointmentId) => {
    const appointmentToEdit = appointments.find((a) => a.id === appointmentId);
    if (!appointmentToEdit) return;

    setEditingAppointment(appointmentId);
    setFormData({
      name: appointmentToEdit.patient_name || "",
      lastname: appointmentToEdit.patient_lastname || "",
      purpose: appointmentToEdit.purpose || "",
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    if (!editingAppointment) return;

    Swal.fire({
      title: "Save changes?",
      showCancelButton: true,
      confirmButtonColor: "#51A485",
      cancelButtonColor: "#d33",
      confirmButtonText: "Save",
      cancelButtonText: "Cancel",
    }).then((result) => {
      if (result.isConfirmed) {
        api
          .put(`/my-appointments/${editingAppointment}`, formData)
          .then(() => {
            setAppointments((prev) =>
              prev.map((appointment) =>
                appointment.id === editingAppointment ? { ...appointment, ...formData } : appointment
              )
            );
            setEditingAppointment(null);
            Swal.fire({
              icon: "success",
              title: "Updated!",
              text: "Your appointment has been updated.",
              confirmButtonColor: "#51A485",
            });
          })
          .catch((err) => {
            console.error("Error updating appointment:", err);
            Swal.fire({
              icon: "error",
              title: "Failed",
              text: "Appointment was not updated.",
              confirmButtonColor: "#d33",
            });
          });
      }
    });
  };

  const handleCancelEdit = () => {
    Swal.fire({
      title: "Discard changes?",
      text: "Your edits will not be saved.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#51A485",
      confirmButtonText: "Yes, discard",
      cancelButtonText: "No, keep editing",
    }).then((result) => {
      if (result.isConfirmed) {
        setEditingAppointment(null);
        setFormData({ name: "", lastname: "", purpose: "" });
      }
    });
  };

  if (loading) {
    return <div className="text-center mt-5">Loading appointments...</div>;
  }

  return (
    <div className="d-flex" style={{ minHeight: "100vh" }}>
      <Sidebar role="patient" id={userId} />
      <div
        style={{
          width: "100%",
          backgroundColor: "#fff",
          borderRadius: "12px",
          padding: "30px",
          boxShadow: "0 8px 20px rgba(0, 0, 0, 0.1)",
          marginBottom: "20px",
        }}
      >
        <div className="row g-4">
          <h2>My Appointments</h2>
          <div className="col-12">
            <div
              className="card text-white h-100"
              style={{ backgroundColor: "#4e73df", borderRadius: "15px" }}
            >
              <div className="card-body d-flex align-items-center">
                <FaCalendarCheck size={40} className="me-3" />
                <div>
                  <h5 className="card-title">Appointments</h5>
                  <h3>{numberAppointments}</h3>
                </div>
              </div>
            </div>
          </div>
        </div>

        {appointments.length > 0 && (
          <div className="table-responsive mt-4">
            <table className="table table-bordered table-hover align-middle">
              <thead className="table-light">
                <tr>
                  <th>ID</th>
                  <th>First Name</th>
                  <th>Last Name</th>
                  <th>Doctor</th>
                  <th>Date & Time</th>
                  <th>Purpose</th>
                  <th>Service</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {appointments.map((appointment) => (
                  <tr key={appointment.id}>
                    <td>{appointment.id || "-"}</td>
                    <td>{appointment.patient_name || "-"}</td>
                    <td>{appointment.patient_lastname || "-"}</td>
                    <td>
                      {(appointment.doctor_firstname || "-") +
                        " " +
                        (appointment.doctor_lastname || "")}
                    </td>
                    <td>
                      {appointment.appointment_datetime
                        ? new Date(appointment.appointment_datetime).toLocaleString()
                        : "-"}
                    </td>
                    <td>{appointment.purpose || "-"}</td>
                    <td
  style={{
    color:
      appointment.department_status === 2 || appointment.service_status === 2
        ? "red"
        : "inherit",
    fontWeight:
      appointment.department_status === 2 || appointment.service_status === 2
        ? "bold"
        : "normal",
  }}
>
  {appointment.department_status === 2
    ? "Department inactive, contact the hospital"
    : appointment.service_status === 2
    ? "Service inactive, contact the hospital"
    : appointment.service_name || "-"}
</td>

                    <td>
  {appointment.department_status === 2 || appointment.service_status === 2 ? (
    <button
      onClick={() => cancelAppointment(appointment.id)}
      className="btn btn-danger btn-sm"
    >
      Cancel
    </button>
  ) : (
    <>
      <button
        onClick={() => cancelAppointment(appointment.id)}
        className="btn btn-danger btn-sm me-2"
      >
        Cancel
      </button>
      <button
        onClick={() => editAppointment(appointment.id)}
        className="btn btn-primary btn-sm"
      >
        Edit
      </button>
    </>
  )}
</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {editingAppointment && (
          <div className="card mt-4">
            <div className="card-body">
              <h5 className="card-title">Edit Appointment #{editingAppointment}</h5>
              <div className="mb-3">
                <label className="form-label">First Name</label>
                <input
                  type="text"
                  name="name"
                  className="form-control"
                  value={formData.name}
                  onChange={handleChange}
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Last Name</label>
                <input
                  type="text"
                  name="lastname"
                  className="form-control"
                  value={formData.lastname}
                  onChange={handleChange}
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Purpose</label>
                <input
                  type="text"
                  name="purpose"
                  className="form-control"
                  value={formData.purpose}
                  onChange={handleChange}
                />
              </div>
              <button className="btn btn-success me-2" onClick={handleSave}>
                Save
              </button>
              <button className="btn btn-secondary" onClick={handleCancelEdit}>
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );

};

export default MyAppointments;