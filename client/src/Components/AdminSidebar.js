import React, { useState } from "react";
import { Link } from "react-router-dom";
import { TiArrowSortedUp, TiArrowSortedDown } from "react-icons/ti";

const Sidebar = ({ role, id }) => {
  const [doctorMenuOpen, setDoctorMenuOpen] = useState(false);
  const [scheduleMenuOpen, setScheduleMenuOpen] = useState(false);

  const toggleDoctorMenu = () => {
    setDoctorMenuOpen(!doctorMenuOpen);
  };
 const toggleScheduleMenu = () => {
  setScheduleMenuOpen(!scheduleMenuOpen);
};
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

      <div
        className="text-white p-3"
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
                  to={`/adminDashboard/${id}`}
                  className="nav-link text-white active shadow-link"
                >
                  Dashboard
                </Link>
              </li>
              <li className="nav-item mb-2">
                <Link
                  to={`/ManageDepartments/${id}`}
                  className="nav-link text-white hover-link"
                >
                  Departments
                </Link>
              </li>
              <li className="nav-item mb-2">
                <Link
                  to={`/ManageServices/${id}`}
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
                        to={`/ManageSchedule/${id}`}
                        className="nav-link text-white hover-link"
                      >
                        Standard Schedule
                      </Link>
                    </li>
                    <li className="nav-item mb-2">
                      <Link
                        to={`/WeeklySchedule/${id}`}
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
            <h4 className="text-center mb-4">Admin Panel</h4>
            <ul className="nav flex-column">
              <li className="nav-item mb-2">
                <a href="#" className="nav-link text-white active shadow-link">
                  Dashboard
                </a>
              </li>
              <li className="nav-item mb-2">
                <Link
                  to="/registerPatient"
                  className="nav-link text-white hover-link"
                >
                  Patients
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
                  to={`/Appointment/${id}`}
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
                  to={`/doctorProfile/${id}`}
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
                  to={`/myAppointment/${id}`}
                  className="nav-link text-white  hover-link"
                >
                  My Appointments
                </Link>
              </li>
              <li className="nav-item mb-2">
                <Link
                  to={`/bookAppointment/${id}`}
                  className="nav-link text-white hover-link"
                >
                  Book Appointments
                </Link>
              </li>
              <li className="nav-item mb-2">
                <Link
                  to={`/myprofile/${id}`}
                  className="nav-link text-white hover-link"
                >
                  My Profile
                </Link>
              </li>
              <li className="nav-item mb-2">
                <Link
                  to={`/feedbacksPatient/${id}`}
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
                <Link to={`/homePagePatient/${id}`} className="nav-link text-white">
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
