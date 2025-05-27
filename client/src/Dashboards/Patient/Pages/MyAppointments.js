import React, { useEffect, useState } from "react";
import axios from "axios";
import Sidebar from "../../../Components/AdminSidebar";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";


const MyAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [editingAppointment, setEditingAppointment] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    lastname: "",
    purpose: "",
  });
  const param=useParams();
 const {id}=param; 


  const navigate = useNavigate();
  const patientId = localStorage.getItem("patient_id");

  useEffect(() => {
    if (!patientId) {
      alert("Patient not logged in.");
      navigate("/login"); 
      return;
    }

    axios
      .get("http://localhost:3001/my-appointments", {
        params: { patient_id: patientId },
      })
      .then((response) => {
        setAppointments(response.data);
      })
      .catch((error) => {
        console.error("Error retrieving appointments:", error);
      });
  }, [patientId, navigate]);

  const cancelAppointment = (appointmentId) => {
    axios
      .delete(`http://localhost:3001/my-appointments/${appointmentId}`)
      .then(() => {
        setAppointments((prev) => prev.filter((a) => a.id !== appointmentId));
      })
      .catch((err) => {
        console.error("Error while canceling the appointment:", err);
        alert("The appointment was not canceled.");
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
    axios
      .put(
        `http://localhost:3001/my-appointments/${editingAppointment}?patient_id=${patientId}`,
        formData
      )
      .then(() => {
        setAppointments((prev) =>
          prev.map((appointment) =>
            appointment.id === editingAppointment
              ? {
                  ...appointment,
                  patient_name: formData.name,
                  patient_lastname: formData.lastname,
                  purpose: formData.purpose,
                }
              : appointment
          )
        );
        setEditingAppointment(null);
      })
      .catch((err) => {
        console.error("Error while saving the appointment:", err);
        alert("The appointment was not updated.");
      });
  };

  const handleCancelEdit = () => {
    setEditingAppointment(null);
    setFormData({
      name: "",
      lastname: "",
      purpose: "",
    });
  };

  return (
    <div className="d-flex" style={{ minHeight: "100vh" }}>
      <Sidebar role="patient" id={id} />
      <div className="container py-4 flex-grow-1">
        <h2 className="mb-4 fw-bold">My Appointments</h2>

        <div className="table-responsive">
          <table className="table table-bordered table-hover align-middle">
            <thead className="table-light">
              <tr>
                <th>ID</th>
                <th>First Name</th>
                <th>Last Name</th>
                <th>Doctor's Name</th>
                <th>Date & Time</th>
                <th>Purpose</th>
                <th>Service Name</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {appointments.length > 0 ? (
                appointments.map((appointment) => (
                  <tr key={appointment?.id}>
                    <td>{appointment?.id || "-"}</td>
                    <td>{appointment?.patient_name || "-"}</td>
                    <td>{appointment?.patient_lastname || "-"}</td>
                    <td>
                      {(appointment?.doctor_firstname || "-") +
                        " " +
                        (appointment?.doctor_lastname || "")}
                    </td>
                    <td>
                      {appointment?.appointment_datetime
                        ? new Date(
                            appointment.appointment_datetime
                          ).toLocaleString()
                        : "-"}
                    </td>
                    <td>{appointment?.purpose || "-"}</td>
                    <td>{appointment?.service_name || "-"}</td>
                    <td>
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
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="8" className="text-center">
                    No appointments found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {editingAppointment && (
          <div className="card mt-4">
            <div className="card-body">
              <h5 className="card-title">
                Edit Appointment #{editingAppointment}
              </h5>

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