import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Sidebar from '../../Components/AdminSidebar';

const ManageServices = () => {
  const [services, setServices] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [serviceName, setServiceName] = useState('');
  const [department_Id, setDepartment_Id] = useState('');
  const [editMode, setEditMode] = useState(false);
  const [editingServiceId, setEditingServiceId] = useState(null);

  useEffect(() => {
    fetchDepartments();
    fetchServices();
  }, []);

  const fetchDepartments = async () => {
    try {
      const res = await axios.get('http://localhost:3001/api/departments', {
        withCredentials: true,
      });
      setDepartments(res.data);
    } catch (err) {
      console.error('Error fetching departments:', err);
    }
  };

  const fetchServices = async () => {
    try {
      const res = await axios.get('http://localhost:3001/api/services', {
        withCredentials: true,
      });
      setServices(res.data);
    } catch (err) {
      console.error('Error fetching services:', err);
    }
  };

  const handleCreateOrUpdate = async (e) => {
    e.preventDefault();
    try {
      if (editMode) {
        await axios.put(`http://localhost:3001/api/services/${editingServiceId}`, {
          service_name: serviceName,
          department_Id: department_Id,
        }, {
          withCredentials: true,
        });
      } else {
        await axios.post('http://localhost:3001/api/services', {
          service_name: serviceName,
          department_Id: department_Id,
        }, {
          withCredentials: true,
        });
      }

      setServiceName('');
      setDepartment_Id('');
      setEditMode(false);
      setEditingServiceId(null);
      fetchServices();
    } catch (err) {
      console.error('Error saving service:', err);
    }
  };

  const handleEdit = (service) => {
    setServiceName(service.service_name);
    setDepartment_Id(service.department_id);
    setEditMode(true);
    setEditingServiceId(service.service_id);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:3001/api/services/${id}`, {
        withCredentials: true,
      });
      fetchServices();
    } catch (err) {
      console.error('Error deleting service:', err);
    }
  };

  const groupedServices = departments.map(dept => ({
    ...dept,
    services: services.filter(s => s.department_Id === dept.department_Id),
  }));

  return (
    <div className="d-flex" style={{ minHeight: '100vh' }}>
      <Sidebar role="admin" />
      <div className="flex-grow-1 p-4">
        <h2>Manage Services</h2>

        <form onSubmit={handleCreateOrUpdate} className="mb-4">
          <div className="mb-3">
            <label className="form-label">Service Name</label>
            <input
              type="text"
              className="form-control"
              value={serviceName}
              onChange={(e) => setServiceName(e.target.value)}
              required
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Department</label>
            <select
              className="form-select"
              value={department_Id}
              onChange={(e) => setDepartment_Id(Number(e.target.value))}
              required
            >
              <option value="">Select Department</option>
              {departments.map(dept => (
                <option key={dept.department_Id} value={dept.department_Id}>
                  {dept.department_name}
                </option>
              ))}
            </select>
          </div>
          <button type="submit" className="btn btn-success">
            {editMode ? 'Update Service' : 'Create Service'}
          </button>
        </form>

        <h4>Services by Department</h4>
        <div className="d-flex flex-wrap gap-4">
          {groupedServices.map(dept => (
            <div key={dept.department_Id} style={{ width: '300px' }}>
              {dept.image_path && (
                <img
                  src={`http://localhost:3001/uploads/${dept.image_path}`}
                  alt={dept.department_name}
                  style={{
                    width: '100%',
                    height: '200px',
                    objectFit: 'cover',
                    borderRadius: '10px'
                  }}
                />
              )}
              <h5 className="mt-2 text-center">{dept.department_name}</h5>
              <div className="mt-2">
                {dept.services.map(service => (
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
