import Sidebar from "../../Components/AdminSidebar";
import axios from "axios";
import { useState,useEffect } from "react";
import Button from "react-bootstrap/esm/Button";
import Swal from 'sweetalert2';
import {useForm} from "react-hook-form";
import {yupResolver} from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useNavigate } from "react-router-dom";





function UpdateData(){

  const navigate = useNavigate();


  useEffect(() => {
  axios
    .get(`http://localhost:3001/updateData`, {
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
        navigate('/login');
      }
    })
    .catch((err) => {
       if (err.response && (err.response.status === 401 || err.response.status === 403)) {
      
        navigate('/login');
      } else {
        console.error("Unexpected error", err);
      }
    });
}, []);
const [bookingDaysLimit, setBookingDaysLimit] = useState(30);

useEffect(() => {
  axios
    .get("http://localhost:3001/api/settings", { withCredentials: true })
    .then((res) => {
      if (res.data && res.data.booking_days_limit !== undefined && res.data.booking_days_limit !== null) {
        setBookingDaysLimit(Number(res.data.booking_days_limit)); 
      }
    })
    .catch((err) => console.error("Error fetching settings:", err));
}, []);

const handleSaveSettings = () => {
  Swal.fire({
    title: "Are you sure about updating settings?",
    showCancelButton: true,
    confirmButtonColor: "#51A485",
    cancelButtonColor: "#d33",
    confirmButtonText: "Save",
  }).then((result) => {
    if (!result.isConfirmed) return;

    axios
      .put(
        "http://localhost:3001/api/settings",
        { booking_days_limit: Number(bookingDaysLimit) || 0 },
        { withCredentials: true }
      )
      .then(() => {
        Swal.fire({
          position: "center",
          icon: "success",
          title: "Settings updated!",
          showConfirmButton: false,
          timer: 1100,
        });
      })
      .catch((err) => {
        if (err.response && (err.response.status === 401 || err.response.status === 403)) {
          Swal.fire({
            icon: "error",
            title: "Access Denied",
            text: "Please login.",
            confirmButtonColor: "#51A485",
          });
          navigate("/login");
          return;
        }

        console.error("Error updating settings:", err);
        const msg = err.response?.data?.error || err.message || "Could not update settings.";
        Swal.fire({
          icon: "error",
          title: "Error",
          text: msg,
        });
      });
  });
};


    const [blood,setBlood]=useState([]);
    const [role,setRole]=useState([]);
    const [gender,setGender]=useState([]);
    const [editingBlood, setEditingBlood] = useState({});
    const [editingGender, setEditingGender] = useState({});

   
    

  const {
  register: registerRole,
  handleSubmit: handleSubmitRole,
  formState: { errors: errorsRole },
  reset: resetRole,
  setValueRole,
  getValuesRole
} = useForm({
  resolver: yupResolver(yup.object().shape({
    role: yup.string().required("This field is required!"),
  })),
});
 useEffect(() => {
    if (role && role.role_name) {
      resetRole({
       role:role.role_name
      });
    }
  }, [role, resetRole]);

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
     axios.get("http://localhost:3001/api/gender").then((response)=>{
            setGender(response.data);
        }).catch((error)=>{
            console.log(error);
        })
      };
    
    useEffect(()=>{
       fetchGender();
    },[]);

    function fetchBlood(){
       axios.get("http://localhost:3001/api/blood").then((response)=>{
            setBlood(response.data);
        }).catch((error)=>{
            console.log(error);
        })
    }

    useEffect(()=>{
       fetchBlood();
    },[]);

     /* function fetchRoles(){
     axios.get("http://localhost:3001/api/roles").then((response)=>{
            console.log(response.data);
            setRole(response.data);
        }).catch((error)=>{
            console.log(error);
        })
      };
  useEffect(()=>{
        fetchRoles();
    },[]);*/


    function handleDeleteGender(id,nameData){
      
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
      
                axios.delete("http://localhost:3001/api/deleteDataGender",{ data: data ,
                            withCredentials: true
                        }).then((response)=>{
                          
                          Swal.fire({
                                                      position: "center",
                                                      icon: "success",
                                                      title: "Status has been changed!",
                                                      showConfirmButton: false,
                                                      timer: 1100
                                                      }); 
                                  fetchGender();
                                                          
                        }).catch((err)=>{
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
                  })
     };

