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
            setPatientList(response.data);
        })
    },[patientList]);

    useEffect(()=>{
        Axios.get("http://localhost:3001/status").then((response)=>{
            setStatus(response.data);
        })
    },[]);


    function handleClick(s_id,id){
        Axios.put("http://localhost:3001/updateStatus",{status:s_id,id:id}).then(response=>{
            console.log("Success:", response.data);
        })
        .catch(error => {
            console.error("Error:", error);
          });
        }
    function handleDelete(id){
        Swal.fire({
            title: "Are you sure about deleting this patient?",
            text: "You won't be able to revert anymore!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#51A485",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, delete it!"
            }).then((result) => {
            if (result.isConfirmed) {
                Axios.delete(`http://localhost:3001/deletePatient/${id}`)
                     .then(response=>{
                        console.log(response.data)
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
                <div  style={{display:'flex',flexWrap:"wrap",marginTop:"50px"}}>
                  <table className="table table-striped">
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
                        <th scope="row"><img src={`http://localhost:3001/uploads/`+value.image_path} style={{width:"70px"}}/></th>
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