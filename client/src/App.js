
import './App.css';
import Navbar from './Components/Navbar';
import Footer from './Components/Footer';
import HomePage from './Pages/HomePage';
import MedicalStaff from './Pages/Staff';
import AdminDashboard from './Dashboards/Admin/AdminDashboard';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import 'bootstrap/dist/css/bootstrap.min.css';
import {BrowserRouter as Router,Routes,Route,useLocation } from 'react-router-dom';
import DoctorDashboard from './Dashboards/DoctorDashboard';

function Layout() {
  const location = useLocation();
  const hideLayout = location.pathname === '/adminDashboard';

  return (
    <div className="d-flex flex-column min-vh-100">
      {!hideLayout && <Navbar />}
      <main className="flex-grow-1">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/staff" element={<MedicalStaff />} />
          <Route path="/adminDashboard" element={<AdminDashboard />} />
          <Route path="/doctordashboard" element={<DoctorDashboard/>} />
        </Routes>
      </main>
      {!hideLayout && <Footer />}
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
