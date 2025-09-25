import React from "react";
import Button from "react-bootstrap/Button";

const AppointmentsTable = ({ appointments, onEdit, onDelete }) => {
  const formatDateTime = (dateString) => {
    if (!dateString) return "";
    return new Date(dateString).toLocaleString("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const hasActions = appointments.some(
    app => (app.status || "pending").toLowerCase() !== "completed"
  );

  return (
    <table className="table table-bordered table-hover align-middle">
      <thead>
        <tr>
          <th>ID</th>
          <th>Patient</th>
          <th>Doctor</th>
          <th>Date & Time</th>
          <th>Purpose</th>
          <th>Service</th>
          {hasActions && <th>Actions</th>}
        </tr>
      </thead>
      <tbody>
        {appointments.length === 0 ? (
          <tr>
            <td colSpan={hasActions ? "7" : "6"} className="text-center">
              No appointments found
            </td>
          </tr>
        ) : (
          appointments.map((app) => {
            const isCompleted =
              (app.status || "pending").toLowerCase() === "completed";

            return (
              <tr key={app.id} className={isCompleted ? "table-success" : ""}>
                <td>{app.id}</td>
                <td>{app.patient_name} {app.patient_lastname}</td>
                <td>{app.doctor_name || `${app.doctor_firstname} ${app.doctor_lastname}`}</td>
                <td>{formatDateTime(app.appointment_datetime)}</td>
                <td>{app.purpose}</td>
                <td>{app.service_name}</td>
                {!isCompleted && hasActions && (
                  <td style={{ display: "flex", gap: "5px" }}>
                    {onEdit && (
                      <Button
                        size="sm"
                        style={{
                          backgroundColor: "#51A485",
                          borderColor: "#51A485",
                          color: "#fff",
                        }}
                        onClick={() => onEdit(app)}
                      >
                        Edit
                      </Button>
                    )}
                    {onDelete && (
                      <Button
                        size="sm"
                        variant="danger"
                        onClick={() => onDelete(app.id)}
                      >
                        Delete
                      </Button>
                    )}
                  </td>
                )}
              </tr>
            );
          })
        )}
      </tbody>
    </table>
  );
};

export default AppointmentsTable;
