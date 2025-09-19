import Sidebar from "../../Components/AdminSidebar";
import { useState,useEffect } from "react";
import Axios from 'axios';
import { Link, useLocation, useNavigate } from "react-router-dom";
import { GoTrash } from "react-icons/go";
import { FaRegEdit,FaRegEye } from "react-icons/fa";
import Swal from "sweetalert2";
import withReactContent from 'sweetalert2-react-content';
import DoctorModal from "./DoctorModal";


const ViewDoctors=()=>{
    const swal=withReactContent(Swal);
    const [selectedDoctor,setSelectedDoctor]=useState(null);
    const [searchTerm, setSearchTerm]=useState("");
    const[filteredDoctors, setFilteredDoctors]= useState([]);
    const [openModal,setOpenModal] = useState(false);
    const [doctorList,setDoctorList]=useState([]);
    
    
    const confirmDeletion= (id)=>{
        swal.fire({
            title: "Are you sure you want to deactivate the account?",
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
     
    const navigate=useNavigate();
         useEffect(() => {
            Axios.get(`http://localhost:3001/viewDoc`, {withCredentials: true})
              .then((res) => {
                if (res.data.user?.role !== "admin") {
                  Swal.fire({
                    icon: "error",
                    title: "Access Denied",
                    text: "Only admin can access this page.",
                    confirmButtonColor: "#51A485",
                  });
                  navigate("/login");
                }
              })
              .catch((err) => {
                  console.error("Caught error:", err);
    
                if (err.response && (err.response.status === 401 || err.response.status === 403)) {
                   
                    navigate('/login');
                } else {
                    console.error("Unexpected error", err);
                }
              });
          }, [navigate]);
    useEffect(()=>{
        Axios.get("http://localhost:3001/api/viewDoctors",{
            withCredentials: true
        }).then((response)=>{
            const formattedData=response.data.map((doctor)=>{
                if(doctor.date_of_birth){
                    return{
                    ...doctor,date_of_birth: doctor.date_of_birth.split("T")[0],
                };
            }
            return doctor;
            })
            console.log(formattedData)
            setDoctorList(formattedData);
            setFilteredDoctors(formattedData);
        });
    },[]);
    const handleSearch=()=>{
        const term=searchTerm.trim().toLowerCase();
        
        if(term===""){
            setFilteredDoctors(doctorList);
            return;
        }
            const filtered=doctorList.filter((doctor)=>{
                const fullName=`${doctor.first_name} ${doctor.last_name}`.toLowerCase();
                const specialization=doctor.specialization_name?doctor.specialization_name.toLowerCase():'';
                const department=doctor.department_name?doctor.department_name.toLowerCase(): '';

                return(
                    fullName.includes(term)||
                    specialization.includes(term)||
                    department.includes(term)
                );
            });
            console.log('Filtered doctors', filtered);
            setFilteredDoctors(filtered);
        
    };
    useEffect(()=>{
        if(searchTerm.trim()===""){
            setFilteredDoctors(doctorList);
        }
    },[searchTerm,doctorList]);

    const deleteDoctor=(id)=>{
        Axios.delete(`http://localhost:3001/api/deleteDoctor/${id}`,{
            withCredentials: true
        })
        .then(()=>{
            setDoctorList(prevList=>prevList.filter(d=>d.doctor_id!==id));
            swal.fire('Deactivated!','Doctor has been deactivated.','Success');
           
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
        {/*<div
        style={{display: 'flex',
        justifyContent:'flex-end',}}
        >
            
        <Link to={'/deactivatedAccounts'} style={{
        
        padding: '10px 20px',
        
        color: '#51A485',
        textDecoration: 'none',
        borderRadius: '4px'
    }}> View Deactivated Doctors</Link>
        
        </div>*/}
        <div style={{flex:1,padding:'30px'}}>

            <div style={{
                marginBottom: '50px',
                marginTop: '20px',
                marginLeft:'auto',
                marginRight:'auto',
                width: '100%',
                maxWidth: '900px',
                display: 'flex',
                alignItems: 'center',
                
                gap: '10px'

            }}>
                
                <input type="text"
                placeholder="Search By Name, Specialization, Department"
                value={searchTerm}
                onChange={(e)=>setSearchTerm(e.target.value)}
                onKeyDown={(e)=>{
                    if(e.key==="Enter"){
                        handleSearch();
                    }
                }}
                style={{
                    flex: 1,
                    
                    padding: '10px',
                    borderRadius: '1px solid #ccc',
                    fontSize: '16px'
                    
                }}/>
                <button
    onClick={handleSearch}
    style={{
        marginTop: '10px',
        padding: '10px 20px',
        backgroundColor: '#51A485',
        color: '#fff',
        border: 'none',
        cursor: 'pointer',
        whiteSpace: 'nowrap',
        
    }}
>
    Search
</button>
            </div>

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
      <th scope="col">Status</th>
    </tr>
  </thead>
  <tbody>
     {filteredDoctors.length===0?(
        <tr>
            <td colSpan="9" style={{ textAlign: "center", padding: "15px", color: "#888" }}>
        No doctors found.
      </td>
        </tr>
    ):(
        filteredDoctors.map((doctor)=>(
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
        
        <td>{doctor.specialization_name || "No specialization"}</td>
        <td>
            {doctor.department_status === 2 ? "Inactive" : doctor.department_name}
        </td>
        <td>
            {doctor.is_active ? "Active" : "Inactive"}
        </td>

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
        }}><GoTrash size={18} color="#51A485" title="Deactivate"/></button></td>

        
      </tr>

    )))}
    
    
  </tbody>
</table>
</div>
</div>
</> 
    );
};
export default ViewDoctors;