import Sidebar from "../../Components/AdminSidebar";
import { useNavigate } from "react-router-dom";
import { useState,useEffect } from "react";
import {FaUser,FaEnvelope,FaPhone,FaGenderless,FaStethoscope,FaHospital} from "react-icons/fa";
import { LuCalendarDays } from "react-icons/lu";
import Axios from "axios";
function DoctorPofile({doctor_id}){
    const [doctorData,setDoctorData]=useState([]);
    

    const navigate=useNavigate();
    
    useEffect(()=>{
       // const doctor_id=8;
       /* if(!doctor_id){
            navigate("/login");
            return;
        }*/
        Axios.get(`http://localhost:3001/doctorId/${doctor_id}`)
        .then((response)=>{
            const birthDate=response.data.date_of_birth.split("T")[0];
            response.data.date_of_birth=birthDate;
            setDoctorData(response.data);
        })
        .catch((error)=>{
            console.error("Error fetching doctor data",error);
     } );
    },[doctor_id]);

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
                    src={`http://localhost:3001${doctorData.image_path}`}
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
                <li className="list-group-item"><FaStethoscope size={18} color="#51A485" title="Specialization" className="me-2"/>Specialization: {doctorData.specialization_name}</li>
                <li className="list-group-item"><FaHospital size={18} color="#51A485" title="Gender" className="me-2"/> Department: {doctorData.department_name}</li>
            </ul>




        </div>
        </div>
        </div>
    );


}
export default DoctorPofile;