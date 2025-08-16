import { IoCloseSharp } from "react-icons/io5";
import { useEffect, useState} from "react";

import axios from "axios";
function Modal({closeModal,patient_id,appointment_id,file,setFile,readOnly,onSubmitSuccess, result_id,isEditing}){

    const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    symptoms: "",
    diagnose: "",
    alergies: "",
    result_text: "",
    attachment: "",
  });



    const[patientInfo,setPatientInfo]=useState({});
    const[doctorInfo,setDoctorInfo]=useState(null);

    const handleEmailSend=async()=>{
        try{
            const data={
                subject: "Medical Report",
                text: "Please find the report attached",
                patient_id,
                appointment_id
                
            };
            console.log("Sending email with data", data);

            const response=await axios.post(
                `http://localhost:3001/api/sendReport`,
                data,
                {withCredentials: true
                   
                }
            );
            alert("Medical report sent by email successfully");
        }catch(error){
            console.log("Error sending email:",error);
            alert("Failed to send report by email.");
        }
    };

    
    
    useEffect(()=>{
        const fetchReport=async()=>{
            try{
                let url;
                if(isEditing && result_id){
                    url=`http://localhost:3001/api/getReportId/${result_id}`;
                }else{
                    url=`http://localhost:3001/api/getReports/${patient_id}/${appointment_id}`;
                }
                const response=await axios.get(url,{
                    withCredentials: true
                });
                console.log("Fetched report", response.data);
                
                
                    setFormData(prev=>({
                        first_name: response.data.first_name || "",
                        last_name: response.data.last_name || "",
                        symptoms: response.data.symptoms || "",
                        diagnose: response.data.diagnose || "",
                        alergies: response.data.alergies || "",
                        result_text: response.data.result_text || "",
                        attachment: response.data.attachment || ""
                    }));
                    console.log("fetched data",response.data)
                
            }catch(error){
                if(error.response && error.response.status===404){
                    console.log("No report found for this patient and appointment.");
                }else{
                     console.error("Error fetching report:",error);

                }
               
            }
        };
        if(patient_id  && appointment_id || result_id){
            fetchReport();
        }
    },[patient_id,appointment_id, result_id,isEditing]);

    const handleChange=(e)=>{
        setFormData({...formData,[e.target.id]: e.target.value});
    };
    const handleFileChange=(e)=>{
        setFile(e.target.files[0]);
    };
    const handleSubmit= async (e)=>{
        e.preventDefault();
        const data=new FormData();
        
        data.append("patient_id",patient_id);
        data.append("appointment_id",appointment_id);
        data.append("first_name",formData.first_name);
        data.append("last_name",formData.last_name)
        data.append("symptoms",formData.symptoms);
        data.append("diagnose",formData.diagnose);
        data.append("alergies",formData.alergies);
        data.append("result_text",formData.result_text);

        if(file) data.append("attachment",file);

        try{

            if(isEditing && result_id){
                await axios.put(`http://localhost:3001/api/updateReports/${result_id}`, data, {
                    withCredentials: true
                });
                alert("Medical report updated successfully!");
            }else{
                await axios.post(
            `http://localhost:3001/api/reports/${patient_id}`,
            data,
            {
                withCredentials: true
            }
        );
        alert("Medical Report created successfully!");

            }
            

        

        
        
        if(onSubmitSuccess){
            onSubmitSuccess(patient_id,appointment_id);
        }
        closeModal();
        

        
    }catch(error){
        console.error("Error submitting form",error);
        alert("Failed to submit medical report");
    }
}

    
    return(
        <>

      <div style={{
            width: '100vw',
            height: '100vh',
            backgroundColor: 'rgba(200,200,200,0.8)',
            position: 'fixed',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            top: 0,
            left: 0,
            zIndex: 1000,}}>


            <div className="p-3 mb-2 bg-light text-dark" style={{
                width: '60%',
                maxWidth: '600px',
                maxHeight: '80vh',
                margin: '0 auto',
                overflowY: 'auto',
                borderRadius: '8px',
                backgroundColor: '#f8f9fa',
                display: 'flex',
                flexDirection: 'column',
                padding: '1rem',
                position: 'relative'
            }}>
    <h2 style={{color: '#51A485',textAlign: 'center'}}>Medical Report</h2>
            <IoCloseSharp onClick={closeModal} 
            style={{
            cursor: 'pointer',
            position: 'absolute',
            top: '1rem',
            right: '1rem',
            fontSize: '24px',
            color: '#51A485',
            zIndex: 10,
            }}/>
            {/*<ul className="list-group list-group-flush" 
            style={{
           
            width: '100%',
            marginBottom: '2rem',
        
            backgroundColor: '#f8f9fa',
            padding: '1rem'}}>
                <li className="list-group-item border-0 px-0 py-1" style={{backgroundColor: '#f8f9fa'}}>First Name: {patientInfo.first_name}</li>
                <li className="list-group-item border-0 px-0 py-1" style={{backgroundColor: '#f8f9fa'}}>Last Name: {patientInfo.last_name}</li>
                <li className="list-group-item border-0 px-0 py-1" style={{backgroundColor: '#f8f9fa'}}>Birthdate: {patientInfo.date_of_birth}</li>
                <li className="list-group-item border-0 px-0 py-1" style={{backgroundColor: '#f8f9fa'}}>Gender: {patientInfo.gender_name}</li>
                <li className="list-group-item border-0 px-0 py-1" style={{backgroundColor: '#f8f9fa'}}>Medical History: {patientInfo.medical_history}</li>
            </ul>*/}
            <form className="container mt-4" style={{width: '100%'}} onSubmit={handleSubmit}>
            <div className="row mb-3">
            <label htmlFor="first_name" className="form-label">First Name:</label>
            <div className="col-sm-10">
                <input type="text" className="form-control" id="first_name"
                value={formData.first_name} onChange={handleChange} readOnly={readOnly} />
            </div>
            </div>
            <div className="row mb-3">
            <label htmlFor="last_name" className="form-label">Last Name:</label>
            <div className="col-sm-10">
                <input type="text" className="form-control" id="last_name"
                value={formData.last_name} onChange={handleChange} readOnly={readOnly} />
            </div>
            </div>


               
                <div className="row mb-3">
                <label for="symptoms" className="form-label">Symptoms:</label>
                <div className="col-sm-10">
                <input type="text" className="form-control" id="symptoms" aria-describedby="symptoms"
                value={formData.symptoms} onChange={handleChange} readOnly={readOnly}/>
                </div>


                </div>
                <div className="row mb-3">
                <label for="diagnose" className="form-label">Diagnose:</label>
                <div className="col-sm-10">
                <input type="text" className="form-control" id="diagnose"
                value={formData.diagnose} onChange={handleChange} readOnly={readOnly}/>
                </div>

                </div>
                <div className="row mb-3 ">
                <label className="form-label" for="alergies">Alergies:</label>
                <div className="col-sm-10">
                    <input type="text" className="form-control" id="alergies"
                    value={formData.alergies} onChange={handleChange} readOnly={readOnly}/>
                </div>


                </div>

                <div className="row mb-3 ">
                 <label className="form-label" for="description">Description:</label>
                <div className="col-sm-10">
                 <input type="text" className="form-control" id="result_text"
                 value={formData.result_text} onChange={handleChange} readOnly={readOnly}/>
                </div>


                </div>
                <div className="row mb-3 ">
                <label className="form-label" for="testresults">Test Results:</label>
                <div className="col-sm-10">
                    {!readOnly &&(
                        <input type="file" className="form-control" id="attachment"
                 onChange={handleFileChange}/>

                    )}

                    {readOnly && formData.attachment&&(
                        <a href={`http://localhost:3001/reports/${formData.attachment}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{display: "block", marginTop: "0.5rem", color: "#007bff"}}>View attached file</a>
                    )}
                 
                 {/*{file && <p style={{marginTop: "0.5rem", color: "#333"}}>Uploaded file: {file.name}</p>}*/}
                </div>


                </div>
                <div>
                {!isEditing && !readOnly &&(
                    <>

                <button type="submit" name="action" value="submit" className="btn m-5" style={{backgroundColor: '#51A485',color: '#fff',width: '100px',height: '60px'}}>Submit</button>
                
                </>

                )}
                {isEditing && (
                     <button type="submit" name="action" value="submit" className="btn m-5" style={{backgroundColor: '#51A485',color: '#fff',width: '100px',height: '60px'}}>Update</button>

                )}
                {!isEditing && (
                     <button type="button" onClick={handleEmailSend} name="action" value="email" className="btn " style={{backgroundColor: '#51A485',color: '#fff',width: '100px'}}>Send by email</button>

                )}
               
                </div>
              
                </form>
            </div>
            </div>
            </>
    );

}
export default Modal;