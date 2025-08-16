import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Sidebar from '../../Components/AdminSidebar';
import Swal from 'sweetalert2';

const ManageDepartments = () => {
  const [departmentName, setDepartmentName] = useState('');
  const [description, setDescription] = useState('');
  const [photo, setPhoto] = useState(null);
  const [departments, setDepartments] = useState([]);
  const [editMode, setEditMode] = useState(false);
  const [editingDepartmentId, setEditingDepartmentId] = useState(null);

  useEffect(() => {
    fetchDepartments();
  }, []);

  const fetchDepartments = async () => {
    try {
      const response = await axios.get('http://localhost:3001/api/departments', {
        withCredentials: true,
      });
      setDepartments(response.data);
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Error fetching departments',
      });
      console.error('Error fetching departments:', error);
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('department_name', departmentName);
    formData.append('description', description);
    if (photo) formData.append('photo', photo);

    try {
      await axios.post('http://localhost:3001/api/departments', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        withCredentials: true,
      });
      Swal.fire({
        icon: 'success',
        title: 'Created!',
        text: 'Department has been created successfully',
        timer: 1500,
        showConfirmButton: false,
      });
      setDepartmentName('');
      setDescription('');
      setPhoto(null);
      fetchDepartments();
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Failed to create department',
      });
      console.error('Error creating department:', error);
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
    const formData = new FormData();
    formData.append('department_name', departmentName);
    formData.append('description', description);
    if (photo) formData.append('photo', photo);

    try {
      await axios.put(`http://localhost:3001/api/departments/${editingDepartmentId}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        withCredentials: true,
      });
      Swal.fire({
        icon: 'success',
        title: 'Updated!',
        text: 'Department has been updated successfully',
        timer: 1500,
        showConfirmButton: false,
      });
      setDepartmentName('');
      setDescription('');
      setPhoto(null);
      setEditMode(false);
      fetchDepartments();
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Failed to update department',
      });
      console.error('Error updating department:', error);
    }
  };

  const handleDelete = async (departmentId) => {
    Swal.fire({
      title: 'Are you sure?',
      text: 'This will permanently delete the department!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#51A485',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!',
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axios.delete(`http://localhost:3001/api/departments/${departmentId}`, {
            withCredentials: true,
          });
          Swal.fire({
            icon: 'success',
            title: 'Deleted!',
            text: 'Department has been deleted',
            timer: 1500,
            showConfirmButton: false,
          });
          fetchDepartments();
        } catch (error) {
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Failed to delete department',
          });
          console.error('Error deleting department:', error);
        }
      }
    });
  };

  return (
    <div className="d-flex" style={{ minHeight: '100vh' }}>
      <Sidebar role="admin" />
      <div className="flex-grow-1 p-4">
        <h2>Manage Departments</h2>
        <form onSubmit={editMode ? handleUpdate : handleCreate} className="mb-4" encType="multipart/form-data">
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
          <button type="submit" className="btn btn-success">
            {editMode ? 'Update' : 'Create'}
          </button>
        </form>

        <h4>Department List</h4>
        <div className="d-flex flex-wrap gap-4">
          {departments.map((dept) => (
            <div
              key={dept.department_Id}
              className="card"
              style={{
                width: '300px',
                borderRadius: '16px',
                overflow: 'hidden',
                backgroundColor: '#f9f9f9',
                boxShadow: '0 8px 20px rgba(0,0,0,0.1)',
              }}
            >
              {dept.image_path && (
                <img
                  src={`http://localhost:3001/uploads/${dept.image_path}`}
                  alt={dept.department_name}
                  className="card-img-top"
                  style={{
                    height: '200px',
                    objectFit: 'cover',
                    borderTopLeftRadius: '16px',
                    borderTopRightRadius: '16px',
                  }}
                />
              )}
              <div className="card-body">
                <h5 className="card-title">{dept.department_name}</h5>
                <p
                  className="card-text"
                  style={{
                    maxHeight: '80px',
                    overflowY: 'auto',
                    fontSize: '0.95rem',
                    color: '#555',
                  }}
                >
                  {dept.description}
                </p>
                <div className="d-flex mt-3" style={{ gap: '8px' }}>
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
