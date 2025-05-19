
import { useState,useEffect } from "react";
import Axios from "axios";
import { LuCalendarDays } from "react-icons/lu";
import {FaUser,FaEnvelope,FaTint,FaUserCircle ,FaPhone,FaGenderless,FaStethoscope,FaHospital,FaBirthdayCake} from "react-icons/fa";



function Info({info}){
   
    
    if (!info) {
        return <p>Loading profile...</p>;
      }
     


  return (
   <>
   
   <div style={{marginTop:"60px",borderStyle:"solid",padding:'70px 110px',borderRadius:'10px',borderWidth:'1px',borderColor:"white",boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)'}}>
      {info.image_path ? (
        <div
                    style={{

                        width: '200px',
                        height: '195px',
                        borderRadius: '50%',
                        lineHeight: '150px',
                        textAlign: 'center',
                        fontSize: '16px',
                        color: '#555',
                        margin: '0 auto',
                        display:"flex",
                        justifyContent:"center",
                        alignItems:"center",
                        fontSize:"20px"
                    }

                    }>
        <img src={`http://localhost:3001/uploads/${info.image_path}`} alt="My Photo" style={{width:"200px",paddingBottom:"50px"}}/>
         </div>
        ):(<div
                    style={{

                        width: '200px',
                        height: '195px',
                        borderRadius: '50%',
                        lineHeight: '150px',
                        textAlign: 'center',
                        fontSize: '16px',
                        color: '#555',
                        margin: '0 auto',
                        display:"flex",
                        justifyContent:"center",
                        alignItems:"center",
                        fontSize:"20px"
                    }

                    }>
                        <img src={'http://localhost:3001/uploads/1746947791225.png'} style={{width:"350px",height: '200px',}}/>
                </div>)}
    <br/>
    <div style={{display:"flex"}}><FaUserCircle size={18} color="#51A485" title="Name" className="me-2"/><h5>Firstname:<b> {info.first_name}</b></h5></div>
    <hr/>
    <div style={{display:"flex"}}><FaUserCircle size={18} color="#51A485" title="Lastname" className="me-2"/><h5>Lastname: <b> {info.last_name}</b></h5></div>
    <hr/>
    <div style={{display:"flex"}}><FaEnvelope size={18} color="#51A485" title="Email" className="me-2"/><h5>Email:<b> {info.email}</b></h5></div>
    <hr/>
    <div style={{display:"flex"}}><FaPhone size={18} color="#51A485" title="Phone" className="me-2"/> <h5>Phone Number:<b> {info.phone}</b></h5></div>
    <hr/>
    <div style={{display:"flex"}}><FaGenderless size={18} color="#51A485" title="Gender" className="me-2"/><h5>Gender:<b> {info.gender_name}</b></h5></div>
    <hr/>
    <div style={{display:"flex"}}><FaBirthdayCake size={18} color="#51A485" title="Birth" className="me-2"/><h5>Birthday:<b> {info.date_of_birth}</b></h5></div>
    <hr/>
    <div style={{display:"flex"}}><FaTint size={18} color="#51A485" title="Blood Type" className="me-2"/><h5>Blood Type:<b> {info.blood_type}</b> </h5></div>
    </div>

   </>
    
  );
}

export default Info;