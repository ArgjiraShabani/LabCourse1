import 'bootstrap/dist/js/bootstrap.bundle.min.js'; 
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import Axios from "axios";
import { useState,useEffect } from 'react';
import { Link } from 'react-router-dom';
import NavbarPatient from '../Components/NavbarPatient';
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { useParams } from "react-router-dom";



function MedicalStaffPatient(){

    const [staffList,setstaffList]=useState([]);
    const param=useParams();
    const {id}=param;
    const navigate = useNavigate();
     

     useEffect(() => {
  Axios
    .get(`http://localhost:3001/staff/${id}`, {
      withCredentials: true, // this sends the JWT cookie
    })
    .then((res) => {
      if (res.data.user?.role !== 'patient') {
        // Not a patient? Block it.
        Swal.fire({
          icon: 'error',
          title: 'Access Denied',
          text: 'Only patients can access this page.',
        });
        navigate('/');
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
        navigate('/');
      } else {
        console.error("Unexpected error", err);
      }
    });
}, [id]);

useEffect(()=>{
        Axios.get("http://localhost:3001/api/staff").then((response)=>{
            setstaffList(response.data);
        })
    },[staffList])

    return(
        <>
            
            <NavbarPatient/>
            <div class="container my-4">
                <h1 class="text-center display-4" style={{color:"#51A485",marginTop:"50px",fontWeight:"bold"}}> Medical Staff</h1>
            </div>
            <div style={{display:"flex",justifyContent:"center",margin:"20px",flexWrap:"wrap",gap:"40px",}}>
                 {staffList.map((val,key)=>{
                        return(
                            <>
                            <div class="card" style={{width: "18rem",border:"1px solid #51A485"}}>
                             <img src="https://www.nicepng.com/png/detail/867-8678512_doctor-icon-physician.png" class="card-img-top" alt="..." style={{height:"270px"}}/>
                             <div class="card-body">
                                 <p>Name: {val.first_name}</p>
                                 <p>LastName: {val.last_name}</p>
                                 <p>Specialization: {val.specialization_name}</p>
                             </div>
                             </div> 
                             </>
                        )
                    })}
    
                
            </div>
        </>
    )
}

export default MedicalStaffPatient;