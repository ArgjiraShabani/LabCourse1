import { useState } from "react";
import { useEffect } from "react";
import Axios from "axios";
import Sidebar from "../../Components/AdminSidebar";
import Swal from 'sweetalert2';
import Button from 'react-bootstrap/Button';


function Patient(){

    const [patientList,setPatientList]=useState([]);
    const[status,setStatus]=useState([]);

    useEffect(()=>{
        Axios.get("http://localhost:3001/patient").then((response)=>{
              const updatedPatients = response.data.map(patient => {
                if (patient.date_of_birth) {
                    patient.date_of_birth = patient.date_of_birth.split("T")[0]; // Fix the date format
                }
                return patient;
            });
            setPatientList(updatedPatients);
        }) .catch((error) => {
            console.error("Error fetching patient list:", error);
        });
    },[]);
       

    useEffect(()=>{
        Axios.get("http://localhost:3001/status").then((response)=>{
            setStatus(response.data);
        })
    },[]);


    function handleClick(s_id,id){
        Axios.put("http://localhost:3001/updateStatus",{status:s_id,id:id}).then(response=>{
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
        })
        .catch(error => {
            console.error("Error:", error);
          });
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
                Axios.delete(`http://localhost:3001/deletePatient/${id}`)
                     .then(response=>{
                        const updatedList = patientList.filter(patient => patient.patient_id !== id);
                    setPatientList(updatedList);
                         })
                     .catch(error=>{
                         console.error('Not deleted!')
                    })
                
                Swal.fire({
                position: "center",
                icon: "success",
                title: "Patient has been deleted!",
                showConfirmButton: false,
                timer: 1100
                });
            }
            });

    }

    return(
        <>
        <div className="d-flex" style={{ minHeight: '100vh' }}>
        
            <Sidebar role='admin'/>
        
            <div className="flex-grow-1 p-4">
                <h1>Patient</h1>
                <div className="table-responsive">
                  <table className="table table-bordered table-hover align-middle text-center">
                    <thead>
                        <tr>
                        <th scope="col" style={{backgroundColor:"#51A485",color:"white"}}>Photo</th>
                        <th scope="col" style={{backgroundColor:"#51A485",color:"white"}}>ID</th>
                        <th scope="col" style={{backgroundColor:"#51A485",color:"white"}}>Firstname</th>
                        <th scope="col" style={{backgroundColor:"#51A485",color:"white"}}>Lastname</th>
                        <th scope="col" style={{backgroundColor:"#51A485",color:"white"}}>Email</th>
                        <th secope="col" style={{backgroundColor:"#51A485",color:"white"}}>Phone</th>
                        <th scope="col" style={{backgroundColor:"#51A485",color:"white"}}>Birthday</th>
                        <th secope="col" style={{backgroundColor:"#51A485",color:"white"}}>Gender</th>
                        <th secope="col" style={{backgroundColor:"#51A485",color:"white"}}>Status</th>
                        <th secope="col" style={{backgroundColor:"#51A485",color:"white"}}>Edit Status</th>
                        <th secope="col" style={{backgroundColor:"#51A485",color:"white"}}>Delete</th>


                        </tr>
                    </thead>
                    {patientList.map((value,key)=>{
                        return(
                    <tbody> 
                        <tr>
                         <th scope="row">
                            { value.image_path ? (<img src={`http://localhost:3001/uploads/`+value.image_path} style={{width:"60px"}}/>
                        ):(
                           <img src={'http://localhost:3001/uploads/1746947791225.png'} style={{width:"60px"}}/>)}
                    
                
                            </th>
                        <td>{value.patient_id}</td>
                        <td>{value.first_name}</td>
                        <td>{value.last_name}</td>
                        <td>{value.email}</td>
                        <td>{value.phone}</td>
                        <td>{value.date_of_birth}</td>
                        <td>{value.gender_name}</td>
                        <td>{value.status_name}</td>
                        <td>
                            {status.map((val,key)=>{
                                return(
                                        <Button variant="secondary" onClick={() => handleClick(val.status_id,value.patient_id)}>{val.status_name}</Button>
                                )
                                })}
                        </td>
                        <td>
                            <Button variant="danger" onClick={()=>{handleDelete(value.patient_id)}}>Delete</Button>
                        </td>
                        </tr>
                        </tbody>
                        )
                        })
                            }
                
                </table>
                </div>
                </div>
                </div>
        


        </>
    )
}

export default Patient;