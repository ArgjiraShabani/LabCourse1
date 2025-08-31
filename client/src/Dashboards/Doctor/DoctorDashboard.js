import { useState } from "react";
import Sidebar from "../../Components/AdminSidebar";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useEffect } from "react";
import { FaUserInjured, FaCalendarCheck, FaUserMd , FaSmile} from "react-icons/fa";
import { GoSmiley } from "react-icons/go";
import Swal from "sweetalert2";






function DoctorDashboard() {
  const [patientNumber,setPatientNumber]=useState([]);
  const [doctorName,setDoctorName]=useState([]);
  const [appointments, setAppointments]=useState([]);
  const [appointmentNr, setAppointmentNr]=useState([]);
  const navigate= useNavigate();

 useEffect(() => {
  const checkAuthAndFetchData=async()=>{
    try{
     const authres=await axios
    .get("http://localhost:3001/api/doctorDashboard", { withCredentials: true });
    
      if (authres.data.user?.role !== "doctor") {
        Swal.fire({
          icon: "error",
          title: "Access Denied",
          text: "Only doctors can access this page.",
        });
        navigate("/");
        return;
      }
      fetchAppointments();
      fetchTotalPatients();
      fetchAppointmentNumber();
    

    
  }catch(err) {
      if (err.response && (err.response.status === 401 || err.response.status === 403)) {
        Swal.fire({
          icon: "error",
          title: "Access Denied",
          text: "Please login.",
        });
        navigate("/");
      } else {
        console.error("Unexpected error", err);
      }
    }
    };
    checkAuthAndFetchData();
}, [navigate]);

const fetchAppointments=()=>{
  axios.get("http://localhost:3001/doctor-appointments",{withCredentials: true})
  .then((response)=>{
    setAppointments(response.data);
  })
  .catch((error )=>{
     if (error.response) {
        console.error("Error fetching appointments:", error.response.status, error.response.data);
    } else {
        console.error("Network error or no response:", error.message);
    }

  })
}


const fetchTotalPatients=()=>{
  axios.get('http://localhost:3001/api/totalPatients',{withCredentials: true})
  .then((response)=>{
    const {first_name,last_name,total_patients}=response.data;
    setPatientNumber(total_patients);
    setDoctorName(`${first_name} ${last_name}`);

  })
  .catch((error )=>{
     if (error.response) {
        console.error("Error fetching patient number:", error.response.status, error.response.data);
    } else {
        console.error("Network error or no response:", error.message);
    }

  })

}

const fetchAppointmentNumber=()=>{
  axios.get('http://localhost:3001/api/appointmentNumber',{withCredentials: true})
  .then((response)=>{
    const {total_appointments}=response.data;
    setAppointmentNr(total_appointments);
    

  })
  .catch((error )=>{
     if (error.response) {
        console.error("Error fetching appointment number:", error.response.status, error.response.data);
    } else {
        console.error("Network error or no response:", error.message);
    }

  })
}

const isToday=(dateStr)=>{
  const date=new Date(dateStr);
  const today=new Date();
  return(
    date.getDate()===today.getDate() &&
    date.getMonth()===today.getMonth() &&
    date.getFullYear()===today.getFullYear()
  );
};
const todaysAppointments=appointments.filter(a=>
  isToday(a.appointment_datetime)
);
    
  return (
    <div className="d-flex" style={{ minHeight: '100vh' }}>
             <div style={{width: "250px"}}>
                 <Sidebar role="doctor"/>
             </div>
             <div
        className="flex-grow-1 d-flex flex-column  align-items-start"
        style={{ padding: "40px" }}
      >
             <div  style={{
            width: "100%",
            //maxWidth: "1200px",
            backgroundColor: "#fff",
            borderRadius: "12px",
            padding: "30px",
            boxShadow: "0 8px 20px rgba(0, 0, 0, 0.1)",
            marginBottom: "20px"}}>
              <h2 style={{color:' #51A485'}}>Welcome, Dr. {doctorName} <GoSmiley color=" #51A485" size={30}/></h2>
             
            
        </div>
        <div 
  style={{
    width: "100%",
    //maxWidth: "1200px",
    backgroundColor: "#fff",
    borderRadius: "12px",
    padding: "30px",
    boxShadow: "0 8px 20px rgba(0, 0, 0, 0.1)",
    marginBottom: "20px"
  }}>
    <h4 className="mb-4">Dashboard Overview</h4>
        <div className="row g-4">
              <div className="col-md-6">
                <div className="card text-white h-100"
                style={{backgroundColor: "#51A485", borderRadius: "15px"}}>
                  <div className="card-body d-flex align-items-center">
                    <FaUserInjured size={40} className="me-3"/>
                    <div>
                      <h5 className="card-title">Total Patients</h5>
                      <h3>{patientNumber}</h3>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-md-6">
                <div
                className="card text-white h-100"
                style={{backgroundColor: "#4e73df", borderRadius: "15px"}}
                >
                  <div className="card-body d-flex align-items-center">
                    <FaCalendarCheck size={40} className="me-3"/>
                    <div>
                      <h5 className="card-title">Appointments</h5>
                      <h3>{appointmentNr}</h3>
                    </div>
                  </div>
                </div>
              </div>
             </div>
           
        </div>
        
           
               

                    <div className="py-4 mt-4"
                    style={{
                      backgroundColor: "#fff",
                      borderRadius: "12px",
                      padding: "20px",
                      boxShadow: "0 8px 20px rgba(0,0,0,0.1)",
                      width: "100%",        
                      maxWidth: "100%", 
                      

                    }}>
                      <h5 className="mb-3" >Today's Appointments</h5>
                      {todaysAppointments.length>0?(
                        <div style={{overflowX: "auto"}}>
                        <table className="table table-striped w-100">
                          <thead>
                            <tr>
                              <th>#</th>
                              <th>
                                 Name
                              </th>
                              <th>Lastname</th>
                              <th>Time</th>
                              <th>Reason</th>
                            </tr>
                          </thead>
                          <tbody>
                            {todaysAppointments.map((appointment,index)=>(
                              <tr key={index}>
                                <td>{index+1}</td>
                                <td>{appointment.patient_name}</td>
                                <td>{appointment.patient_lastname}</td>
                                <td>
                                  {new Date(appointment.appointment_datetime).toLocaleTimeString([],{
                                    hour: "2-digit",
                                    minute: "2-digit"
                                  })}
                                </td>
                                <td>{appointment.purpose|| "N/A"}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                        </div>
                      ):(
                        <p className="text-muted">No appointments today</p>
                      )}
                     
                    </div>
                  
                </div>
              </div>
            
            
       
        
  );
}

export default DoctorDashboard;