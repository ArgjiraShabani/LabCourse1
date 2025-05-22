import React from 'react';
import { Link, useParams } from 'react-router-dom';

const Sidebar = () => {
  const param=useParams();
  const {id}=param;
 
  return (
    <>
      <style>
        {`
          .nav-link {
            transition: background-color 0.3s ease;
          }

          .nav-link:hover {
            background-color: rgba(255, 255, 255, 0.1);
          }

          .hover-link:hover {
            background-color: rgba(255, 255, 255, 0.1);
          } 

          .nav-link.active {
            background-color: rgba(255, 255, 255, 0.2);
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            font-weight: bold;
          }
        `}
      </style>

      <div className="text-white p-3" style={{ backgroundColor: '#51A485', width: '250px', minHeight: '100vh' }}>
        <h4 className="text-center mb-4">Patient Dashboard</h4>
        <ul className="nav flex-column">
          <li className="nav-item mb-2">
            <Link to={`/patientDashboard/${id}`} className="nav-link text-white hover-link">My Appointment</Link>
          </li>
          <li className="nav-item mb-2">
            <Link to={`/bookAppointment/${id}`} className="nav-link text-white hover-link">Book Appointment</Link>
          </li>
          <li className="nav-item mb-2">
            <a href="#" className="nav-link text-white active shadow-link">My Profile</a>
          </li>
          <li className="nav-item mb-2">
            <a href="#" className="nav-link text-white hover-link">Message</a>
          </li>
          <li className="nav-item mt-4">
            <Link to={`/${id}`} className="nav-link text-white">Home</Link>
          </li>
        </ul>
      </div>
    </>
  );
};

export default Sidebar;
