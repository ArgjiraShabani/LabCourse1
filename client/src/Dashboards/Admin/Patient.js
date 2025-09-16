import { useState } from "react";
import { useEffect } from "react";
import Axios from "axios";
import Sidebar from "../../Components/AdminSidebar";
import Swal from 'sweetalert2';
import Button from 'react-bootstrap/Button';
import { Link, useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";


function Patient(){

    const [patientList,setPatientList]=useState([]);
    const[status,setStatus]=useState([]);
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState("");


useEffect(() => {
  Axios
    .get(`http://localhost:3001/patient`, {
      withCredentials: true, // this sends the JWT cookie
    })
    .then((res) => {
      if (res.data.user?.role !== 'admin') {
        // Not a patient? Block it.
        Swal.fire({
          icon: 'error',
          title: 'Access Denied',
          text: 'Only admin can access this page.',
        });
        navigate('/');
      }
    })
    .catch((err) => {
      if (err.response && (err.response.status === 401 || err.response.status === 403)) {
         Swal.fire({
                                  icon: "error",
                                  title: "Access Denied",
                                  text: "Please login.",
                                  confirmButtonColor: "#51A485",
                                });
        navigate('/');
      } else {
        console.error("Unexpected error", err);
      }
    });
}, []);

    useEffect(()=>{
        Axios.get("http://localhost:3001/patient/patient",{
        withCredentials: true
    }).then((response)=>{
            console.log(response.data)
              const updatedPatients = response.data.map(patient => {
                if (patient.date_of_birth) {
                    patient.date_of_birth = patient.date_of_birth.split("T")[0];
                     const [year, month, day] = patient.date_of_birth.split("-");
                     patient.date_of_birth = `${month}-${day}-${year}`;
                }
                return patient;
            });
            setPatientList(updatedPatients);
        }) .catch((err) => {
            if (err.response && (err.response.status === 401 || err.response.status === 403)) {
                 Swal.fire({
                                          icon: "error",
                                          title: "Access Denied",
                                          text: "Please login.",
                                          confirmButtonColor: "#51A485",
                                        });
                navigate('/');
            } else {
                console.error("Unexpected error", err);
            }
            
        });
    },[]);
       

    useEffect(()=>{
        Axios.get("http://localhost:3001/api/status",{
        withCredentials: true
    }).then((response)=>{
            setStatus(response.data);
        }).catch(err=>{
            if (err.response && (err.response.status === 401 || err.response.status === 403)) {
                 Swal.fire({
                                          icon: "error",
                                          title: "Access Denied",
                                          text: "Please login.",
                                          confirmButtonColor: "#51A485",
                                        });
                navigate('/');
            } else {
                console.error("Unexpected error", err);
            };
        });
    },[]);

    
function handleClick(id,s_id){
        Swal.fire({
            title: "Are you sure about changing status?",
            showCancelButton: true,
            confirmButtonColor: "#51A485",
            cancelButtonColor: "#d33",
            confirmButtonText: "Change"
            }).then((result) => {
            if (result.isConfirmed) {
                Axios.put("http://localhost:3001/api/updateStatusByAdmin",{status:s_id,id:id},{
        withCredentials: true
    }).then(response=>{
                    const updatedList = patientList.map(patient => {
                        if (patient.patient_id === id) {
                            const statusObj = status.find(s => s.status_id === s_id);
                            return {
                                ...patient,
                                status_id: s_id,
                                status_name: statusObj ? statusObj.status_name : patient.status_name,
                            };
                        }
                        return patient;
                    });

                        setPatientList(updatedList);
                        Swal.fire({
                            position: "center",
                            icon: "success",
                            title: "Status has been changed!",
                            showConfirmButton: false,
                            timer: 1100
                            });

                        })
                        .catch(err => {
                            if (err.response && (err.response.status === 401 || err.response.status === 403)) {
                                 Swal.fire({
                                                          icon: "error",
                                                          title: "Access Denied",
                                                          text: "Please login.",
                                                          confirmButtonColor: "#51A485",
                                                        });
                                navigate('/');
                            } else {
                                console.error("Unexpected error", err);
                            }
                        });
                        
                        }else{
                            Swal.fire({
                            position: "center",
                            icon: "error",
                            title: "Status has not been changed!",
                            showConfirmButton: false,
                            timer: 1100
                            });
                        }
    })
}

   
    function handleDelete(id){
        Swal.fire({
            title: "Are you sure about deleting this patient?",
            text: "You won't be able to revert anymore!",
            showCancelButton: true,
            confirmButtonColor: "#51A485",
            cancelButtonColor: "#d33",
            confirmButtonText: "Delete"
            }).then((result) => {
            if (result.isConfirmed) {
                Axios.put(`http://localhost:3001/patient/deletePatient/${id}`,{},{
                    withCredentials:true
                    })
                     .then(response=>{
                        const updatedList = patientList.filter(patient => patient.patient_id!==id);
                    setPatientList(updatedList);
                       Swal.fire({
                        position: "center",
                        icon: "success",
                        title: "Patient has been deleted!",
                        showConfirmButton: false,
                        timer: 1100
                        });
                 }).catch(err=>{
                         if (err.response && (err.response.status === 401 || err.response.status === 403)) {
                             Swal.fire({
                                                      icon: "error",
                                                      title: "Access Denied",
                                                      text: "Please login.",
                                                      confirmButtonColor: "#51A485",
                                                    });
                                navigate('/');
                            } else {
                                console.error("Unexpected error", err);
                            }
                })
                
            }
            });

    };

    function handleUpdate(id){
       navigate(`/updatePatient/${id}`);
    };
    const filteredPatients = patientList.filter((patient) =>
        `${patient.first_name} ${patient.last_name}`
            .toLowerCase()
            .includes(searchTerm.toLowerCase())
    );

    return(
        
        <div className="d-flex" style={{ minHeight: '100vh' }}>
        
            <Sidebar role='admin'/>
            <div className="container py-4 flex-grow-1">
                <h3 className="mb-3">Patients</h3>
                <div className="mb-3">
                <input
                    type="text"
                    className="form-control"
                    placeholder="Search by First Name or Last Name"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>
               <div className="table-responsive">
                 <table className="table table-bordered table-hover align-middle">
                    <thead>
                        <tr>
                        <th scope="col" style={{backgroundColor:"#51A485",color:"white"}}>Photo</th>
                        <th scope="col" style={{backgroundColor:"#51A485",color:"white"}}>ID</th>
                        <th scope="col" style={{backgroundColor:"#51A485",color:"white"}}>Firstname</th>
                        <th scope="col" style={{backgroundColor:"#51A485",color:"white"}}>Lastname</th>
                        <th scope="col" style={{backgroundColor:"#51A485",color:"white"}}>Email</th>
                        <th scope="col" style={{backgroundColor:"#51A485",color:"white"}}>Phone</th>
                        <th scope="col" style={{backgroundColor:"#51A485",color:"white"}}>Date of birth</th>
                        <th secope="col" style={{backgroundColor:"#51A485",color:"white"}}>Gender</th>
                        <th secope="col" style={{backgroundColor:"#51A485",color:"white",width:"100px"}}>Status</th>
                       <th secope="col" style={{backgroundColor:"#51A485",color:"white"}}>Edit Status</th>

                         <th secope="col" style={{backgroundColor:"#51A485",color:"white"}}>Update</th>
                        <th secope="col" style={{backgroundColor:"#51A485",color:"white"}}>Delete</th>


                        </tr>
                    </thead>
                    <tbody> 
                         {filteredPatients.length > 0 ? (
                                filteredPatients.map((value, key) => (
                        
                    
                        <tr key={value.patient_id}>
                         <td>
                            { value.image_path ? (<img src={`http://localhost:3001/uploads/`+value.image_path} style={{ width: "50px",
        height: "50px",
        borderRadius: "50%",
        objectFit: "cover"}}/>
                        ):(
                           <img src={'http://localhost:3001/uploads/1748263645152.png'} style={{width:"60px"}}/>
                           )}
                    
                
                            </td>
                        <td>{value.patient_id}</td>
                        <td>{value.first_name}</td>
                        <td>{value.last_name}</td>
                        <td>{value.email}</td>
                        <td>{value.phone}</td>
                        <td>{value.date_of_birth}</td>
                        <td>{value.gender_name ? value.gender_name : '--'}</td>
                        <td style={{ color: value.status_name.toLowerCase() === 'inactive' ? 'red' : 'green' }}>{value.status_name}</td>
                      <td>
                                
                                        <Button variant="secondary"   onClick={() => {
    const nextStatusId =
      value.status_name.toLowerCase() === "active"
        ? status.find((s) => s.status_name.toLowerCase() === "inactive")?.status_id
        : status.find((s) => s.status_name.toLowerCase() === "active")?.status_id;

    if (nextStatusId) {
      handleClick(value.patient_id, nextStatusId);
    }
  }}>{value.status_name}</Button>
                               
                        </td>
                        <td>
                            <Button variant="secondary" onClick={()=>{handleUpdate(value.patient_id)}}>Update</Button>
                        </td>
                        <td>
                            <Button variant="danger" onClick={()=>{handleDelete(value.patient_id)}}>Delete</Button>
                        </td>
                        </tr>
                       
                        )
                        )):(
                            <tr className="text-center">
                                <td colSpan="11">No patients found!</td>
                            </tr>
                        )
                            }
                 </tbody>
                </table>
                </div>
                </div>
        </div>  
    );
}

export default Patient;