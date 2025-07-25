import 'bootstrap/dist/js/bootstrap.bundle.min.js'; 
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';

import Axios from "axios";
import { useState,useEffect } from 'react';

import { Link } from 'react-router-dom';
import NavbarPatient from '../Components/NavbarPatient';
function MedicalStaffPatient(){
    

    const [staffList,setstaffList]=useState([]);

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