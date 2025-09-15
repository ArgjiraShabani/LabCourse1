import Sidebar from "../../Components/AdminSidebar";
import {useNavigate } from "react-router-dom";
import { useState,useEffect } from "react";
import {FaUser,FaEnvelope,FaPhone,FaGenderless,FaStethoscope,FaHospital} from "react-icons/fa";
import { LuCalendarDays } from "react-icons/lu";
import { PiStudentFill } from "react-icons/pi";
import axios from "axios";
import Swal from "sweetalert2";

function DoctorProfile(){

    
    const [doctorData,setDoctorData]=useState(null);

  
  
    
    

    const navigate=useNavigate();

    
useEffect(() => {
  axios
    .get("http://localhost:3001/api/doctorId", { withCredentials: true })
    .then((response) => {
      const birthDate = response.data.date_of_birth.split("T")[0];
      response.data.date_of_birth = birthDate;
      setDoctorData(response.data);
    })
    .catch((error) => {
      if (error.response) {
        if (error.response.status === 401 || error.response.status === 403) {
          Swal.fire({
            icon: "error",
            title: "Access Denied",
            text: "Please login as a doctor.",
          });
          navigate("/login");
        } else {
          console.error(
            "Error fetching doctor data:",
            error.response.status,
            error.response.data
          );
        }
      } else {
        console.error("Network error or no response:", error.message);
      }
    });
}, [navigate]);
   

    if(!doctorData){
        return <div>Loading profile...</div>;
    }

    
  

    return(
        <div className="d-flex" style={{ minHeight: '100vh' }}>
             <div style={{width: "250px"}}>
                 <Sidebar role="doctor"/>
             </div>
             <div
        className="flex-grow-1 d-flex justify-content-center align-items-start"
        style={{ padding: "40px" }}
      >
             <div className="container py-4" style={{
            width: "100%",
            maxWidth: "700px",
            backgroundColor: "#fff",
            borderRadius: "12px",
            padding: "30px",
            boxShadow: "0 8px 20px rgba(0, 0, 0, 0.1)"}}>
             <h2 className="mb-4" style={{color: '#51A485'}}>My profile</h2>
             <div className="text-center mb-4">
             {doctorData.image_path ?(
                <img
                    src={`http://localhost:3001/uploads/${doctorData.image_path}`}
                    alt={`${doctorData.first_name} ${doctorData.last_name}`}
                    style={{width: '150px',height: '150px',borderRadius: '50%',objectFit: 'cover',border: '3px solidrgb(86, 245, 186)'}}
                />
             ):(
                <div
                    style={{
                        width: '150px',
                        height: '150px',
                        borderRadius: '50%',
                        backgroundColor: '#ccc',
                        lineHeight: '150px',
                        textAlign: 'center',
                        fontSize: '16px',
                        color: '#555',
                        margin: '0 auto'
                    }

                    }>
                        No Image
                </div>
             )
                
             }
            </div>
            <ul className="list-group list-group-flush" style={{maxWidth: "600px",margin: "0 auto",backgroundColor: '#fff',borderRadius:"10px"}}>
                <li className="list-group-item"><FaUser size={18} color="#51A485" title="Name" className="me-2"/>    Name: {doctorData.first_name} {doctorData.last_name}</li>
                <li className="list-group-item"><FaEnvelope size={18} color="#51A485" title="Email" className="me-2"/> Email: {doctorData.email}</li>
                <li className="list-group-item"><FaPhone size={18} color="#51A485" title="Phone" className="me-2"/> Phone: {doctorData.phone}</li>
                <li className="list-group-item"><LuCalendarDays size={18} color="#51A485" title="BirthDay" className="me-2"/> Date of Birth: {doctorData.date_of_birth}</li>
                <li className="list-group-item"><FaGenderless size={18} color="#51A485" title="Gender" className="me-2"/> Gender: {doctorData.gender_name}</li>
                <li className="list-group-item"><PiStudentFill size={25} color="#51A485" title="Education" className="me-2"/>Education: {doctorData.education}</li>
                <li className="list-group-item"><FaStethoscope size={18} color="#51A485" title="Specialization" className="me-2"/>Specialization: {doctorData.specialization_name}</li>
                <li className="list-group-item"><FaHospital size={18} color="#51A485" title="Gender" className="me-2"/> Department: {doctorData.department_name}</li>
            </ul>




        </div>
        </div>
        </div>
    );


}
export default DoctorProfile;