
import { useState,useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";


function UpdateProfile({id}){
  const navigate=useNavigate();
  const [info,setInfo]=useState({
    first_name: "",
    last_name: "",
    phone: "",
    date_of_birth: "",
    gender_name: "",
    blood_type: "",
    file:""
  });
  const [gender,setGender]=useState([]);
  const [blood,setBlood]=useState([]);
  useEffect(()=>{
    axios.get('http://localhost:3001/gender').then((response)=>{
      setGender(response.data);
    })
  },[]);
  useEffect(()=>{
    axios.get('http://localhost:3001/blood').then((response)=>{
      setBlood(response.data);
    })
  },[]);
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
    const formdata=new FormData();
      formdata.append("image",info.file);
      formdata.append("first_name",info.first_name);
      formdata.append("last_name",info.last_name);
      formdata.append("phone",info.phone);
      formdata.append("date_of_birth",info.date_of_birth);
      formdata.append("gender_name",info.gender_name);
      formdata.append("blood_type",info.blood_type);
    axios.put(`http://localhost:3001/updatePatient/${id}`,formdata)
    .then(res=>{
      navigate(`/myProfile/${id}`);
    })
    .catch(err=>console.log(err));
  }


  return(
    <>
        <div style={{marginTop:"20px",borderStyle:"solid",padding:"60px 90px",borderRadius:'10px',borderWidth:'1px',borderColor:"white",   boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)'}}>
          <h1 style={{textAlign:"center",marginBottom:"40px"}}>Update Profile</h1>
          <form className="mt-4">
            <div className="mb-3" style={{marginBottom:"20px"}}>
              <label>Firstname:</label><br/>
              <input className="form-control" type="text" value={info.first_name} onChange={e=>setInfo({...info,first_name:e.target.value})} style={{width:'300px',height:"40px"}}/>
            </div>
            <div style={{marginBottom:"20px"}}>
              <label >Lastname:</label><br/>
              <input className="form-control" type="text" value={info.last_name} onChange={e=>setInfo({...info,last_name:e.target.value})} style={{width:'300px',height:"40px"}}/>
            </div>
            <div style={{marginBottom:"20px"}}>
              <label>Phone Number:</label><br/>
              <input className="form-control" type="text" value={info.phone} onChange={e=>setInfo({...info,phone:e.target.value})} style={{width:'300px',height:"40px"}}/>
            </div>
            <div style={{marginBottom:"20px"}}>
              <label>Birthday:</label><br/>
              <input className="form-control" type="date" value={info.date_of_birth} onChange={e=>setInfo({...info,date_of_birth:e.target.value})} style={{width:'300px',height:"40px"}}/>
            </div>
             <div style={{marginBottom:"20px"}}>
              <label>Photo:</label><br/>
              <input className="form-control" type="file" onChange={e=>setInfo({...info,file:e.target.files[0]})} style={{width:'300px',height:"40px"}}/>
            </div>
            <div style={{marginBottom:"20px"}}>
              <label>Gender:</label><br/>
              <select  className="form-control" value={info.gender_name} onChange={e=>setInfo({...info,gender_name:e.target.value})} style={{width:"300px",height:"40px"}}>
              {gender.map((value,key)=>{
                return(
                <option key={key}>{value.gender_name}</option>
                )
              })}
              </select>
            </div>
            <div style={{marginBottom:"20px"}}>
              <label>Blood Type:</label><br/>
              <select  className="form-control" value={info.blood_type} onChange={e=>setInfo({...info,blood_type:e.target.value})} style={{width:"300px",height:"40px"}}>
              {blood.map((value,key)=>{
                return(
                <option key={key}>{value.blood_type}</option>
                )
              })}
              </select>
            </div>

            <div style={{marginBottom:"10px"}}>
              <button  className="form-control" type="submit" onClick={handleSubmit} style={{width:"300px",borderColor:"#51A485",backgroundColor:"#51A485",height:"50px",color:"white"}}>UPDATE</button>
            </div>
          </form>
            
        </div>
    </>
  )
}

export default UpdateProfile;