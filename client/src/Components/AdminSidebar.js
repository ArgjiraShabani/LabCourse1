import React, { useState } from "react";
import { Link } from "react-router-dom";
import { TiArrowSortedUp, TiArrowSortedDown } from "react-icons/ti";
import { FaBars, FaTimes } from "react-icons/fa";


const Sidebar = ({ role, id }) => {
  const [doctorMenuOpen, setDoctorMenuOpen] = useState(false);
  const [scheduleMenuOpen, setScheduleMenuOpen] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const toggleDoctorMenu = () => {
    setDoctorMenuOpen(!doctorMenuOpen);
  };
 const toggleScheduleMenu = () => {
  setScheduleMenuOpen(!scheduleMenuOpen);
};
const toggleSidebar = () => setIsOpen(!isOpen);

  return (
    <>
      <style>
        {`
        .sidebar {
            background-color: #51A485;
            width: 250px;
            min-height: 100vh;
            transition: transform 0.3s ease-in-out;
          }
          @media (max-width: 768px) {
            .sidebar {
              position: fixed;
              top: 0;
              left: 0;
              transform: translateX(-100%);
              z-index: 1000;
            }
            .sidebar.open {
              transform: translateX(0);
            }
            .menu-toggle {
              display: block;
              position: fixed;
              top: 15px;
              left: 15px;
              z-index: 1100;
              background: #51A485;
              color: #fff;
              border: none;
              padding: 8px 12px;
              border-radius: 4px;
              cursor: pointer;
            }
          }
          @media (min-width: 769px) {
            .menu-toggle {
              display: none;
            }
          }
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

      <button className="menu-toggle" onClick={toggleSidebar}>
        {isOpen ? <FaTimes size={20}/> : <FaBars size={20}/>}
      </button>

      <div
  className={`sidebar text-white p-3 ${isOpen ? "open" : ""}`}
  style={{
    backgroundColor: "#51A485",
    width: "250px",
    minHeight: "100vh",
  }}
>

        {role === "admin" ? (
          <>
            <h4 className="text-center mb-4">Admin Panel</h4>
            <ul className="nav flex-column">
              <li className="nav-item mb-2">
                <Link
                  to={`/adminDashboard`}
                  className="nav-link text-white active shadow-link"
                >
                  Dashboard
                </Link>
              </li>
              <li className="nav-item mb-2">
                <Link
                  to={`/ManageDepartments`}
                  className="nav-link text-white hover-link"
                >
                  Departments
                </Link>
              </li>
              <li className="nav-item mb-2">
                <Link
                  to={`/ManageServices`}
                  className="nav-link text-white hover-link"
                >
                  Services
                </Link>
              </li>

              <li className="nav-item mb-2">
                <div
                  onClick={toggleDoctorMenu}
                  className="nav-link text-white hover-link"
                >
                  Doctors{" "}
                  {doctorMenuOpen ? (
                    <TiArrowSortedUp size={18} color="#fff" />
                  ) : (
                    <TiArrowSortedDown size={18} color="#fff" />
                  )}
                </div>
                {doctorMenuOpen && (
                  <ul className="submenu list-unstyled">
                    <li className="nav-item mb-2">
                      <Link
                        to="/doctors"
                        className="nav-link text-white hover-link"
                      >
                        Add Doctors
                      </Link>
                    </li>
                    <li className="nav-item mb-2">
                      <Link
                        to="/viewDoctors"
                        className="nav-link text-white hover-link"
                      >
                        View Doctors
                      </Link>
                    </li>
                    <li className="nav-item mb-2">
                      <Link
                        to="/doctorSpecializations"
                        className="nav-link text-white hover-link"
                      >
                        Doctor Specializations
                      </Link>
                    </li>
                  </ul>
                )}
              </li>

              <li className="nav-item mb-2">
                <Link to="/patient" className="nav-link text-white hover-link">
                Patients
                </Link>
              </li>
              <li className="nav-item mb-2">
                <Link
                  to="/registerPatient"
                  className="nav-link text-white hover-link"
                >
                  Register Patients
                </Link>
              </li>
              <li className="nav-item mb-2">
                <Link
                   to={`/patientAppointments`}
                  className="nav-link text-white hover-link"
                >Patient Appointments</Link>
              </li>
              <li className="nav-item mb-2">
                <div
                  onClick={toggleScheduleMenu}
                  className="nav-link text-white hover-link"
                  style={{ cursor: "pointer" }}
                >
                  Doctor Schedule{" "}
                  {scheduleMenuOpen ? (
                    <TiArrowSortedUp size={18} color="#fff" />
                  ) : (
                    <TiArrowSortedDown size={18} color="#fff" />
                  )}
                </div>
                {scheduleMenuOpen && (
                  <ul className="submenu list-unstyled ps-3">
                    <li className="nav-item mb-2">
                      <Link
                        to={`/ManageSchedule`}
                        className="nav-link text-white hover-link"
                      >
                        Standard Schedule
                      </Link>
                    </li>
                    <li className="nav-item mb-2">
                      <Link
                        to={`/WeeklySchedule`}
                        className="nav-link text-white hover-link"
                      >
                        Weekly Schedule
                      </Link>
                    </li>
                  </ul>
                )}
                </li>
              <li className="nav-item mb-2">
                <Link
                  to={`/FeedbacksAdmin/`}
                  className="nav-link text-white hover-link"
                >
                  Feedbacks
                </Link>
              </li>
              <li className="nav-item mb-2">
                <Link
                  to={`/updateData/`}
                  className="nav-link text-white hover-link"
                >
                  Update Data
                </Link>
              </li>
               <li>
                  <Link
                      to="/logout"
                      className="nav-link text-white hover-link"
                      style={{ fontWeight: "bold" }}>
                              LOG OUT
                   </Link>
                </li>
            </ul>
          </>
        ) : role === "doctor" ? (
          <>
            <h4 className="text-center mb-4">Doctor Panel</h4>
            <ul className="nav flex-column">
              <li className="nav-item mb-2">
                <Link
                  to={`/doctordashboard`}
                  className="nav-link text-white hover-link"
                >
                  Dashboard Overview
                </Link>
              </li>
              
              <li className="nav-item mb-2">
                <Link
                  to="/DoctorSchedule/"
                  className="nav-link text-white hover-link"
                >
                  Schedule
                </Link>
              </li>
              <li className="nav-item mb-2">
                <Link
                  to={`/Appointment`}
                  className="nav-link text-white hover-link"
                >
                  Patient Appointments
                </Link>
              </li>
              <li className="nav-item mb-2">
                <Link
                  to="/medicalRecords/:id"
                  className="nav-link text-white hover-link"
                >
                  Prescriptions
                </Link>
              </li>
              <li className="nav-item mb-2">
                <Link
                  to={`/doctorProfile`}
                  className="nav-link text-white hover-link"
                >
                  My Profile
                </Link>
              </li>
               <li>
                  <Link
                      to="/logout"
                      className="nav-link text-white hover-link"
                      style={{  fontWeight: "bold" }}>
                              LOG OUT
                   </Link>
                </li>
            </ul>
          </>
        ) : role === "patient" ? (
          <>
            <h4 className="text-center mb-4">Patient Dashboard</h4>
            <ul className="nav flex-column">
              {/*<li className="nav-item mb-2">
                <Link
                  to={`/patientdashboard/${id}`}
                  className="nav-link text-white  hover-link"
                >
                  Dashboard
                </Link>
              </li>*/}
              <li className="nav-item mb-2">
                <Link
                  to={`/myAppointments`}
                  className="nav-link text-white  hover-link"
                >
                  My Appointments
                </Link>
              </li>
              <li className="nav-item mb-2">
                <Link
                  to={`/bookAppointment`}
                  className="nav-link text-white hover-link"
                >
                  Book Appointments
                </Link>
              </li>
              <li className="nav-item mb-2">
                <Link
                  to={`/myprofile`}
                  className="nav-link text-white hover-link"
                >
                  My Profile
                </Link>
              </li>
              <li className="nav-item mb-2">
                <Link
                  to={`/feedbacksPatient`}
                  className="nav-link text-white hover-link"
                >
                  My Feedbacks
                </Link>
              </li>
             {/* <li className="nav-item mb-2">
                <a href="#" className="nav-link text-white hover-link">
                  Message
                </a>
              </li>
               */}
              <li className="nav-item mt-4">
                <Link to={`/homePagePatient`} className="nav-link text-white">
                  Home
                </Link>
              </li>
                <li>
                  <Link
                      to="/logout"
                      className="nav-link text-white hover-link"
                      style={{ fontWeight: "bold" }}> 
                              LOG OUT
                   </Link>
                </li>
            </ul>
          </>
        ) : null}
      </div>
    </>
  );
};

export default Sidebar;