import React, { useState, useEffect } from "react"; 
import axios from "axios";
import Sidebar from "../../Components/AdminSidebar";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

const api = axios.create({
  baseURL: "http://localhost:3001/api",
  withCredentials: true,
});

const ManageDepartments = () => {
  const [departmentName, setDepartmentName] = useState("");
  const [description, setDescription] = useState("");
  const [photo, setPhoto] = useState(null);
  const [departments, setDepartments] = useState([]);
  const [editMode, setEditMode] = useState(false);
  const [editingDepartmentId, setEditingDepartmentId] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get(`http://localhost:3001/ManageDepartments`, { withCredentials: true })
      .then((res) => {
        if (res.data.user?.role !== "admin") {
          Swal.fire({
            icon: "error",
            title: "Access Denied",
            text: "Only admin can access this page.",
            confirmButtonColor: "#51A485",
          });
          navigate("/login");
        }
      })
      .catch((err) => {
        if (err.response && (err.response.status === 401 || err.response.status === 403)) {
          

          navigate('/login');
        } else {
          console.error("Unexpected error", err);
        }
      });
  }, []);

  useEffect(() => {
    fetchDepartments();
  }, []);

  const fetchDepartments = async () => {
    try {
      const response = await api.get("/departments");
      setDepartments(response.data);
    } catch (error) {
      console.error("Error fetching departments:", error);
    }
  };

  const handleCreate = async (e) => {
  e.preventDefault();
  const exists = departments.some(
    (dept) =>
      dept.department_name.toLowerCase() === departmentName.toLowerCase()
  );
  if (exists) {
    Swal.fire("Error", "A department with this name already exists.", "error");
    return;
  }

  const formData = new FormData();
  formData.append("department_name", departmentName);
  formData.append("description", description);
  if (photo) formData.append("photo", photo);

  try {
    const res = await api.post("/departments", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    Swal.fire({
      icon: "success",
      title: "Success",
      text: res.data.message,
      timer: 1500,
      showConfirmButton: false,
    });

    setDepartmentName("");
    setDescription("");
    setPhoto(null);
    fetchDepartments();
  } catch (error) {
    console.error("Error creating department:", error);

    if (error.response && (error.response.status === 401 || error.response.status === 403)) {
      Swal.fire({
        icon: "error",
        title: "Access Denied",
        text: "Please login.",
        confirmButtonColor: "#51A485",
      });
      navigate("/"); 
      return;
    }

    const msg =
      error.response?.data?.error ||
      error.message ||
      "Could not create department";
    Swal.fire("Error", msg, "error");
  }
};



  const handleEdit = (department) => {
    setDepartmentName(department.department_name);
    setDescription(department.description);
    setEditMode(true);
    setEditingDepartmentId(department.department_Id);
    setPhoto(null);
  };

 const handleUpdate = async (e) => {
  e.preventDefault();

  const exists = departments.some(
    (dept) =>
      dept.department_name.toLowerCase() === departmentName.toLowerCase() &&
      dept.department_Id !== editingDepartmentId
  );
  if (exists) {
    Swal.fire("Error", "A department with this name already exists.", "error");
    return;
  }

  const formData = new FormData();
  formData.append("department_name", departmentName);
  formData.append("description", description);
  if (photo) {
    formData.append("photo", photo);
    formData.append("image_path", photo.name);
  }

  try {
    await api.put(`/departments/${editingDepartmentId}`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    Swal.fire({
      icon: "success",
      title: "Updated",
      text: "Department updated successfully!",
      timer: 1500,
      showConfirmButton: false,
    });

    setDepartmentName("");
    setDescription("");
    setPhoto(null);
    setEditMode(false);
    fetchDepartments();
  } catch (error) {
    if (error.response && (error.response.status === 401 || error.response.status === 403)) {
      Swal.fire({
        icon: "error",
        title: "Access Denied",
        text: "Please login.",
        confirmButtonColor: "#51A485",
      });
      navigate("/");
    } else {
      console.error("Error updating department:", error);
      const msg =
        error.response?.data?.error ||
        error.message ||
        "Could not update department";
      Swal.fire("Error", msg, "error");
    }
  }
};



 const handleDelete = async (departmentId) => {
  const result = await Swal.fire({
    title: "Are you sure?",
    text: "This action cannot be undone!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#51A485",
    cancelButtonColor: "#d33",
    confirmButtonText: "Yes, delete it!",
  });

  if (!result.isConfirmed) return;

  try {
    await api.delete(`/departments/${departmentId}`);
    Swal.fire("Deleted!", "Department has been deleted.", "success");
    fetchDepartments();
  } catch (error) {
    if (error.response && (error.response.status === 401 || error.response.status === 403)) {
      Swal.fire({
        icon: "error",
        title: "Access Denied",
        text: "Please login.",
        confirmButtonColor: "#51A485",
      });
      navigate("/"); 
    } else {
      console.error("Error deleting department:", error);
      const msg = error.response?.data?.error || error.message || "Could not delete department";
      Swal.fire("Error", msg, "error");
    }
  }
};


  return (
    <div className="d-flex" style={{ minHeight: "100vh" }}>
      <Sidebar role="admin" />
      <div className="flex-grow-1 p-4">
        <h2>Manage Departments</h2>
        <form
          onSubmit={editMode ? handleUpdate : handleCreate}
          className="mb-4"
          encType="multipart/form-data"
        >
          <div className="mb-3">
            <label className="form-label">Department Name</label>
            <input
              type="text"
              className="form-control"
              value={departmentName}
              onChange={(e) => setDepartmentName(e.target.value)}
              required
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Description</label>
            <textarea
              className="form-control"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows="3"
            ></textarea>
          </div>
          <div className="mb-3">
            <label className="form-label">Photo</label>
            <input
              type="file"
              className="form-control"
              onChange={(e) => setPhoto(e.target.files[0])}
              accept="image/*"
            />
          </div>
          <button
            type="submit"
            className="btn btn-success"
            disabled={!departmentName}
          >
            {editMode ? "Update" : "Create"}
          </button>
        </form>

        <h4>Department List</h4>
        <div className="d-flex flex-wrap gap-4">
          {departments.map((dept) => (
            <div
              key={dept.department_Id}
              className="card"
              style={{
                width: "300px",
                borderRadius: "16px",
                overflow: "hidden",
                backgroundColor: "#f9f9f9",
                boxShadow: "0 8px 20px rgba(0,0,0,0.1)",
              }}
            >
              {dept.image_path && (
                <img
                  src={`http://localhost:3001/uploads/${dept.image_path}`}
                  alt={dept.department_name}
                  className="card-img-top"
                  style={{ height: "200px", objectFit: "cover" }}
                />
              )}
              <div className="card-body">
                <h5 className="card-title">{dept.department_name}</h5>
                <p
                  className="card-text"
                  style={{ maxHeight: "80px", overflowY: "auto", fontSize: "0.95rem", color: "#555" }}
                >
                  {dept.description}
                </p>
                <div className="d-flex mt-3" style={{ gap: "8px" }}>
                  <button onClick={() => handleEdit(dept)} className="btn btn-outline-primary btn-sm">
                    Edit
                  </button>
                  <button onClick={() => handleDelete(dept.department_Id)} className="btn btn-outline-danger btn-sm">
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ManageDepartments;