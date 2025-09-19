import React, { useEffect, useState } from "react";
import axios from "axios";
import Sidebar from "../../Components/AdminSidebar"; 
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

const AuditLog = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get("http://localhost:3001/api/audit-log", { withCredentials: true })
      .then((res) => {
        if (res.data.user?.role !== "admin") {
          Swal.fire({
            icon: "error",
            title: "Access Denied",
            text: "Only admin can access this page.",
            confirmButtonColor: "#51A485",
          });
          navigate("/");
        } else {
          setLogs(res.data.logs || []);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching audit logs:", err);
        setLoading(false);

        if (err.response && (err.response.status === 401 || err.response.status === 403)) {
          Swal.fire({
            icon: "error",
            title: "Access Denied",
            text: "Please login.",
            confirmButtonColor: "#51A485",
          });
          navigate("/");
        } else {
          Swal.fire({
            icon: "error",
            title: "Error",
            text: "Something went wrong while fetching audit logs.",
            confirmButtonColor: "#51A485",
          });
        }
      });
  }, [navigate]);

  const formatDescription = (desc) => {
    if (!desc) return "No changes";

    let parsedDesc = null;
    let message = "";

    if (typeof desc === "string") {
      const jsonStart = desc.indexOf("{");
      if (jsonStart !== -1) {
        message = desc.substring(0, jsonStart).trim();
        const jsonPart = desc.substring(jsonStart);
        try {
          parsedDesc = JSON.parse(jsonPart);
        } catch (e) {
          return desc;
        }
      } else {
        return (
          <div style={{ whiteSpace: "pre-line" }}>
            {desc.split("\n").map((line, i) => (
              <div key={i}>{line}</div>
            ))}
          </div>
        );
      }
    } else if (typeof desc === "object") {
      parsedDesc = desc;
    }

    if (!parsedDesc || typeof parsedDesc !== "object") return desc;

    const lines = [];

    if (parsedDesc.name || parsedDesc.lastname) {
      lines.push(`patient: ${(parsedDesc.name || "")} ${parsedDesc.lastname || ""}`.trim());
    }

    if (parsedDesc.doctor_old && parsedDesc.doctor_new) {
      lines.push(`doctor: ${parsedDesc.doctor_old} updated to ${parsedDesc.doctor_new}`);
    }

    if (parsedDesc.service_old && parsedDesc.service_new) {
      lines.push(`service: ${parsedDesc.service_old} updated to ${parsedDesc.service_new}`);
    }

    if (parsedDesc.time_old && parsedDesc.time_new) {
      lines.push(`time: ${parsedDesc.time_old} updated to ${parsedDesc.time_new}`);
    }
    if (parsedDesc.date_old && parsedDesc.date_new) {
      lines.push(`date: ${parsedDesc.date_old} updated to ${parsedDesc.date_new}`);
    }

    if (parsedDesc.appointment_datetime) {
      const dt = new Date(parsedDesc.appointment_datetime);
      const time = dt.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" });
      const date = dt.toLocaleDateString("en-GB");
      lines.push(`time: ${time}`);
      lines.push(`date: ${date}`);
    }

    return (
      <div style={{ whiteSpace: "pre-line" }}>
        {message && <div style={{ fontWeight: "bold" }}>{message}</div>}
        {lines.map((line, i) => (
          <div key={i}>{line}</div>
        ))}
      </div>
    );
  };

  if (loading) return <div>Loading audit logs...</div>;

  return (
    <div className="d-flex" style={{ minHeight: "100vh" }}>
      <Sidebar role="admin" />
      <div className="container py-4 flex-grow-1">
        <h2 className="mb-3">Audit Log</h2>
        <div className="table-responsive">
          <table className="table table-bordered table-hover align-middle">
            <thead className="table-dark">
              <tr>
                <th>ID</th>
                <th>Admin ID</th>
                <th>Table Name</th>
                <th>Record ID</th>
                <th>Action</th>
                <th>Description</th>
                <th>Created At</th>
              </tr>
            </thead>
            <tbody>
              {logs.length === 0 ? (
                <tr>
                  <td colSpan="7" className="text-center">
                    No audit logs found
                  </td>
                </tr>
              ) : (
                logs.map((log) => (
                  <tr key={log.audit_id}>
                    <td>{log.audit_id}</td>
                    <td>{log.admin_id}</td>
                    <td>{log.table_name}</td>
                    <td>{log.record_id}</td>
                    <td style={{ fontWeight: "bold" }}>{log.action}</td>
                    <td>{formatDescription(log.description)}</td>
                    <td>{new Date(log.created_at).toLocaleString("en-GB")}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AuditLog;

