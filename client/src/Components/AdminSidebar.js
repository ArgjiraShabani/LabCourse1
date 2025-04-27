import React from 'react';
import { Link } from 'react-router-dom';

const Sidebar = ({role}) => {
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
        
        {role==='admin'?(
          <>
          <h4 className="text-center mb-4">Admin Panel</h4>
        <ul className="nav flex-column">
          <li className="nav-item mb-2">
            <a href="#" className="nav-link text-white active shadow-link">Dashboard</a>
          </li>
          <li className="nav-item mb-2">
            <a href="#" className="nav-link text-white hover-link">Departments</a>
          </li>
          <li className="nav-item mb-2">
            <a href="#" className="nav-link text-white hover-link">Doctors</a>
          </li>
          <li className="nav-item mb-2">
            <a href="#" className="nav-link text-white hover-link">Patient Appointment</a>
          </li>
          <li className="nav-item mt-4">
            <a href="#" className="nav-link text-danger">Log out</a>
          </li>
          </ul>
          </>
        ): role==="doctor"?(
          <>
          <h4 className="text-center mb-4">Admin Panel</h4>
          <ul className="nav flex-column">
          <li className="nav-item mb-2">
            <a href="#" className="nav-link text-white active shadow-link">Dashboard</a>
          </li>
          <li className="nav-item mb-2">
            <a href="#" className="nav-link text-white hover-link">Patients</a>
          </li>
          <li className="nav-item mb-2">
            <a href="#" className="nav-link text-white hover-link">Appointments</a>
          </li>
          <li className="nav-item mb-2">
            <a href="#" className="nav-link text-white hover-link">Prescriptions</a>
          </li>
          <li className="nav-item mt-4">
            <a href="#" className="nav-link text-danger">Log out</a>
          </li>
          </ul>
          </>
        ): role==="patient"?(
          <>
          <h4 className="text-center mb-4">Patient Dashboard</h4>
          <ul className="nav flex-column">
          <li className="nav-item mb-2">
            <Link to='/patientdashboard' className="nav-link text-white active shadow-link">My Appointment</Link>
          </li>
          <li className="nav-item mb-2">
            <Link to='/bookAppointment' className="nav-link text-white hover-link">Book Appointments</Link>
          </li>
          <li className="nav-item mb-2">
            <Link to='/myprofile' className="nav-link text-white hover-link">My Profile</Link>
          </li>
          <li className="nav-item mb-2">
            <a href="#" className="nav-link text-white hover-link">Message</a>
          </li>
          <li className="nav-item mt-4">
            <a href="#" className="nav-link text-danger">Log out</a>
          </li>
          </ul>
          </>
        ):(
          null
        )}
        
      </div>
    </>
  );
};

export default Sidebar;
