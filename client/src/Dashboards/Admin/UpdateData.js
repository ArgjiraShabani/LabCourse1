import Sidebar from "../../Components/AdminSidebar";
import axios from "axios";
import { useState,useEffect } from "react";
import Button from "react-bootstrap/esm/Button";
import Swal from 'sweetalert2';
import {useForm} from "react-hook-form";
import {yupResolver} from "@hookform/resolvers/yup";
import * as yup from "yup";





function UpdateData(){

    const [blood,setBlood]=useState([]);
    const [role,setRole]=useState([]);
    const [gender,setGender]=useState([]);
    

    const {
  register: registerRole,
  handleSubmit: handleSubmitRole,
  formState: { errors: errorsRole },
  reset: resetRole,
  setValue,
} = useForm({
  resolver: yupResolver(yup.object().shape({
    role: yup.string().required("This field is required!"),
  })),
});

const {
  register: registerGender,
  handleSubmit: handleSubmitGender,
  formState: { errors: errorsGender },
  reset: resetGender,
} = useForm({
  resolver: yupResolver(yup.object().shape({
    gender: yup.string().required("This field is required!"),
  })),
});

const {
  register: registerBlood,
  handleSubmit: handleSubmitBlood,
  formState: { errors: errorsBlood },
  reset: resetBlood,
} = useForm({
  resolver: yupResolver(yup.object().shape({
    blood: yup.string().required("This field is required!"),
  })),
});

  function fetchGender(){
     axios.get("http://localhost:3001/gender").then((response)=>{
            setGender(response.data);
        }).catch((error)=>{
            console.log(error);
        })
      };
    
    useEffect(()=>{
       fetchGender();
    },[]);

    function fetchBlood(){
       axios.get("http://localhost:3001/blood").then((response)=>{
            setBlood(response.data);
        }).catch((error)=>{
            console.log(error);
        })
    }

    useEffect(()=>{
       fetchBlood();
    },[]);

   function fetchRoles(){
     axios.get("http://localhost:3001/roles").then((response)=>{
            console.log(response.data);
            setRole(response.data);
        }).catch((error)=>{
            console.log(error);
        })
      };
  useEffect(()=>{
        fetchRoles();
    },[]);


    function handleDelete(id,nameData){
      
      const data={
        id:id,
        nameData:nameData
      }
       Swal.fire({
            title: "Are you sure about deleting?",
            showCancelButton: true,
            confirmButtonColor: "#51A485",
            cancelButtonColor: "#d33",
            confirmButtonText: "Delete"
             }).then((result) => {
                if (result.isConfirmed) {
      
                        axios.delete("http://localhost:3001/deleteData",{ data: data }).then((response)=>{
                          
                          Swal.fire({
                                                      position: "center",
                                                      icon: "success",
                                                      title: "Status has been changed!",
                                                      showConfirmButton: false,
                                                      timer: 1100
                                                      }); 
                                  fetchBlood();
                                  fetchGender();
                                  fetchRoles();                         
                        }).catch((error)=>{
                          console.log(error);
                        })
                  }
                  })
     }


    function handleEditRole(id,name){
    

    } 

    function handleEdit(){

    }


    function handleAddRole(event){
      
      Swal.fire({
            title: "Are you sure about adding?",
            showCancelButton: true,
            confirmButtonColor: "#51A485",
            cancelButtonColor: "#d33",
            confirmButtonText: "Add"
             }).then((result) => {
                if (result.isConfirmed) {
                    axios.post("http://localhost:3001/addRole",event).then((response)=>{
                           Swal.fire({
                                 position: "center",
                                 icon: "success",
                                 title: "Role is added!",
                                 showConfirmButton: false,
                                 timer: 1100
                                   });   

                                   resetRole();
                                   fetchRoles();
                      }).catch((error)=>{
                          console.log(error);
                      })
                }
    })
  }
    function handleAddGender(event){
       Swal.fire({
            title: "Are you sure about adding?",
            showCancelButton: true,
            confirmButtonColor: "#51A485",
            cancelButtonColor: "#d33",
            confirmButtonText: "Add"
             }).then((result) => {
                if (result.isConfirmed) {
                    axios.post("http://localhost:3001/addGender",event).then((response)=>{
                           Swal.fire({
                                 position: "center",
                                 icon: "success",
                                 title: "Gender is added!",
                                 showConfirmButton: false,
                                 timer: 1100
                                   });  
                          resetGender(); 
                          fetchGender();
                      }).catch((error)=>{
                          console.log(error);
                      })
                    }
                  })
    }
    function handleAddBlood(event){
      Swal.fire({
            title: "Are you sure about adding?",
            showCancelButton: true,
            confirmButtonColor: "#51A485",
            cancelButtonColor: "#d33",
            confirmButtonText: "Add"
             }).then((result) => {
                if (result.isConfirmed) {
                    axios.post("http://localhost:3001/addBlood",event).then((response)=>{
                         Swal.fire({
                                 position: "center",
                                 icon: "success",
                                 title: "Blood is added!",
                                 showConfirmButton: false,
                                 timer: 1100
                                   }); 
                                   resetBlood(); 
                                   fetchBlood();
                      }).catch((error)=>{
                          console.log(error);
                      })
                    }
                  })
                  
    }
    return(
        <div className="d-flex" style={{ minHeight: "100vh" }}>
      <Sidebar role="admin" />
      <div className="container py-4 flex-grow-1">
      
 <div className="container mt-4">
      <label>Add Role:</label>
      <form className="d-flex" onSubmit={handleSubmitRole(handleAddRole)}>
      
        <input
          type="text"
          name='role'
          placeholder="Enter text"
          className="form-control me-2"
         {...registerRole("role")}
        />
                <p style={{color:"red"}}>{errorsRole.role?.message}</p>

          <button type="submit" style={{backgroundColor:"#51A485",borderColor:"white",height:"50px",color:"white",borderRadius:"7px"}}>Add</button>

      </form>
    </div>
        <div className="table-responsive" style={{marginTop:"10px"}}>
          <table className="table table-bordered table-hover align-middle">
            <thead className="table-light">
              <tr>
                <th style={{backgroundColor:"#51A485",color:"white"}}>Role</th>
                <th style={{backgroundColor:"#51A485",color:"white"}}>Update</th>
                <th style={{backgroundColor:"#51A485",color:"white"}}>Delete</th>
              </tr>
            </thead>
            <tbody>
              {role.map((value,key)=>{
                    return(
                        <tr>
                    <td>{value.role_name}</td>
                    <td>
                       <form className="d-flex">
                             <input
                                type="text"
                                className="form-control me-2"
                                name='role'
                                placeholder="Enter text"                                
                            
                              />
                       <Button className="btn btn-secondary" onClick={()=>{handleEditRole(value.role_id,value.role_name)}}>Update</Button>
                      </form>
                    </td>
                    <td>
                        <Button variant="danger" onClick={()=>{handleDelete(value.role_id,value.role_name)}}>Delete</Button>

                    </td>
                    </tr>

                    )
                })}
            </tbody>
          </table>
        </div>
      <div className="container mt-4">
      <label>Add Gender:</label>
      <form className="d-flex" onSubmit={handleSubmitGender(handleAddGender)} >
        
        <input
          type="text"
          className="form-control me-2"
          placeholder="Enter text"
          aria-label="Text input"
          name='gender'
          {...registerGender("gender")}
          
        />
        <p style={{color:"red"}}>{errorsGender.gender?.message}</p>
        
          <button type="submit" style={{backgroundColor:"#51A485",borderColor:"white",height:"50px",color:"white",borderRadius:"7px"}}>Add</button>

      </form>
    </div>
    <div className="table-responsive" style={{marginTop:"10px"}}>
          <table className="table table-bordered table-hover align-middle">
            <thead className="table-light">
              <tr>
                <th style={{backgroundColor:"#51A485",color:"white"}}>Gender</th>
                <th style={{backgroundColor:"#51A485",color:"white"}}>Update</th>
                <th style={{backgroundColor:"#51A485",color:"white"}}>Delete</th>
              </tr>
            </thead>
            <tbody>
                {gender.map((value,key)=>{
                    return(
                        <tr>
                    <td>{value.gender_name}</td>
                    <td>
                       <form className="d-flex">
                             <input
                                type="text"
                                className="form-control me-2"
                                placeholder="Enter text"
                                aria-label="Text input"
                                name='blood'
                                
                            
                              />
                       <Button className="btn btn-secondary" onClick={()=>{handleEdit(value.gender_id,value.gender_name)}}>Update</Button>
                      </form>
                    </td>
                    <td>
                        <Button variant="danger" onClick={()=>{handleDelete(value.gender_id,value.gender_name)}}>Delete</Button>

                    </td>
                    </tr>
                    )
                })}
             
            </tbody>
          </table>
      </div>
       <div className="container mt-4">
      <label>Add Blood:</label>
      <form className="d-flex" onSubmit={handleSubmitBlood(handleAddBlood)}>
        
        <input
          type="text"
          className="form-control me-2"
          placeholder="Enter text"
          aria-label="Text input"
          name='blood'
          {...registerBlood("blood")}
          
        />
        <p style={{color:"red"}}>{errorsBlood.blood?.message}</p>
        
          <button type="submit" style={{backgroundColor:"#51A485",borderColor:"white",height:"50px",color:"white",borderRadius:"7px"}}>Add</button>
      </form>
    </div>
        <div className="table-responsive" style={{marginTop:"10px"}}>
          <table className="table table-bordered table-hover align-middle">
            <thead className="table-light">
              <tr>
                <th style={{backgroundColor:"#51A485",color:"white"}}>Blood</th>
                <th style={{backgroundColor:"#51A485",color:"white"}}>Update</th>
                <th style={{backgroundColor:"#51A485",color:"white"}}>Delete</th>
              </tr>
            </thead>
            <tbody>
             {blood.map((value,key)=>{
                    return(
                        <tr>
                    <td>{value.blood_type}</td>
                    <td>
                      <form className="d-flex">
                             <input
                                type="text"
                                className="form-control me-2"
                                placeholder="Enter text"
                                aria-label="Text input"
                                name='blood'
                                
                            
                              />
                       <Button className="btn btn-secondary" onClick={()=>{handleEdit(value.blood_id,value.blood_type)}}>Update</Button>
                      </form>
                    </td>
                    <td>
                        <Button variant="danger" onClick={()=>{handleDelete(value.blood_id,value.blood_type)}}>Delete</Button>

                    </td>
                    </tr>
                    )
                })}
            </tbody>
          </table>
        </div>
        
      </div>
    </div>
    )
}

export default UpdateData;