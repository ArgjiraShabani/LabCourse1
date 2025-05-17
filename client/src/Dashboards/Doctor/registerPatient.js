import React, { useEffect, useState } from "react";
import Sidebar from "../../Components/AdminSidebar";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Swal from 'sweetalert2';





function Register(){
    const navigate=useNavigate();
    const [gender,setGender]=useState([]);
    const [blood,setBlood]=useState([]);
    const [status,setStatus]=useState([]);
    const [info,setInfo]=useState({
        first_name:"",
        last_name:"",
        email:"",
        password:"",
        number:"",
        birth:"",
        gender:"",
        blood:"",
        status:"",
        file:""

    });

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
        axios.get("http://localhost:3001/status").then((response)=>{
            setStatus(response.data);
        })
    },[]);
    const handleClick=(e)=>{
          e.preventDefault();
          const formdata=new FormData();
            formdata.append("image", info.file);
            formdata.append("first_name", info.first_name);
            formdata.append("last_name", info.last_name);
            formdata.append("email", info.email);
            formdata.append("password", info.password);
            formdata.append("number", info.number);
            formdata.append("birth", info.birth);
            formdata.append("gender", info.gender);
            formdata.append("blood", info.blood);
            formdata.append("status", info.status);
         axios.post("http://localhost:3001/registerPatient",formdata).then(res=>{ 
            Swal.fire({
                position: "center",
                icon: "success",
                title: "The patient was successfully registered!",
                showConfirmButton: false,
                timer: 2000
                });

        }).catch(err=>{

           console.log(err);
             Swal.fire({
                position: "center",
                icon: "error",
                title: "Patient is not registered!Please check again!",
                showConfirmButton: false,
                timer: 1500
                });
        });
    }
    

    return (
        <>
        <div style={{display:"flex"}}>
            <Sidebar role={"doctor"}/>
            <div className="container mt-5">
                <h2 style={{textAlign:"center",marginBottom:"50px"}}>Register Patient</h2>
                <form   className="mt-4" style={{borderRadius:'10px',borderWidth:'1px',borderColor:"white",boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)',padding:"50px",margin:"50px"}}>
                    <div className="mb-3">
                    <label htmlFor="name" className="form-label">Firstname:</label>
                    <input type="text" className="form-control" required onChange={e=>setInfo({...info,first_name:e.target.value})}/>
                    </div>
                    <div className="mb-3">
                    <label htmlFor="name" className="form-label" >Lastname:</label>
                    <input type="text" className="form-control" required onChange={e=>setInfo({...info,last_name:e.target.value})}/>
                    </div>
                    <div className="mb-3">
                    <label htmlFor="email" className="form-label" >Email:</label>
                    <input type="email" className="form-control" required onChange={e=>setInfo({...info,email:e.target.value})}/>
                    </div>
                    <div className="mb-3">
                    <label htmlFor="email" className="form-label" >Password:</label>
                    <input type="password" className="form-control"  required onChange={e=>setInfo({...info,password:e.target.value})}/>
                    </div>
                     <div className="mb-3">
                    <label htmlFor="email" className="form-label">Phone Number:</label>
                    <input type="text" className="form-control"  required onChange={e=>setInfo({...info,number:e.target.value})}/>
                    
                    </div>
                    <div className="mb-3">
                    <label htmlFor="name" className="form-label">Birthday:</label>
                    <input type="date" className="form-control" onFocus={(e) => e.target.showPicker && e.target.showPicker()} required onChange={e=>setInfo({...info,birth:e.target.value})}/>
                    </div>
                    <div className="mb-3">
                    <label htmlFor="photo" className="form-label">Upload Photo:</label>
                     <input type="file" className="form-control" onChange={e=>setInfo({...info,file:e.target.files[0]})} />
                     </div>
                    <div style={{display:"flex",justifyContent:"space-between",flexWrap:"wrap"}}>
                    <div className="mb-3">
                    <select className="form-control" onChange={e=>setInfo({...info,gender:e.target.value})} required>
                        <option value="" disabled selected>Gender</option>
                        {gender.map((value,key)=>{
                            return(
                            <option key={key}>{value.gender_name}</option>
                            )
                        })}
                    </select>
                    </div>
                    <div className="mb-3">
                    <select className="form-control" onChange={e=>setInfo({...info,blood:e.target.value})} required>
                       <option value="" disabled selected>Blood</option>
                        {blood.map((value,key)=>{
                            return(
                            <option key={key} value={value.blood_type}>{value.blood_type}</option>
                            )
                        })}
                    </select>
                   </div>
                   <div className="mb-3">
                    <select className="form-control" onChange={e=>setInfo({...info,status:e.target.value})} required>
                        <option value="" disabled selected>Status</option>
                         {status.map((value,key)=>{
                            return(
                            <option key={key} value={value.status_name}>{value.status_name}</option>
                            )
                        })}
                    </select>
                   </div>
                   </div>
                  <button type="submit" onClick={handleClick} className="form-control" style={{backgroundColor:"#51A485",color:"white",height:"50px"}}>Register</button>

                </form>
            </div>
    </div>
    </>
  );
};

export default Register;
