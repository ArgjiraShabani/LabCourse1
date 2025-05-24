import React, { useEffect, useState } from "react";
import axios from "axios";
import Sidebar from "../../Components/AdminSidebar";

const PatientAppointments = () => {
  const [appointments, setAppointments] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:3001/all-patient-appointments")
      .then((response) => {
        setAppointments(response.data);
      })
      .catch((error) => {
        console.error("Error while retrieving the appointments:", error);
      });
  }, []);

  const deleteAppointment = (appointmentId) => {
    axios
      .delete(`http://localhost:3001/all-patient-appointments/${appointmentId}`)
      .then(() => {
        setAppointments((prev) => prev.filter((a) => a.id !== appointmentId));
      })
      .catch((err) => {
        console.error("Error while deleting the appointment:", err);
        alert("The appointment was not deleted.");
      });
  };

  return (
    <div className="d-flex" style={{ minHeight: "100vh" }}>
      <Sidebar role="admin" />
      <div className="container py-4 flex-grow-1">
        <h2 className="mb-4 fw-bold">List of Appointments</h2>

        <div className="table-responsive">
          <table className="table table-bordered table-hover align-middle">
            <thead className="table-light">
              <tr>
                <th>ID</th>
                <th>Patient's First Name</th>
                <th>Patient's Last Name</th>
                <th>Doctor's Name</th>
                <th>Date & Time</th>
                <th>Purpose</th>
                <th>Booked By</th>
                <th>Service Name</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {appointments.length > 0 ? (
                appointments.map((appointment) => (
                  <tr key={appointment.id}>
                    <td>{appointment.id}</td>
                    <td>{appointment.patient_name}</td>
                    <td>{appointment.patient_lastname}</td>
                    <td>
                      {appointment.doctor_name ||
                        `${appointment.doctor_firstname} ${appointment.doctor_lastname}`}
                    </td>
                    <td>
                      {new Date(
                        appointment.appointment_datetime
                      ).toLocaleString()}
                    </td>
                    <td>{appointment.purpose}</td>
                    <td>{appointment.booked_by}</td>
                    <td>{appointment.service_name}</td>
                    <td>
                      <button
                        onClick={() => deleteAppointment(appointment.id)}
                        className="btn btn-danger btn-sm"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="9" className="text-center">
                    No appointments found.
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

export default PatientAppointments;
