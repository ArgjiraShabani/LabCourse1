import Sidebar from "../../Components/AdminSidebar";
import { useState,useEffect } from "react";
import Axios from 'axios';
import { Link, useLocation } from "react-router-dom";
import { GoTrash } from "react-icons/go";
import { FaRegEdit,FaRegEye } from "react-icons/fa";
import Swal from "sweetalert2";
import withReactContent from 'sweetalert2-react-content';
import DoctorModal from "./DoctorModal";


const ViewDoctors=()=>{
    const swal=withReactContent(Swal);
    const [selectedDoctor,setSelectedDoctor]=useState(null);
    const confirmDeletion= (id)=>{
        swal.fire({
            title: "Are you sure you want to delete the user?",
            text: "This action cannot be undone!",
            icon : "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, delete it!",
            cancelButtonText: "Cancel"
        }).then((result)=>{
            if(result.isConfirmed){
                deleteDoctor(id);
            }
        });
    };
     const [openModal,setOpenModal] = useState(false);
    const [doctorList,setDoctorList]=useState([]);
    useEffect(()=>{
        Axios.get("http://localhost:3001/viewDoctors").then((response)=>{
            const formattedData=response.data.map((doctor)=>{
                if(doctor.date_of_birth){
                    return{
                    ...doctor,date_of_birth: doctor.date_of_birth.split("T")[0],
                };
            }
            return doctor;
            })
             
            setDoctorList(formattedData);
        });
    },[]);

    const deleteDoctor=(id)=>{
        Axios.delete(`http://localhost:3001/deleteDoctor/${id}`)
        .then(()=>{
            setDoctorList(prevList=>prevList.filter(d=>d.doctor_id!==id));
            swal.fire('Deleted!','Doctor has been deleted.','Success');
        })
        .catch(error=>{
            console.log(error);
            swal.fire('Failed to delete doctor.');
        });
        
    };



   
    return(
        <>
        
       <div style={{display: "flex",minHeight: "100vh"}}>
            <div style={{width: "250px"}}>
                <Sidebar role="admin"/>
        </div>
        <div style={{flex:1,display: 'flex',justifyContent:'center',alignItems: 'center',padding:'30px'}}>

        <table className="table  table-borderes" style={{
            width: '100%',
             maxWidth: '900px',
              fontSize: '1rem', 
              borderCollapse: 'collapse',
              margin:'0 auto',
              border: '1px solid #D3D3D3'
               }}>
        
  <thead style={{backgroundColor: '#51A485',color: '#fff',padding: '12px 15px'}}>
    <tr style={{backgroundColor: '#51A485',color: '#fff',padding: '12px 15px'}}>
      <th scope="col" >Id</th>
      <th scope="col">First Name</th>
      <th scope="col" >Last Name</th>
      <th scope="col" >Email</th>
      {/*<th scope="col" >Password</th>
      <th scope="col" >Phone</th>*/}
      <th scope="col" >Role</th>
      {/*<th scope="col" >Date of Birth</th>
      <th scope="col">Gender</th>*/}
      
      <th scope="col" >Specialization</th>
      <th scope="col" >Department</th>
    </tr>
  </thead>
  <tbody>
    {doctorList.map((doctor)=>(
        <tr key={doctor.doctor_id}>
        <td >{doctor.doctor_id}</td>
        <td >{doctor.first_name}</td>
        <td >{doctor.last_name}</td>
        <td >{doctor.email}</td>
        {/*<td >{doctor.password}</td>
        <td >{doctor.phone}</td>*/}
        <td >{doctor.role_name}</td>
        {/*<td >{doctor.date_of_birth}</td>
        <td >{doctor.gender_name}</td>*/}
        
        <td >{doctor.specialization_name}</td>
        <td >{doctor.department_name}</td>
       <td><button  style={{
            backgroundColor: '#fff',
            color: '#51A485',
            border: 'none',
            borderRadius: '0px',
            cursor: 'pointer'
        }}  onClick={()=>{
            setSelectedDoctor(doctor.doctor_id);
            setOpenModal(true)}} ><FaRegEye size={18} color="#51A485" title="View full profile"/></button>
        {openModal && <DoctorModal doctor_id={selectedDoctor} closeModal={()=>setOpenModal(false)}/>}
        </td>
        <td><Link to={`/updateDoctors/${doctor.doctor_id}`} className="nav-link text-white hover-link"
        style={{display: 'inline-block',padding: '2px',background: '#fff',borderRadius: '5px'}}
       > <FaRegEdit size={18} color="#51A485" title="Update"/></Link></td>
        <td><button onClick={()=>confirmDeletion(doctor.doctor_id)} style={{
            backgroundColor: '#fff',
            color: '#51A485',
            border: 'none',
            borderRadius: '0px',
            cursor: 'pointer'
        }}><GoTrash size={18} color="#51A485" title="Delete"/></button></td>

        
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