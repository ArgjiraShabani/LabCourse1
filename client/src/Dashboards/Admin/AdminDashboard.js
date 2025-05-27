import React, { useEffect, useState } from 'react';
import Sidebar from '../../Components/AdminSidebar';
import axios from 'axios';
import { FaUserShield, FaProcedures, FaUserMd, FaBuilding, FaCalendarCheck, FaFileAlt } from 'react-icons/fa';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    roles: 0,
    patients: 0,
    doctors: 0,
    departments: 0,
    appointments: 0,
    results: 0
  });

  useEffect(() => {
    axios.get('http://localhost:3001/api/admin/stats')
      .then(response => setStats(response.data))
      .catch(error => console.error(error));
  }, []);

  const cardData = [
    { title: 'Roles', count: stats.roles, color: 'primary', icon: <FaUserShield size={50} /> },
    { title: 'Patients', count: stats.patients, color: 'success', icon: <FaProcedures size={50} /> },
    { title: 'Doctors', count: stats.doctors, color: 'info', icon: <FaUserMd size={50} /> },
    { title: 'Departments', count: stats.departments, color: 'warning', icon: <FaBuilding size={50} /> },
    { title: 'Appointments', count: stats.appointments, color: 'danger', icon: <FaCalendarCheck size={50} /> },
    { title: 'Results', count: stats.results, color: 'secondary', icon: <FaFileAlt size={50} /> },
  ];

  const maxCount = Math.max(...cardData.map(card => card.count), 1); 

  return (
    <div className="d-flex" style={{ minHeight: '100vh' }}>
      <Sidebar role="admin" />

      <div className="flex-grow-1 p-4">
        <h2 className="mb-4">Welcome to the Admin Dashboard</h2>

        <div className="row">
          {cardData.map((card, index) => {
            const percent = (card.count / maxCount) * 100;

            return (
              <div className="col-md-4 mb-4" key={index}>
                <div className={`card border-${card.color} shadow-sm h-100`}>
                  <div className={`card-body text-${card.color} d-flex align-items-center`}>
                    <div className="me-4">
                      {card.icon}
                    </div>
                    <div>
                      <h5 className="card-title">{card.title}</h5>
                      <h2>{card.count}</h2>
                    </div>
                  </div>
                  <div className="progress" style={{ height: '10px', margin: '0 1.25rem 1rem 1.25rem' }}>
                    <div 
                      className={`progress-bar bg-${card.color}`} 
                      role="progressbar" 
                      style={{ width: `${percent}%` }} 
                      aria-valuenow={percent} 
                      aria-valuemin="0" 
                      aria-valuemax="100"
                    />
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
