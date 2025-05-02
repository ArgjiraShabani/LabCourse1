
import { useState,useEffect } from "react";
import Axios from "axios";


function Info({id}){
    const [info,setInfo]=useState({
        first_name: "",
        last_name: "",
        email: "",
        phone: "",
        date_of_birth: "",
        gender: "",
        blood_type: ""
    });
    useEffect(()=>{
        Axios.get(`http://localhost:3001/infoPatient/${id}`).then((response)=>{
            const dateOfBirth = response.data.date_of_birth.split("T")[0];
            response.data.date_of_birth = dateOfBirth;
            setInfo(response.data);
        })
    },[id]);
    if (!info) {
        return <p>Loading profile...</p>;
      }
     


  return (
   <>
   
   <div style={{marginTop:"60px",borderStyle:"solid",padding:'70px 110px',borderRadius:'10px',borderWidth:'1px',borderColor:"white",boxShadow: '0 4px 20px rgba(0, 0, 0, 0.5)',height:"500px"}}>
    <h5>Firstname:<b> {info.first_name}</b></h5>
    <br/>
    <h5>Lastname: <b> {info.last_name}</b></h5>
    <br/>
    <h5>Email:<b> {info.email}</b></h5>
    <br/>
    <h5>Phone Number:<b> {info.phone}</b></h5>
    <br/>
    <h5>Gender:<b> {info.gender}</b></h5>
    <br/>
    <h5>Birthday:<b> {info.date_of_birth}</b></h5>
    <br/>
    <h5>Blood Type:<b> {info.blood_type}</b> </h5>
    </div>

    
   </>
    
  );
}

export default Info;