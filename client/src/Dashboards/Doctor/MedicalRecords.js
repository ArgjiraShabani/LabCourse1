import { useState,useEffect } from "react";
import Sidebar from "../../Components/AdminSidebar";
import Modal from "./Modal";
import axios from "axios";

function MedicalRecords(){

    const [openModal,setOpenModal] = useState(false);

    const [patientList,setPatientList]=useState([]);
    const [selectedPatient,setSelectedPatient]=useState(null); 

    const [modalFormData,setModalFormData]=useState({});
    const [modalFile,setModalFile]=useState(null);
    const [submittedPrescription,setSubmittedPrescription]=useState({});

   
    useEffect(()=>{
      

      
        axios.get(`http://localhost:3001/api/appointments`, {
          withCredentials: true
        }).then((response)=>{
         setPatientList(response.data.patients);

         const submitted={};
         response.data.patients.forEach(p=>{
          if(p.hasPrescription){
            submitted[p.patient_id]=true;

          }

         });
         setSubmittedPrescription(submitted);
      })
      .catch((error)=>{
        console.error("Error fetching appointments:",error);
      })

      
      
      

    },[]);
    

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
                  {patientList.map((p)=>(
                    <tr key={p.patient_id} style={{ borderBottom: '1px solid #dddddd' }}>
                      <td style={{ padding: '12px 15px' }}>{p.patient_id}</td>
                      <td style={{ padding: '12px 15px' }}>{p.first_name}</td>
                      <td style={{ padding: '12px 15px' }}>{p.last_name}</td>
                      <td style={{ padding: '12px 15px' }}><button   style={{
                                                padding: '8px 16px',
                                                backgroundColor: '#51A485',
                                                color: '#fff',
                                                border: 'none',
                                                borderRadius: '4px',
                                                cursor: 'pointer',
                                                fontSize: '14px',
                                                transition: 'background-color 0.3s',
                                            }} onClick={()=>{
                                              setSelectedPatient({
                                                patient_id: p.patient_id,
                                                appointment_id: p.appointment_id
                                              });
                                              
        setOpenModal(true);
       }}>{submittedPrescription[p.patient_id]? 'View prescription':'Write prescription'}</button></td>
                    </tr>
                  ))}

                </tbody>

               </table>
               </div>
       
       {openModal && selectedPatient && (
         <Modal closeModal={()=>setOpenModal(false)} 
         patient_id={selectedPatient.patient_id} 
       appointment_id={selectedPatient.appointment_id}
        doctor_id={localStorage.getItem("doctor_id")}
        formData={modalFormData}
        setFormData={setModalFormData}
        file={modalFile}
        setFile={setModalFile}
        readOnly={submittedPrescription[selectedPatient.patient_id]}
        onSubmitSuccess={(patient_id)=>{
          setSubmittedPrescription((prev)=>({...prev,[patient_id]:true}));
        }
        }
        />)}
        </div>
        </div>

       </>
    );

}
export default MedicalRecords;