import React, { useEffect, useState } from "react";
import axios from "axios";
import Sidebar from "../../Components/AdminSidebar";

const Appointment = () => {
  const [appointments, setAppointments] = useState([]);

  useEffect(() => {
    const doctorId = localStorage.getItem("doctor_id");

    if (!doctorId) {
      console.error("Nuk u gjet doctor_id në localStorage.");
      return;
    }

    axios
      .get(`http://localhost:3001/all-patient-appointments?doctor_id=${doctorId}`)
      .then((response) => {
        setAppointments(response.data);
      })
      .catch((error) => {
        console.error("Gabim gjatë marrjes së termineve:", error);
      });
  }, []);

  const updateStatus = (appointmentId, newStatus) => {
    axios
      .put(`http://localhost:3001/appointments/${appointmentId}/status`, {
        status: newStatus,
      })
      .then(() => {
        setAppointments((prev) =>
          prev.map((a) =>
            a.id === appointmentId ? { ...a, status: newStatus } : a
          )
        );
      })
      .catch((err) => {
        console.error("Gabim gjatë përditësimit të statusit:", err);
        alert("Nuk u përditësua statusi.");
      });
  };

  return (
    <div className="d-flex" style={{ minHeight: "100vh" }}>
      <Sidebar role="doctor" />
      <div className="p-4 flex-grow-1">
        <h2 className="mb-4">List of Appointments</h2>

        <div className="table-responsive">
          <table className="table table-bordered table-striped">
            <thead className="table-light">
              <tr>
                <th>ID</th>
                <th>Patient's First Name</th>
                <th>Patient's Last Name</th>
                <th>Date & Time</th>
                <th>Purpose</th>
                <th>Booked By</th>
                <th>Service Name</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {appointments.length > 0 ? (
                appointments.map((appointment) => {
                  const status = (appointment.status || "pending").toLowerCase().trim();

                  return (
                    <tr key={appointment.id}>
                      <td>{appointment.id}</td>
                      <td>{appointment.patient_name}</td>
                      <td>{appointment.patient_lastname}</td>
                      <td>{new Date(appointment.appointment_datetime).toLocaleString()}</td>
                      <td>{appointment.purpose}</td>
                      <td>{appointment.booked_by}</td>
                      <td>{appointment.service_name}</td>
                      <td className="text-capitalize">{status}</td>
                      <td>
                        {status !== "completed" ? (
                          <button
                            onClick={() => updateStatus(appointment.id, "completed")}
                            className="btn btn-success btn-sm"
                          >
                            Completed
                          </button>
                        ) : (
                          <button
                            disabled
                            className="btn btn-secondary btn-sm"
                          >
                            Completed
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })
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

export default Appointment;