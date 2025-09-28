import 'bootstrap/dist/js/bootstrap.bundle.min.js'; 
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';

import Axios from "axios";
import { useState,useEffect } from 'react';

import { Link } from 'react-router-dom';
import Navbar from '../Components/Navbar';
function MedicalStaff(){

    const [staffList,setstaffList]=useState([]);


    useEffect(()=>{
        Axios.get("http://localhost:3001/api/staff").then((response)=>{
            setstaffList(response.data);
        })
    },[])

    return(
        <>
            
            <Navbar/>
            <div className="container my-4">
                <h1 className="text-center display-4" style={{color:"#51A485",marginTop:"50px",fontWeight:"bold"}}> Medical Staff</h1>
            </div>
            <div style={{display:"flex",justifyContent:"center",padding:"20px",flexWrap:"wrap",gap:"40px",}}>
                 {staffList.map((val,key)=>{
                        return(
                            
                            <div key={val.id || val.doctor_id} className="card" style={{width: "18rem",border:"1px solid #51A485"}}>
                             <img src={val.image_path ? `http://localhost:3001/uploads/${val.image_path}`: "https://www.nicepng.com/png/detail/867-8678512_doctor-icon-physician.png"} className="card-img-top" alt="..." style={{height:"270px",objectFit:"cover"}}/>
                             <div className="card-body">
                                 <p>Firstname: {val.first_name}</p>
                                 <p>Lastname: {val.last_name}</p>
                                 <p>Specialization: {val.specialization_name?val.specialization_name:"---"}</p>
                             </div>
                             </div> 
                        )
                    })}
    
                
            </div>
        </>
    )
}

export default MedicalStaff;