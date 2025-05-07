
import { useState,useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";


function UpdateProfile({id}){
  const navigate=useNavigate();
  const [info,setInfo]=useState({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    date_of_birth: "",
    gender_name: "",
    blood_type: ""
  });

  useEffect(()=>{
      axios.get(`http://localhost:3001/infoPatient/${id}`).then((response)=>{
        const dateOfBirth = response.data.date_of_birth.split("T")[0];
        response.data.date_of_birth = dateOfBirth;
        console.log(response.data)
          setInfo(response.data);

      })
  },[id]);


  if (!info) {
    return <p>Loading...</p>;
  }
   

  const handleSubmit=(e)=>{
    e.preventDefault();
    axios.put(`http://localhost:3001/updatePatient/${id}`,info)
    .then(res=>{
      navigate(`/bookAppointment/${id}`);
    })
    .catch(err=>console.log(err));
  }


  return(
    <>
        <div style={{marginTop:"20px",borderStyle:"solid",padding:"60px 90px",borderRadius:'10px',borderWidth:'1px',borderColor:"white",   boxShadow: '0 4px 20px rgba(0, 0, 0, 0.5)'}}>
          <h1 style={{textAlign:"center",marginBottom:"40px"}}>Update Profile</h1>
          <form onSubmit={handleSubmit} >
            <div style={{marginBottom:"20px"}}>
              <label>Firstname:</label><br/>
              <input type="text" value={info.first_name} onChange={e=>setInfo({...info,first_name:e.target.value})} style={{width:'300px',height:"35px"}}/>
            </div>
            <div style={{marginBottom:"20px"}}>
              <label>Lastname:</label><br/>
              <input type="text" value={info.last_name} onChange={e=>setInfo({...info,last_name:e.target.value})} style={{width:'300px',height:"35px"}}/>
            </div>
            <div style={{marginBottom:"20px"}}>
              <label>Email:</label><br/>
              <input type="email" value={info.email} onChange={e=>setInfo({...info,email:e.target.value})} style={{width:'300px',height:"35px"}}/>
            </div>
            <div style={{marginBottom:"20px"}}>
              <label>Phone Number:</label><br/>
              <input type="text" value={info.phone} onChange={e=>setInfo({...info,phone:e.target.value})} style={{width:'300px',height:"35px"}}/>
            </div>
            <div style={{marginBottom:"20px"}}>
              <label>Birthday:</label><br/>
              <input type="date" value={info.date_of_birth} onChange={e=>setInfo({...info,date_of_birth:e.target.value})} style={{width:'300px',height:"35px"}}/>
            </div>
            <div style={{marginBottom:"20px"}}>
              <label>Gender:</label><br/>
              <select value={info.gender_name} onChange={e=>setInfo({...info,gender_name:e.target.value})} style={{width:"300px",height:"35px"}}>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div style={{marginBottom:"20px"}}>
              <label>Blood Type:</label><br/>
              <select value={info.blood_type} onChange={e=>setInfo({...info,blood_type:e.target.value})} style={{width:"300px",height:"35px"}}>
                <option value="A+">A+</option>
                <option value="A-">A-</option>
                <option value="B+">B+</option>
                <option value="B-">B-</option>
                <option value="AB+">AB+</option>
                <option value="AB-">AB-</option>
                <option value="O+">0+</option>
                <option value="O-">0-</option>
                <option value="Unknown">Unknown</option>
              </select>
            </div>

            <div style={{marginBottom:"20px"}}>
              <button type="submit" style={{width:"300px",borderColor:"#51A485",backgroundColor:"#51A485",height:"50px",color:"white"}}>UPDATE</button>
            </div>
          </form>
            
        </div>
    </>
  )
}

export default UpdateProfile;