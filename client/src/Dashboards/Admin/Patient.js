import { useState } from "react";
import { useEffect } from "react";
import Axios from "axios";
import Sidebar from "../../Components/AdminSidebar";
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
    

    return(
        <>
        <div  style={{float:"left"}}>
        <Sidebar role='admin'/>
        </div>
            <div className="flex-grow-1 p-4">
            <div style={{display:"flex",justifyContent:"center"}}>
                <h1>Patient</h1>
            </div>
            <div style={{display:"flex",padding:"50px",flex:"shrink"}}>
            <table className="table table-striped">
                <thead>
                    <tr>
                    <th scope="col" style={{backgroundColor:"#51A485",color:"white"}}>ID</th>
                    <th scope="col" style={{backgroundColor:"#51A485",color:"white"}}>Firstname</th>
                    <th scope="col" style={{backgroundColor:"#51A485",color:"white"}}>Lastname</th>
                    <th scope="col" style={{backgroundColor:"#51A485",color:"white"}}>Email</th>
                    <th secope="col" style={{backgroundColor:"#51A485",color:"white"}}>Phone</th>
                    <th scope="col" style={{backgroundColor:"#51A485",color:"white"}}>Birthday</th>
                    <th secope="col" style={{backgroundColor:"#51A485",color:"white"}}>Gender</th>
                    <th secope="col" style={{backgroundColor:"#51A485",color:"white"}}>Status</th>
                    <th secope="col" style={{backgroundColor:"#51A485",color:"white"}}>Edit Status</th>

                    </tr>
                </thead>
                {patientList.map((value,key)=>{
                    return(
                <tbody> 
                    <tr>
                    <th scope="row">{value.patient_id}</th>
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
                                    <button onClick={() => handleClick(val.status_id,value.patient_id)}>{val.status_name}</button>
                               )
                            })}
                    </td>
                    </tr>
                    </tbody>
                    )
                     })
                        }
               
            </table>
            </div>
            </div>
        </>
    )
}

export default Patient;