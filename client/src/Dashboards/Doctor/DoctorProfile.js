import Sidebar from "../../Components/AdminSidebar";
import { useNavigate } from "react-router-dom";
function DoctorPofile(){
    const navigate=useNavigate();

    return(
        <div className="d-flex" style={{ minHeight: '100vh' }}>
            <Sidebar role="doctor"/>

        </div>
    );


}
export default DoctorPofile;