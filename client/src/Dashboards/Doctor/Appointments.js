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
      .get(`http://localhost:3001/appointments?doctor_id=${doctorId}`)
      .then((response) => {
        setAppointments(response.data);
      })
      .catch((error) => {
        console.error("Gabim gjatë marrjes së termineve:", error);
      });
  }, []);

  return (
    <div className="d-flex" style={{ minHeight: "100vh" }}>
      <Sidebar role="doctor" />
      <div className="p-6">
        <h2 className="text-2xl font-bold mb-4">List of Appointments</h2>

        <div className="overflow-x-auto">
          <table className="min-w-full border border-gray-300">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-2 border">ID</th>
                <th className="px-4 py-2 border">Patient's First Name</th>
                <th className="px-4 py-2 border">Patient's Last Name</th>
                <th className="px-4 py-2 border">Date & Time</th>
                <th className="px-4 py-2 border">Purpose</th>
                <th className="px-4 py-2 border">Booked By</th>
                <th className="px-4 py-2 border">Service Name</th>
              </tr>
            </thead>
            <tbody>
              {appointments.length > 0 ? (
                appointments.map((appointment) => (
                  <tr key={appointment.id}>
                    <td className="px-4 py-2 border">{appointment.id}</td>
                    <td className="px-4 py-2 border">
                      {appointment.patient_name}
                    </td>
                    <td className="px-4 py-2 border">
                      {appointment.patient_lastname}
                    </td>
                    <td className="px-4 py-2 border">
                      {new Date(
                        appointment.appointment_datetime
                      ).toLocaleString()}
                    </td>
                    <td className="px-4 py-2 border">{appointment.purpose}</td>
                    <td className="px-4 py-2 border">{appointment.booked_by}</td>
                    <td className="px-4 py-2 border">
                      {appointment.service_name}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="px-4 py-2 border text-center">
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

