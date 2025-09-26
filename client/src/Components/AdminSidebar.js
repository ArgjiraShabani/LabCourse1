import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import { TiArrowSortedUp, TiArrowSortedDown } from "react-icons/ti";
import { FaBars, FaTimes } from "react-icons/fa";

const Sidebar = ({ role, id }) => {
  const [doctorMenuOpen, setDoctorMenuOpen] = useState(false);
  const [scheduleMenuOpen, setScheduleMenuOpen] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const toggleDoctorMenu = () => 
    setDoctorMenuOpen(!doctorMenuOpen);
  const toggleScheduleMenu = () => 
    setScheduleMenuOpen(!scheduleMenuOpen);
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
       >
        {role === "admin" ? (
          <>
            <h4 className="text-center mb-4">Admin Panel</h4>
            <ul className="nav flex-column">
              <li className="nav-item mb-2">
                <NavLink
                  to={`/adminDashboard`}
                  className={({ isActive }) =>
                    `nav-link text-white ${isActive ? "active shadow-link" : "hover-link"}`
                  }
                >
                  Dashboard
                </NavLink>
              </li>
              <li className="nav-item mb-2">
                <NavLink
                  to={`/ManageDepartments`}
                  className={({ isActive }) =>
                    `nav-link text-white ${isActive ? "active shadow-link" : "hover-link"}`
                  }
                >
                  Departments
                </NavLink>
              </li>
              <li className="nav-item mb-2">
                <NavLink
                  to={`/ManageServices`}
                  className={({ isActive }) =>
                    `nav-link text-white ${isActive ? "active shadow-link" : "hover-link"}`
                  }
                >
                  Services
                </NavLink>
              </li>

              <li className="nav-item mb-2">
                <div
                  onClick={toggleDoctorMenu}
                  className="nav-link text-white hover-link"
                  style={{ cursor: "pointer" }}
                >
                  Doctors{" "}
                  {doctorMenuOpen ? (
                    <TiArrowSortedUp size={18} color="#fff" />
                  ) : (
                    <TiArrowSortedDown size={18} color="#fff" />
                  )}
                </div>
                {doctorMenuOpen && (
                  <ul className="submenu list-unstyled ps-3">
                    <li className="nav-item mb-2">
                      <NavLink
                        to="/doctors"
                        className={({ isActive }) =>
                          `nav-link text-white ${isActive ? "active shadow-link" : "hover-link"}`
                        }
                      >
                        Add Doctors
                      </NavLink>
                    </li>
                    <li className="nav-item mb-2">
                      <NavLink
                        to="/viewDoctors"
                        className={({ isActive }) =>
                          `nav-link text-white ${isActive ? "active shadow-link" : "hover-link"}`
                        }
                      >
                        View Doctors
                      </NavLink>
                    </li>
                    <li className="nav-item mb-2">
                      <NavLink
                        to="/doctorSpecializations"
                        className={({ isActive }) =>
                          `nav-link text-white ${isActive ? "active shadow-link" : "hover-link"}`
                        }
                      >
                        Doctor Specializations
                      </NavLink>
                    </li>
                  </ul>
                )}
              </li>

              <li className="nav-item mb-2">
                <NavLink
                  to="/patient"
                  className={({ isActive }) =>
                    `nav-link text-white ${isActive ? "active shadow-link" : "hover-link"}`
                  }
                >
                  Patients
                </NavLink>
              </li>

              <li className="nav-item mb-2">
                <NavLink
                  to="/registerPatient"
                  className={({ isActive }) =>
                    `nav-link text-white ${isActive ? "active shadow-link" : "hover-link"}`
                  }
                >
                  Register Patients
                </NavLink>
              </li>

              <li className="nav-item mb-2">
                <NavLink
                  to={`/patientAppointments`}
                  className={({ isActive }) =>
                    `nav-link text-white ${isActive ? "active shadow-link" : "hover-link"}`
                  }
                >
                  Patient Appointments
                </NavLink>
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
                      <NavLink
                        to={`/ManageSchedule`}
                        className={({ isActive }) =>
                          `nav-link text-white ${isActive ? "active shadow-link" : "hover-link"}`
                        }
                      >
                        Standard Schedule
                      </NavLink>
                    </li>
                    <li className="nav-item mb-2">
                      <NavLink
                        to={`/WeeklySchedule`}
                        className={({ isActive }) =>
                          `nav-link text-white ${isActive ? "active shadow-link" : "hover-link"}`
                        }
                      >
                        Weekly Schedule
                      </NavLink>
                    </li>
                  </ul>
                )}
              </li>
              <li className="nav-item mb-2">
                <NavLink
                  to={`/FeedbacksAdmin/`}
                  className={({ isActive }) =>
                    `nav-link text-white ${isActive ? "active shadow-link" : "hover-link"}`
                  }
                >
                  Feedbacks
                </NavLink>
              </li>
              <li className="nav-item mb-2">
                <NavLink
                  to={`/updateData/`}
                  className={({ isActive }) =>
                    `nav-link text-white ${isActive ? "active shadow-link" : "hover-link"}`
                  }
                >
                  Update Data
                </NavLink>
              </li>

              <li className="nav-item mb-2">
                <NavLink
                  to={`/auditLog/`}
                  className={({ isActive }) =>
                    `nav-link text-white ${isActive ? "active shadow-link" : "hover-link"}`
                  }
                >
                  Audit Log
                </NavLink>
              </li>

              <li className="nav-item mt-4">
                <NavLink
                  to="/logout"
                  className="nav-link text-white"
                  style={{ fontWeight: "bold" }}
                >
                  LOG OUT
                </NavLink>
              </li>
            </ul>
          </>
        ) : role === "doctor" ? (
          <>
            <h4 className="text-center mb-4">Doctor Panel</h4>
            <ul className="nav flex-column">
              <li className="nav-item mb-2">
                <NavLink
                  to={`/doctordashboard`}
                  className={({ isActive }) =>
                    `nav-link text-white ${isActive ? "active shadow-link" : "hover-link"}`
                  }
                >
                  Dashboard Overview
                </NavLink>
              </li>
              <li className="nav-item mb-2">
                <NavLink
                  to="/DoctorSchedule/"
                  className={({ isActive }) =>
                    `nav-link text-white ${isActive ? "active shadow-link" : "hover-link"}`
                  }
                >
                  Schedule
                </NavLink>
              </li>
              <li className="nav-item mb-2">
                <NavLink
                  to={`/Appointment`}
                  className={({ isActive }) =>
                    `nav-link text-white ${isActive ? "active shadow-link" : "hover-link"}`
                  }
                >
                  Patient Appointments
                </NavLink>
              </li>
              <li className="nav-item mb-2">
                <NavLink
                  to="/medicalRecords/:id"
                  className={({ isActive }) =>
                    `nav-link text-white ${isActive ? "active shadow-link" : "hover-link"}`
                  }
                >
                  Prescriptions
                </NavLink>
              </li>
              <li className="nav-item mb-2">
                <NavLink
                  to={`/doctorProfile`}
                  className={({ isActive }) =>
                    `nav-link text-white ${isActive ? "active shadow-link" : "hover-link"}`
                  }
                >
                  My Profile
                </NavLink>
              </li>
              <li className="nav-item mt-4">
                <NavLink
                  to="/logout"
                  className="nav-link text-white"
                  style={{ fontWeight: "bold" }}
                >
                  LOG OUT
                </NavLink>
              </li>
            </ul>
          </>
        ) : role === "patient" ? (
          <>
            <h4 className="text-center mb-4">Patient Dashboard</h4>
            <ul className="nav flex-column">
              <li className="nav-item mb-2">
                <NavLink
                  to={`/myAppointments`}
                  className={({ isActive }) =>
                    `nav-link text-white ${isActive ? "active shadow-link" : "hover-link"}`
                  }
                >
                  My Appointments
                </NavLink>
              </li>
              <li className="nav-item mb-2">
                <NavLink
                  to={`/bookAppointment`}
                  className={({ isActive }) =>
                    `nav-link text-white ${isActive ? "active shadow-link" : "hover-link"}`
                  }
                >
                  Book Appointments
                </NavLink>
              </li>
              <li className="nav-item mb-2">
                <NavLink
                  to={`/myprofile`}
                  className={({ isActive }) =>
                    `nav-link text-white ${isActive ? "active shadow-link" : "hover-link"}`
                  }
                >
                  My Profile
                </NavLink>
              </li>
              <li className="nav-item mb-2">
                <NavLink
                  to={`/feedbacksPatient`}
                  className={({ isActive }) =>
                    `nav-link text-white ${isActive ? "active shadow-link" : "hover-link"}`
                  }
                >
                  My Feedbacks
                </NavLink>
              </li>
              <li className="nav-item mb-2">
                <NavLink
                  to={`/homePagePatient`}
                  className={({ isActive }) =>
                    `nav-link text-white ${isActive ? "active shadow-link" : "hover-link"}`
                  }
                >
                  Home
                </NavLink>
              </li>
              <li className="nav-item mt-4">
                <NavLink
                  to="/logout"
                  className="nav-link text-white"
                  style={{ fontWeight: "bold" }}>
                  LOG OUT
                </NavLink>
              </li>
            </ul>
          </>
        ) : null}
      </div>
    </>
  );
};

export default Sidebar;