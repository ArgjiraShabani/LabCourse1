import { useState,useEffect } from "react";
import Sidebar from "../../Components/AdminSidebar";
import Modal from "./Modal";
import axios from "axios";
import { FaRegEdit } from "react-icons/fa";
import { GoTrash } from "react-icons/go";
import Swal from "sweetalert2";
import withReactContent from 'sweetalert2-react-content';
import { useNavigate } from "react-router-dom";

function MedicalRecords(){

    const [openModal,setOpenModal] = useState(false);

    const [patientList,setPatientList]=useState([]);
    const [selectedPatient,setSelectedPatient]=useState(null); 

    const [modalFormData,setModalFormData]=useState({});
    const [modalFile,setModalFile]=useState(null);
    const [submittedPrescription,setSubmittedPrescription]=useState({});
    const [isEditing, SetIsEditing]=useState(false);
    const swal=withReactContent(Swal);

    
    const navigate=useNavigate();

   const checkAuth = async () => {
  try {
    await axios.get("http://localhost:3001/api/checkAuth", {
      withCredentials: true,
    });
    return true;
  } catch (err) {
    if (err.response && (err.response.status === 401 || err.response.status === 403)) {
      navigate("/login");
    } else {
      console.error("Unexpected error checking auth", err);
    }
    return false;
  }
}; 

 useEffect(() => {
  axios
    .get("http://localhost:3001/api/medRecords", { withCredentials: true })
    .then((res) => {
      if (res.data.user?.role !== "doctor") {
        Swal.fire({
          icon: "error",
          title: "Access Denied",
          text: "Only doctors can access this page.",
        });
        navigate("/login");
      }
    })
    .catch((err) => {
      if (err.response && (err.response.status === 401 || err.response.status === 403)) {
       
        navigate("/login");
      } else {
        console.error("Unexpected error", err);
      }
    });
}, [navigate]);

    const confirmDeletion=(resultId)=>{
        swal.fire({
             title: "Are you sure you want to delete the medical report?",
            text: "This action cannot be undone!",
            icon : "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, delete it!",
            cancelButtonText: "Cancel"
        }).then((result)=>{
            if(result.isConfirmed){
                deleteReport(resultId);
            }
        });
    }
    const fetchAppointments=()=>{
        axios.get(`http://localhost:3001/api/appointments`, {
          withCredentials: true
        }).then((response)=>{
          console.log("appointments response:", response.data);
         setPatientList(response.data.patients);

         const submitted={};
         response.data.patients.forEach(p=>{
          if(p.hasPrescription){
            submitted[`${p.patient_id}_${p.appointment_id}`]=true;

          }

         });
         setSubmittedPrescription(submitted);
      })
               .catch((err)=>{
             if (err.response && (err.response.status === 401 || err.response.status === 403)) {
                   
                    navigate('/login');
                } else {
                    console.error("Error fetching the appointments", err);
                }
          
        });

    }

   
    useEffect(()=>{
      fetchAppointments();   
      

    },[]);
    const deleteReport=(resultId)=>{
      axios.delete(`http://localhost:3001/api/deleteReports/${resultId}`,{withCredentials: true})
      .then(()=>{
        
        swal.fire('Deleted!','Report has been deleted.','success');
        fetchAppointments();

      })
              .catch((err)=>{
             if (err.response && (err.response.status === 401 || err.response.status === 403)) {
                   
                    navigate('/login');
                } else {
                    swal.fire("Error deleting the doctor");
                }
          
        });

    }

    const openEditModal=async (p)=>{
      const isAuthenticated = await checkAuth();
     if (!isAuthenticated) return;
      setSelectedPatient({
        patient_id: p.patient_id,
        appointment_id: p.appointment_id,
        result_id: p.result_id
      });
      setModalFile(null);
      setModalFormData({});
      SetIsEditing(true);
      setOpenModal(true);
    }
    

    return(
       <>
       <div style={{display: "flex",minHeight: "100vh"}}>
      <div style={{width: "250px"}}>
                <Sidebar role="doctor"/>
        </div>
        <div style={{ flex: 1, padding: "2rem" }}>
          <div  style={{maxWidth: '800px',
      margin: '0 auto',
      backgroundColor: '#fff',
      
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
      overflowX: 'auto'}}>
          <table style={{
            width: '100%',
            borderCollapse: 'collapse',
            fontSize: '1rem',
              
               }}>
                <thead style={{backgroundColor: '#51A485',color: '#fff'}}>
                  <tr>
                    <th style={{ padding: '12px 15px', textAlign: 'left' }}>Patient Id</th>
                    <th style={{ padding: '12px 15px', textAlign: 'left' }}>First Name</th>
                    <th style={{ padding: '12px 15px', textAlign: 'left' }}>LastName</th>
                    <th style={{ padding: '12px 15px', textAlign: 'left' }}>Prescription</th>
                  </tr>
                </thead>
                <tbody>
                  {patientList.length===0?(
                    <td colSpan="9" style={{ textAlign: "center", padding: "15px", color: "#888" }}>
        No prescriptions found.
      </td>
                  ):(
                  patientList.map((p)=>(
                    <tr key={`${p.patient_id}_${p.appointment_id}`} style={{ borderBottom: '1px solid #dddddd' }}>
                      
                      <td style={{ padding: '12px 15px' }}>{p.patient_id}</td>
                      <td style={{ padding: '12px 15px' }}>{p.first_name}</td>
                      <td style={{ padding: '12px 15px' }}>{p.last_name}</td>
                      
                      <td style={{ padding: '12px 15px' }}><button   style={{
                                                padding: '8px 16px',
                                                backgroundColor: submittedPrescription[`${p.patient_id}_${p.appointment_id}`]
                                                ? '#51A485': '#15825aff' ,
                                                color: '#fff',
                                                border: 'none',
                                                borderRadius: '4px',
                                                cursor: 'pointer',
                                                fontSize: '14px',
                                                transition: 'background-color 0.3s',
                                            }} onClick={async ()=>{
                                              const isAuthenticated=await checkAuth();
                                              if(!isAuthenticated) return;
                                              setSelectedPatient({
                                                patient_id: p.patient_id,
                                                appointment_id: p.appointment_id,
                                                result_id: p.result_id || null
                                              });
                                              
                                              setModalFile(null);
                                              SetIsEditing(false);
                                              
                                              setOpenModal(true);
       }}>{submittedPrescription[`${p.patient_id}_${p.appointment_id}`]? 'View prescription':'Write prescription'}</button></td>
       <td> <button
    onClick={() => openEditModal(p)}
    disabled={!submittedPrescription[`${p.patient_id}_${p.appointment_id}`]}
    style={{
      background: 'none',
      border: 'none',
      padding: 0,
      cursor: submittedPrescription[`${p.patient_id}_${p.appointment_id}`] ? 'pointer' : 'not-allowed',
      opacity: submittedPrescription[`${p.patient_id}_${p.appointment_id}`] ? 1 : 0.5,
    }}
    title={submittedPrescription[`${p.patient_id}_${p.appointment_id}`] ? "Update" : "Disabled until prescription is submitted"}
  >
                   <FaRegEdit size={18} color="#51A485" title="Update"/></button>
                   
               </td>
               
             
               
               <td>
                <button
    onClick={() => confirmDeletion(p.result_id)}
    disabled={!submittedPrescription[`${p.patient_id}_${p.appointment_id}`]}
    style={{
      background: 'none',
      border: 'none',
      padding: 0,
      cursor: submittedPrescription[`${p.patient_id}_${p.appointment_id}`] ? 'pointer' : 'not-allowed',
      opacity: submittedPrescription[`${p.patient_id}_${p.appointment_id}`] ? 1 : 0.5,
    }}
    title={submittedPrescription[`${p.patient_id}_${p.appointment_id}`] ? "Delete" : "Disabled until prescription is submitted"}
  ><GoTrash size={18} color="#51A485" title="Delete"/></button>
                </td>
      
       
                    </tr>

                  )))}

                </tbody>

               </table>
               </div>
       
       {openModal && selectedPatient && (
         <Modal closeModal={()=>setOpenModal(false)} 
         patient_id={selectedPatient.patient_id} 
       appointment_id={selectedPatient.appointment_id}
       result_id={selectedPatient.result_id}
       isEditing={isEditing}
        
        
        file={modalFile}
        setFile={setModalFile}
        readOnly={!isEditing && submittedPrescription[`${selectedPatient.patient_id}_${selectedPatient.appointment_id}`]}
        onSubmitSuccess={(patient_id, appointment_id)=>{
          setSubmittedPrescription((prev)=>({...prev,[`${selectedPatient.patient_id}_${selectedPatient.appointment_id}`]:true}));
          fetchAppointments();
         /* setSubmittedPrescription((prev)=>({...prev,[`${selectedPatient.patient_id}_${selectedPatient.appointment_id}`]:true}));
          axios.get(`http://localhost:3001/api/getReports/${patient_id}/${appointment_id}`,{
            withCredentials: true
          })
          .then(response=>{
            const report=response.data.report;
            setModalFormData({
                        first_name: response.data.first_name,
                        last_name: response.data.last_name,
                        symptoms: response.data.symptoms,
                        diagnose: response.data.diagnose,
                        alergies: response.data.alergies,
                        result_text: response.data.result_text,

            })
          })
          .catch(err=>console.error("Failed to refetch after submit.", err));*/
        }
        }
        />)}
        </div>
        </div>

       </>
    );

}
export default MedicalRecords;