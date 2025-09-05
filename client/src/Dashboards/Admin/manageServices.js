import React, { useEffect, useState } from "react"; 
import axios from "axios";
import Sidebar from "../../Components/AdminSidebar";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

const api = axios.create({
  baseURL: "http://localhost:3001/api",
  withCredentials: true,
});

const ManageServices = () => {
  const [services, setServices] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [serviceName, setServiceName] = useState("");
  const [department_Id, setDepartment_Id] = useState("");
  const [editMode, setEditMode] = useState(false);
  const [editingServiceId, setEditingServiceId] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    api.get("/ManageServices")
      .then(res => {
        if (res.data.user?.role !== "admin") {
          Swal.fire({ icon: "error", title: "Access Denied", text: "Only admin can access this page.", confirmButtonColor: "#51A485" });
          navigate("/");
        }
      })
      .catch(err => {
        if (err.response && (err.response.status === 401 || err.response.status === 403)) {
          Swal.fire({ icon: "error", title: "Access Denied", text: "Please login.", confirmButtonColor: "#51A485" });
          navigate("/");
        } else console.error(err);
      });
  }, []);

  useEffect(() => {
    fetchDepartments();
    fetchServices();
  }, []);

  const fetchDepartments = async () => {
    try {
      const res = await api.get("/departments");
      setDepartments(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchServices = async () => {
    try {
      const res = await api.get("/services");
      setServices(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleCreateOrUpdate = async (e) => {
    e.preventDefault();
    if (!serviceName || !department_Id) return;

    try {
      let res;
      if (editMode) {
        res = await api.put(`/services/${editingServiceId}`, { service_name: serviceName, department_Id });
        Swal.fire("Updated", "Service updated successfully!", "success");
      } else {
        res = await api.post("/services", { service_name: serviceName, department_Id });
        if (res.data.reactivated) {
          Swal.fire("Reactivated", "This service was inactive and has been reactivated.", "success");
        } else {
          Swal.fire("Created", "Service created successfully!", "success");
        }
      }

      setServiceName("");
      setDepartment_Id("");
      setEditMode(false);
      setEditingServiceId(null);
      fetchServices();
    } catch (err) {
      Swal.fire("Error", err.response?.data?.error || err.message || "Could not save service", "error");
    }
  };

  const handleEdit = (service) => {
    setServiceName(service.service_name);
    setDepartment_Id(service.department_Id);
    setEditMode(true);
    setEditingServiceId(service.service_id);
  };

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "This will mark the service as inactive!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#51A485",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, mark inactive!",
    });

    if (!result.isConfirmed) return;

    try {
      await api.delete(`/services/${id}`);
      Swal.fire("Deleted!", "Service has been marked as inactive.", "success");
      fetchServices();
    } catch (err) {
      Swal.fire("Error", "Could not mark service as inactive", "error");
    }
  };

  const groupedServices = departments.map((dept) => ({
    ...dept,
    services: services.filter((s) => s.department_Id === dept.department_Id), 
  }));

  return (
    <div className="d-flex" style={{ minHeight: "100vh" }}>
      <Sidebar role="admin" />
      <div className="flex-grow-1 p-4">
        <h2>Manage Services</h2>
        <form onSubmit={handleCreateOrUpdate} className="mb-4">
          <div className="mb-3">
            <label className="form-label">Service Name</label>
            <input type="text" className="form-control" value={serviceName} onChange={(e) => setServiceName(e.target.value)} required />
          </div>
          <div className="mb-3">
            <label className="form-label">Department</label>
            <select className="form-select" value={department_Id} onChange={(e) => setDepartment_Id(Number(e.target.value))} required>
              <option value="">Select Department</option>
              {departments.map((dept) => (<option key={dept.department_Id} value={dept.department_Id}>{dept.department_name}</option>))}
            </select>
          </div>
          <button type="submit" className="btn btn-success">{editMode ? "Update Service" : "Create Service"}</button>
        </form>

        <h4>Services by Department</h4>
        <div className="d-flex flex-wrap gap-4">
          {groupedServices.map((dept) => (
            <div key={dept.department_Id} style={{ width: "300px" }}>
              {dept.image_path && <img src={`http://localhost:3001/uploads/${dept.image_path}`} alt={dept.department_name} style={{ width: "100%", height: "200px", objectFit: "cover", borderRadius: "10px" }} />}
              <h5 className="mt-2 text-center">{dept.department_name}</h5>
              <div className="mt-2">
                {dept.services.map((service) => (
                  <div key={service.service_id} className="border p-2 mb-2 rounded">
                    <h6>{service.service_name}</h6>
                    <button onClick={() => handleEdit(service)} className="btn btn-sm btn-outline-primary me-2">Edit</button>
                    <button onClick={() => handleDelete(service.service_id)} className="btn btn-sm btn-outline-danger">Delete</button>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ManageServices;