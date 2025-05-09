import Sidebar from "../../Components/AdminSidebar";
import { useState,useEffect } from "react";
import Axios from 'axios';
import { Link, useLocation } from "react-router-dom";

const ViewDoctors=()=>{

    const [doctorList,setDoctorList]=useState([]);
    useEffect(()=>{
        Axios.get("http://localhost:3001/viewDoctors").then((response)=>{
            setDoctorList(response.data);
        });
    },[]);

    const deleteDoctor=(id)=>{
        Axios.delete(`http://localhost:3001/deleteDoctor/${id}`)
        .then(()=>{
            setDoctorList(prevList=>prevList.filter(d=>d.doctor_id!==id));
        })
        .catch(error=>{
            console.log(error);
        });
        
    };



   
    return(
        <>
        
       <div style={{display: "flex",minHeight: "100vh"}}>
            <div style={{width: "250px"}}>
                <Sidebar role="admin"/>
        </div>
        <div style={{flex:1,display: 'flex',justifyContent:'center',alignItems: 'center',padding:'30px'}}>

        <table className="table table-striped table-borderes" style={{
            width: '100%',
             maxWidth: '900px',
              fontSize: '1rem', 
              borderCollapse: 'collapse',
              margin:'0 auto',
              border: '1px solid #D3D3D3'
               }}>
        
  <thead>
    <tr>
      <th scope="col">Id</th>
      <th scope="col">First Name</th>
      <th scope="col">Last Name</th>
      <th scope="col">Email</th>
      <th scope="col">Password</th>
      <th scope="col">Phone</th>
      <th scope="col">Role</th>
      <th scope="col">Date of Birth</th>
      <th scope="col">Gender</th>
      <th scope="col">Specialization</th>
      <th scope="col">Department</th>
    </tr>
  </thead>
  <tbody>
    {doctorList.map((doctor)=>(
        <tr key={doctor.doctor_id}>
        <td >{doctor.doctor_id}</td>
        <td >{doctor.first_name}</td>
        <td >{doctor.last_name}</td>
        <td >{doctor.email}</td>
        <td >{doctor.password}</td>
        <td >{doctor.phone}</td>
        <td >{doctor.role_name}</td>
        <td >{doctor.date_of_birth}</td>
        <td >{doctor.gender_name}</td>
        <td >{doctor.specialization_name}</td>
        <td >{doctor.department_name}</td>
        <td><button style={{
            backgroundColor: '#51A485',
            color: '#fff',
            border: 'none',
            borderRadius: '5px'
        }}><Link to='/updateDoctors/:id' className="nav-link text-white hover-link">Update</Link></button></td>
        <td><button onClick={()=>deleteDoctor(doctor.doctor_id)} style={{
            backgroundColor: '#51A485',
            color: '#fff',
            border: 'none',
            borderRadius: '5px'
        }}>Delete</button></td>
        
      </tr>

    ))}
    
    
  </tbody>
</table>
</div>
</div>
</> 
    );
};
export default ViewDoctors;