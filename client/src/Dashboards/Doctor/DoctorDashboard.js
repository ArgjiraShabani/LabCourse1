import Sidebar from "../../Components/AdminSidebar";
import { useNavigate } from "react-router-dom";

function DoctorDashboard() {
    const navigate=useNavigate();
  return (
    <div className="d-flex" style={{ minHeight: '100vh' }}>
      <Sidebar role="doctor" />
      <div className="flex-grow-1 p-4">
      </div>
    </div>
  );
}

export default DoctorDashboard;