
import { useState,useEffect } from "react";
import { LuCalendarDays } from "react-icons/lu";
import {FaUser,FaEnvelope,FaTint,FaUserCircle ,FaPhone,FaGenderless,FaStethoscope,FaHospital,FaBirthdayCake} from "react-icons/fa";
import axios from "axios";
import Swal from "sweetalert2";




function Info({id,info,setInfo}){
   

    if (!info) {
        return <p>Loading profile...</p>;
      }
    
    function removePhoto(){
        Swal.fire({
            title: "Are you sure about removing your photo?",
            showCancelButton: true,
            confirmButtonColor: "#51A485",
            cancelButtonColor: "#d33",
            confirmButtonText: "Update"
            }).then((result) => {
            if (result.isConfirmed) {
                    axios.post(`http://localhost:3001/removePhotoPatient/${id}`).then((response)=>{
                    setInfo(prevInfo => ({ ...prevInfo, image_path: null }));
                        Swal.fire({
                                    position: "center",
                                    icon: "success",
                                    title: "Your profile photo is removed!",
                                    showConfirmButton: false,
                                    timer: 1200
                                    });
                    })
                    .catch((err)=>{
                        console.log(err);
                    })

            }})
            .catch(err=>console.log(err));
    }
     


  return (
   <>
   
   <div style={{marginTop:"20px",borderStyle:"solid",padding:'70px 110px',borderRadius:'10px',borderWidth:'1px',borderColor:"white",boxShadow: '0 4px 20px rgba(0, 0, 0, 0.2)'}}>
      {info.image_path ? (
        <>
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
         <div style={{display:"flex",justifyContent:"center"}}>
         <button className="form-control" type="submit" onClick={removePhoto} style={{width:"300px",borderColor:"#51A485",backgroundColor:"#51A485",height:"50px",color:"white"}}>Remove photo</button>
         </div>
         </>
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
                        <img src={'http://localhost:3001/uploads/1748181746097.jpg'} style={{width:"350px",height: '200px',}}/>
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