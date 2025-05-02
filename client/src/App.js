
import './App.css';
import Navbar from './Components/Navbar';
import Footer from './Components/Footer';
import HomePage from './Pages/HomePage';
import MedicalStaff from './Pages/Staff';
import AdminDashboard from './Dashboards/Admin/AdminDashboard';
import PatientDashboard from './Dashboards/Patient/Pages/PatientDashboard';
import MyProfile from './Dashboards/Patient/Pages/MyProfile';
import Login from './Pages/Login';
import BookAppointment from './Dashboards/Patient/Pages/BookAppointment';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import 'bootstrap/dist/css/bootstrap.min.css';
import {BrowserRouter as Router,Routes,Route,useLocation } from 'react-router-dom';
import DoctorDashboard from './Dashboards/DoctorDashboard';

function Layout() {
  //const location = useLocation();
  //const hideLayout = location.pathname === '/adminDashboard';

  return (
    <div className="d-flex flex-column min-vh-100">
    
      <main className="flex-grow-1">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/staff" element={<MedicalStaff />} />
          <Route path="/adminDashboard" element={<AdminDashboard />} />
          <Route path="/doctordashboard" element={<DoctorDashboard/>} />
          <Route path='/patientdashboard/:id' element={<PatientDashboard/>}></Route>
          <Route path='/myprofile/:id' element={<MyProfile/>}></Route>
          <Route path='/bookAppointment/:id' element={<BookAppointment/>}></Route>
          <Route path='/login' element={<Login/>}></Route>
        </Routes>
      </main>
     
    </div>
  );
}

function App() {
  return (
    <Router>
      <Layout />
    </Router>
  );
}

export default App;
