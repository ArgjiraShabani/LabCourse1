
import './App.css';
import Navbar from './Components/Navbar';
import Footer from './Components/Footer';
import HomePage from './Pages/HomePage';
import MedicalStaff from './Pages/Staff';
import Login from './Pages/Login';
import AdminDashboard from './Dashboards/Admin/AdminDashboard';
import PatientDashboard from './Dashboards/Patient/Pages/PatientDashboard';
import MyProfile from './Dashboards/Patient/Pages/MyProfile';
import BookAppointment from './Dashboards/Patient/Pages/BookAppointment';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import 'bootstrap/dist/css/bootstrap.min.css';
import {BrowserRouter as Router,Routes,Route,useLocation } from 'react-router-dom';
import DoctorDashboard from './Dashboards/Doctor/DoctorDashboard';
import AdminDoctor from './Dashboards/Admin/addDoctor';
import ManageDepartments from './Dashboards/Admin/manageDepartments';
import ManageServices from './Dashboards/Admin/manageServices';
import UpdateDoctor from './Dashboards/Admin/UpdateDoctor';
import ViewDoctors from './Dashboards/Admin/viewDoctors';
import ManageSchedule from './Dashboards/Admin/ManageSchedule';
import SignUp from './Pages/Signup';
import Patient from './Dashboards/Admin/Patient';
import Register from './Dashboards/Doctor/registerPatient';


function Layout() {
  //const location = useLocation();
  //const hideLayout = location.pathname === '/adminDashboard';

  return (
    <div className="d-flex flex-column min-vh-100">
    
      <main className="flex-grow-1">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/staff" element={<MedicalStaff />} />
          <Route path="/adminDashboard" element={<AdminDashboard />}>
          </Route> 
          <Route path="/doctors" element={<AdminDoctor/>}/>
          <Route path="/updateDoctors/:id" element={<UpdateDoctor/>}/>
          <Route path='/viewDoctors' element={<ViewDoctors/>}/>
          

          <Route path="/doctordashboard" element={<DoctorDashboard/>} />
          <Route path='/patientdashboard/:id' element={<PatientDashboard/>}></Route>
          <Route path='/myprofile/:id' element={<MyProfile/>}></Route>
          <Route path='/bookAppointment/:id' element={<BookAppointment/>}></Route>
          <Route path="/ManageDepartments/:id" element={<ManageDepartments />}></Route>
          <Route path="/ManageServices/:id" element={<ManageServices />} />
          <Route path='/login' element={<Login/>}></Route>
          <Route path='/patient' element={<Patient/>}></Route>
          <Route path='/registerPatient' element={<Register/>}></Route>
          <Route path="/ManageSchedule/:id" element={<ManageSchedule />} />
          <Route path='/signUp' element={<SignUp/>}></Route>

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
