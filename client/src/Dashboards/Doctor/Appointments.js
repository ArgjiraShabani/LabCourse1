import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import Sidebar from "../../Components/AdminSidebar";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

const api = axios.create({
  baseURL: "http://localhost:3001",
  withCredentials: true,
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

const Appointment = () => {
  const [appointments, setAppointments] = useState([]);
  const navigate = useNavigate();

  const fetchAppointments = useCallback(async () => {
    try {
      const response = await api.get("/doctor-appointments");
      const sorted = response.data.sort(
        (a, b) => new Date(a.appointment_datetime) - new Date(b.appointment_datetime)
      );
      setAppointments(sorted);
    } catch (err) {
      if (err.response && (err.response.status === 401 || err.response.status === 403)) {
        navigate("/login");
      } else {
        console.error("Error fetching appointments:", err);
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "An error occurred while fetching appointments.",
        });
      }
    }
  }, [navigate]);

  useEffect(() => {
    const checkAccess = async () => {
      try {
        const res = await api.get("/api/Appointment");
        const user = res.data.user;

        if (!user || user.role !== "doctor") {
          Swal.fire({
            icon: "error",
            title: "Access Denied",
            text: "Only doctors can access this page.",
            confirmButtonColor: "#51A485",
          }).then(() => navigate("/login"));
          return;
        }

        fetchAppointments();
      } catch (err) {
        if (err.response && (err.response.status === 401 || err.response.status === 403)) {
          navigate("/login");
        } else {
          console.error("Unexpected error", err);
          Swal.fire({
            icon: "error",
            title: "Error",
            text: "An unexpected error occurred. Please try again later.",
            confirmButtonColor: "#51A485",
          });
        }
      }
    };

    checkAccess();
  }, [navigate, fetchAppointments]);

  const isToday = (dateStr) => {
    const date = new Date(dateStr);
    const today = new Date();
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  };

  const updateStatus = async (appointmentId, newStatus, appointmentDate) => {
    if (!isToday(appointmentDate)) {
      Swal.fire({
        icon: "error",
        title: "Action Not Allowed",
        text: "You can only update today's appointments.",
      });
      return;
    }

    const result = await Swal.fire({
      title: "Are you sure?",
      text: "Do you want to mark this appointment as completed?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#51A485",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, complete it!",
    });

    if (!result.isConfirmed) return;

    try {
      await api.put(`/appointments/${appointmentId}/status`, { status: newStatus });
      fetchAppointments();
      Swal.fire({
        position: "center",
        icon: "success",
        title: "Appointment marked as completed!",
        showConfirmButton: false,
        timer: 1200,
      });
    } catch (err) {
      if (err.response && (err.response.status === 401 || err.response.status === 403)) {
        navigate("/login");
      } else {
        const message = err.response?.data?.error || "Status update failed.";
        Swal.fire({ icon: "error", title: "Error", text: message });
        console.error("Error updating status:", err.response || err);
      }
    }
  };

  const todaysAppointments = appointments.filter((a) => isToday(a.appointment_datetime));
  const otherAppointments = appointments.filter((a) => !isToday(a.appointment_datetime));

  const renderTable = (appointmentsList, disableStatusChange) => (
    <div className="table-responsive">
      <table className="table table-bordered table-striped table-hover">
        <thead className="table-light">
          <tr>
            <th>#</th>
            <th>Patient Name</th>
            <th>Date & Time</th>
            <th>Purpose</th>
            <th>Booked By</th>
            <th>Service</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {appointmentsList.length > 0 ? (
            appointmentsList.map((appointment, index) => {
              const status = (appointment.status || "pending").toLowerCase().trim();
              const appointmentId = appointment.id || appointment.appointment_id;
              const patientName = appointment.patient_name || appointment.name || "";
              const patientLastname = appointment.patient_lastname || appointment.lastname || "";

              return (
                <tr key={appointmentId} className={status === "completed" ? "table-success" : ""}>
                  <td>{index + 1}</td>
                  <td>{`${patientName} ${patientLastname}`}</td>
                  <td>{new Date(appointment.appointment_datetime).toLocaleString()}</td>
                  <td>{appointment.purpose}</td>
                  <td>{appointment.booked_by}</td>
                  <td>{appointment.service_name}</td>
                  <td className="text-capitalize">{status}</td>
                  <td className="text-center">
                    {status !== "completed" && !disableStatusChange ? (
                      <button
                        onClick={() =>
                          updateStatus(appointmentId, "completed", appointment.appointment_datetime)
                        }
                        className="btn btn-success btn-sm"
                      >
                        Completed
                      </button>
                    ) : status !== "completed" && disableStatusChange ? (
                      <span className="text-muted small">Not available</span>
                    ) : (
                      <button disabled className="btn btn-secondary btn-sm">
                        Completed
                      </button>
                    )}
                  </td>
                </tr>
              );
            })
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
  );

  return (
    <div className="d-flex flex-column flex-lg-row min-vh-100">
      <Sidebar role="doctor" />
      <div className="p-3 p-lg-4 flex-grow-1">
        <h2 className="mb-3 mb-lg-4">Today's Appointments</h2>
        {renderTable(todaysAppointments, false)}

        <h2 className="mt-4 mt-lg-5 mb-3 mb-lg-4">Appointments for Other Days</h2>
        {renderTable(otherAppointments, true)}
      </div>
    </div>
  );
};

export default Appointment;