function handleDeleteBlood(id,nameData){
      
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
      
                  axios.delete("http://localhost:3001/api/deleteDataBlood",{ data: data ,
                        withCredentials: true
                    }).then((response)=>{
                          
                          Swal.fire({
                                                      position: "center",
                                                      icon: "success",
                                                      title: "Status has been changed!",
                                                      showConfirmButton: false,
                                                      timer: 1100
                                                      }); 
                                  fetchBlood();
                                                          
                        }).catch((err)=>{
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
                  })
     };



    
     function handleEditBlood(id) {
        const updatedValue = editingBlood[id];
        if (!updatedValue || updatedValue.trim() === "") return;

        axios
          .put("http://localhost:3001/api/updateDataBlood", {
            id: id,
            newValue: updatedValue,
          },{
        withCredentials: true
    })
          .then(() => {
            Swal.fire({
              position: "center",
              icon: "success",
              title: "Blood updated successfully!",
              showConfirmButton: false,
              timer: 1100,
            });
            fetchBlood();
            setEditingBlood((prev) => {
              const updated = { ...prev };
              delete updated[id];
              return updated;
            });
          })
          .catch((err) =>{
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
          }
      )};

      function handleEditGender(id) {
        const updatedValue = editingGender[id];
        if (!updatedValue || updatedValue.trim() === "") return;

        axios
          .put("http://localhost:3001/api/updateDataGender", {
            id: id,
            newValue: updatedValue,
          },{
        withCredentials: true
    })
          .then(() => {
            Swal.fire({
              position: "center",
              icon: "success",
              title: "Gender updated successfully!",
              showConfirmButton: false,
              timer: 1100,
            });
            fetchGender();
            setEditingGender((prev) => {
              const updated = { ...prev };
              delete updated[id];
              return updated;
            });
          })
          .catch((err) =>{
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
      };




      /*function handleAddRole(event){
      
      Swal.fire({
            title: "Are you sure about adding?",
            showCancelButton: true,
            confirmButtonColor: "#51A485",
            cancelButtonColor: "#d33",
            confirmButtonText: "Add"
             }).then((result) => {
                if (result.isConfirmed) {
                    axios.post("http://localhost:3001/api/addRole",event,{
        withCredentials: true
    }).then((response)=>{
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
  }*/
    function handleAddGender(event){
       Swal.fire({
            title: "Are you sure about adding?",
            showCancelButton: true,
            confirmButtonColor: "#51A485",
            cancelButtonColor: "#d33",
            confirmButtonText: "Add"
             }).then((result) => {
                if (result.isConfirmed) {
                    axios.post("http://localhost:3001/api/addGender",event,{
        withCredentials: true
    }).then((response)=>{
                           Swal.fire({
                                 position: "center",
                                 icon: "success",
                                 title: "Gender is added!",
                                 showConfirmButton: false,
                                 timer: 1100
                                   });  
                          resetGender(); 
                          fetchGender();
                      }).catch((err)=>{
                          if (err.response && (err.response.status === 401 || err.response.status === 403)) {
                             Swal.fire({
                                                      icon: "error",
                                                      title: "Access Denied",
                                                      text: "Please login.",
                                                      confirmButtonColor: "#51A485",
                                                    });
                              navigate('/');
                            } else {
                              Swal.fire({
                                                      icon: "error",
                                                      title: "",
                                                      text: "Gender not added.Please check again!.",
                                                      confirmButtonColor: "#51A485",
                                                    });
                             resetGender(); 

                            }
                      })
                    }
                  })
    };

    function handleAddBlood(event){
      Swal.fire({
            title: "Are you sure about adding?",
            showCancelButton: true,
            confirmButtonColor: "#51A485",
            cancelButtonColor: "#d33",
            confirmButtonText: "Add"
             }).then((result) => {
                if (result.isConfirmed) {
                    axios.post("http://localhost:3001/api/addBlood",event,{
        withCredentials: true
    }).then((response)=>{
                         Swal.fire({
                                 position: "center",
                                 icon: "success",
                                 title: "Blood is added!",
                                 showConfirmButton: false,
                                 timer: 1100
                                   }); 
                                   resetBlood(); 
                                   fetchBlood();
                      }).catch((err)=>{
                          if (err.response && (err.response.status === 401 || err.response.status === 403)) {
                             Swal.fire({
                                                      icon: "error",
                                                      title: "Access Denied",
                                                      text: "Please login.",
                                                      confirmButtonColor: "#51A485",
                                                    });
                              navigate('/');
                            } else {
                               Swal.fire({
                                                      icon: "error",
                                                      title: "",
                                                      text: "Blood not added.Please check again!.",
                                                      confirmButtonColor: "#51A485",
                                                    });
                              resetBlood();
                            }
                      })
                    }
                  })
                  
    }
    return(
        <div className="d-flex" style={{ minHeight: "100vh" }}>
      <Sidebar role="admin" />
      <div className="container py-4 flex-grow-1">
      
       
      <div className="container mt-4">
      <label>Add Gender:</label>
      <form className="d-flex" onSubmit={handleSubmitGender(handleAddGender)} >
        
        <input
          type="text"
          className="form-control me-2"
          placeholder="Enter gender"
          aria-label="Text input"
          name='gender'
          {...registerGender("gender")}
          
        />
        <p style={{color:"red"}}>{errorsGender.gender?.message}</p>
        
          <button type="submit" style={{backgroundColor:"#51A485",borderColor:"white",height:"50px",color:"white",borderRadius:"7px"}}>Add</button>

      </form>
    </div>
    <div className="table-responsive" style={{marginTop:"10px"}}>
          <table className="table table-bordered table-hover align-middle" style={{minWidth:"700px"}}>
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
                        <tr key={key}>
                    <td>{value.gender_name}</td>
                    <td>
                       <form className="d-flex">
                             <input
                             key={value.gender_id + "-" + value.gender_name}
                                type="text"
                                className="form-control me-2"
                                aria-label="Text input"
                                name='gender'
                                value={editingGender[value.gender_id] ?? value.gender_name}
                                onChange={(e) =>
                                  setEditingGender((prev) => ({
                                    ...prev,
                                    [value.gender_id]: e.target.value,
                                  }))
                                }                                
                            
                              />
                       <Button className="btn btn-secondary" onClick={()=>{handleEditGender(value.gender_id)}}>Update</Button>
                      </form>
                    </td>
                    <td>
                        <Button variant="danger" onClick={()=>{handleDeleteGender(value.gender_id,value.gender_name)}}>Delete</Button>

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
          placeholder="Enter Blood"
          aria-label="Text input"
          name='blood'
          {...registerBlood("blood")}
          
        />
        <p style={{color:"red"}}>{errorsBlood.blood?.message}</p>
        
          <button type="submit" style={{backgroundColor:"#51A485",borderColor:"white",height:"50px",color:"white",borderRadius:"7px"}}>Add</button>
      </form>
    </div>
        <div className="table-responsive" style={{marginTop:"10px"}}>
          <table className="table table-bordered table-hover align-middle" style={{minWidth:"700px"}}>
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
                                aria-label="Text input"
                                name='blood'
                                value={editingBlood[value.blood_id] ?? value.blood_type}
                                onChange={(e) =>
                                  setEditingBlood((prev) => ({
                                    ...prev,
                                    [value.blood_id]: e.target.value,
                                  }))
                                }
                            
                              />
                       <Button className="btn btn-secondary" onClick={()=>{handleEditBlood(value.blood_id)}}>Update</Button>
                      </form>
                    </td>
                    <td>
                        <Button variant="danger" onClick={()=>{handleDeleteBlood(value.blood_id,value.blood_type)}}>Delete</Button>

                    </td>
                    </tr>
                    )
                })}
            </tbody>
          </table>
        </div>
    <div className="container mt-4">
      <label>Booking Days Limit:</label>
      <div className="d-flex">
     <input
  type="number"
  className="form-control me-2"
  value={bookingDaysLimit}
  onChange={(e) => setBookingDaysLimit(e.target.value)}
  min={0}
/>
        <Button
          style={{ backgroundColor: "#51A485", borderColor: "white" }}
          onClick={handleSaveSettings}
        >
          Save
        </Button>
      </div>
    </div>

      </div>
    </div>
    )
}

export default UpdateData;