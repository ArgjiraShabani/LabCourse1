import React, { useEffect, useState } from 'react'; 
import Sidebar from '../../Components/AdminSidebar';
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { 
  FaUserShield, FaProcedures, FaUserMd, FaBuilding, FaCalendarCheck, FaFileAlt 
} from 'react-icons/fa';

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

import { Line } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend
);

const api = axios.create({
  baseURL: "http://localhost:3001/api",
  withCredentials: true,
});

const monthTranslations = {
  'Jan': 'Jan', 'Feb': 'Feb', 'Mar': 'Mar', 'Apr': 'Apr', 'May': 'May', 'Jun': 'Jun',
  'Jul': 'Jul', 'Aug': 'Aug', 'Sep': 'Sep', 'Oct': 'Oct', 'Nov': 'Nov', 'Dec': 'Dec',
  'Janar': 'Jan', 'Shkurt': 'Feb', 'Mars': 'Mar', 'Prill': 'Apr', 'Maj': 'May', 'Qershor': 'Jun',
  'Korrik': 'Jul', 'Gusht': 'Aug', 'Shtator': 'Sep', 'Tetor': 'Oct', 'Nëntor': 'Nov', 'Dhjetor': 'Dec'
};

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    roles: 0,
    patients: 0,
    doctors: 0,
    departments: 0,
    appointments: 0,
    results: 0
  });

  const [monthlyAppointments, setMonthlyAppointments] = useState({
    year: new Date().getFullYear(),
    months: [],
    counts: []
  });

  const navigate = useNavigate();

  useEffect(() => {
    axios.get(`http://localhost:3001/AdminDashboard`, { withCredentials: true }) 
      .then((res) => {
        if (res.data.user?.role !== "admin") {
          Swal.fire({
            icon: "error",
            title: "Access Denied",
            text: "Only admin can access this page.",
            confirmButtonColor: "#51A485",
          });
          navigate("/");
        }
      })
      .catch((err) => {
        if (err.response && (err.response.status === 401 || err.response.status === 403)) {
          Swal.fire({
            icon: "error",
            title: "Access Denied",
            text: "Please login.",
            confirmButtonColor: "#51A485",
          });
          navigate("/");
        } else {
          console.error("Unexpected error", err);
        }
      });
  }, [navigate]);

  useEffect(() => {
    api.get("/admin/stats")
      .then(response => setStats(response.data))
      .catch(error => console.error(error));

    api.get(`/admin/monthly-appointments?year=${new Date().getFullYear()}`)
      .then(response => setMonthlyAppointments(response.data))
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
  const translatedMonths = monthlyAppointments.months.map(m => monthTranslations[m] || m);

  const lineChartData = {
    labels: translatedMonths.length > 0 ? translatedMonths : [],
    datasets: [{
      label: `Appointments in ${monthlyAppointments.year}`,
      data: monthlyAppointments.counts.length > 0 ? monthlyAppointments.counts : [],
      borderColor: 'rgb(81, 164, 133)', 
      backgroundColor: 'rgba(81, 164, 133, 0.2)', 
      fill: true,
      tension: 0.4,
      pointRadius: 5,
      pointHoverRadius: 7,
    }],
  };

  const lineChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'top', labels: { color: 'rgb(81, 164, 133)', font: { size: 16, weight: 'bold' } } },
      title: { display: true, text: 'Monthly Appointments Trend', font: { size: 20, weight: 'bold' }, color: 'rgb(81, 164, 133)' },
      tooltip: { enabled: true }
    },
    scales: {
      x: { ticks: { color: '#6c757d', font: { size: 14 } }, grid: { display: false } },
      y: { beginAtZero: true, ticks: { color: '#6c757d', font: { size: 14 } }, grid: { color: '#e9ecef' } }
    }
  };

  return (
    <div className="d-flex flex-column flex-lg-row min-vh-100">
      <Sidebar role="admin" />
      <div className="flex-grow-1 p-3 p-lg-4">
        <h2 className="mb-4 text-center text-lg-start">Welcome to the Admin Dashboard</h2>

        <div className="row">
          {cardData.map((card, index) => {
            const percent = (card.count / maxCount) * 100;
            return (
              <div 
                className="col-12 col-sm-6 col-md-4 mb-4" 
                key={index}
              >
                <div className={`card border-${card.color} shadow-sm h-100`}>
                  <div className={`card-body text-${card.color} d-flex align-items-center`}>
                    <div className="me-3 me-sm-4">{card.icon}</div>
                    <div style={{ flexGrow: 1 }}>
                      <h5 className="card-title">{card.title}</h5>
                      <h2>{card.count}</h2>
                    </div>
                  </div>
                  <div className="progress" style={{ height: '10px', margin: '0 1rem 1rem 1rem' }}>
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
            );
          })}
        </div>

        {monthlyAppointments.counts.length > 0 && (
          <div className="card p-3 p-md-4 shadow-sm mt-4" style={{ height: '300px', overflow: 'hidden' }}>
            <Line data={lineChartData} options={lineChartOptions} style={{ height: '250px' }} />
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;