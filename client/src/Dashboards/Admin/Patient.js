import { useState } from "react";
import { useEffect } from "react";
import Axios from "axios";
import Sidebar from "../../Components/AdminSidebar";
function Patient(){

    const [patientList,setPatientList]=useState([]);

    useEffect(()=>{
        Axios.get("http://localhost:3001/patient").then((response)=>{
            setPatientList(response.data);
        })
    },[patientList]);

    function handleDelete(id){
        console.log(id)
        Axios.delete(`http://localhost:3001/deletePatient/${id}`).then((response)=>{
            console.log("Deleted successfully");
        }).catch((error)=>{
            console.log("Error deleting!");

        })
    };

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
                    <th secope="col" style={{backgroundColor:"#51A485",color:"white"}}>Edit/Delete</th>
                    </tr>
                </thead>
                {patientList.map((value,key)=>{
                    return(
                <tbody> 
                    <tr>
                    <th scope="row">{value.user_id}</th>
                    <td>{value.first_name}</td>
                    <td>{value.last_name}</td>
                    <td>{value.email}</td>
                    <td>{value.phone}</td>
                    <td>{value.date_of_birth}</td>
                    <td>{value.gender_name}</td>
                    <td>
                        <button>Edit</button>
                        <button onClick={()=> handleDelete(value.user_id)}>Delete</button>
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