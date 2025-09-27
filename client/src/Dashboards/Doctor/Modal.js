import { IoCloseSharp } from "react-icons/io5";
import { useEffect, useState} from "react";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import * as yup from "yup";

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

    const [patientInfo, setPatientInfo] = useState({});
    const [doctorInfo, setDoctorInfo] = useState(null);
    const [loading, setLoading] = useState(false);
    const [formErrors, setFormErrors] = useState({});

    const validationSchema = yup.object().shape({
    first_name: yup.string().required("First name is required"),
    last_name: yup.string().required("Last name is required"),
    symptoms: yup.string().required("Symptoms are required"),
    diagnose: yup.string().required("Diagnose is required"),
    alergies: yup.string().required("Alergies are required"),
    result_text: yup.string().required("Description is required"),
});

    const navigate = useNavigate();

   
    const handleApiError = (error, message = "Something went wrong") => {
        if (error.response && (error.response.status === 401 || error.response.status === 403)) {
            navigate('/login');
            return;
           
        } else {
            console.error(message, error);
            Swal.fire({
                icon: "error",
                title: "Oops...",
                text: error.response?.data?.message || message,
                confirmButtonColor: "#51A485",
            });
        }
    };

    const handleEmailSend = async () => {
        setLoading(true);
        try {
            const data = {
                subject: "Medical Report",
                text: "Please find the report attached",
                patient_id,
                appointment_id
            };

            console.log("Sending email with data", data);

            const response = await axios.post(
                `http://localhost:3001/api/sendReport`,
                data,
                { withCredentials: true }
            );

            Swal.fire({
                icon: "success",
                title: "Report Sent Successfully!",
                text: response.data.message,
                confirmButtonColor: "#51A485",
            });
        } catch (error) {
            handleApiError(error, "Error sending email");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const fetchReport = async () => {
            try {
                let url;
                if (isEditing && result_id) {
                    url = `http://localhost:3001/api/getReportId/${result_id}`;
                } else if(readOnly) {
                    url = `http://localhost:3001/api/getReports/${patient_id}/${appointment_id}`;
                }else{
                    return;
                }

                const response = await axios.get(url, {
                    withCredentials: true
                });

                setFormData(prev => ({
                    first_name: response.data.first_name || "",
                    last_name: response.data.last_name || "",
                    symptoms: response.data.symptoms || "",
                    diagnose: response.data.diagnose || "",
                    alergies: response.data.alergies || "",
                    result_text: response.data.result_text || "",
                    attachment: response.data.attachment || ""
                }));
            } catch (error) {
                handleApiError(error, "Error fetching report");
            }
        };
        fetchReport();

        /*if ((patient_id && appointment_id) || result_id) {
            fetchReport();
        }*/
    }, [patient_id, appointment_id, result_id, isEditing]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.id]: e.target.value });
    };

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const handleSubmit = async (e) => {
    e.preventDefault();

    try {
       
        await validationSchema.validate(formData, { abortEarly: false });

       
        setFormErrors({});

        const data = new FormData();

        data.append("patient_id", patient_id);
        data.append("appointment_id", appointment_id);
        data.append("first_name", formData.first_name);
        data.append("last_name", formData.last_name);
        data.append("symptoms", formData.symptoms);
        data.append("diagnose", formData.diagnose);
        data.append("alergies", formData.alergies);
        data.append("result_text", formData.result_text);

        if (file) data.append("attachment", file);

        if (isEditing && result_id) {
            await axios.put(`http://localhost:3001/api/updateReports/${result_id}`, data, {
                withCredentials: true
            });
            Swal.fire({
                title: "Success!",
                text: "Your report was updated successfully.",
                icon: "success",
                confirmButtonText: "OK",
            });
        } else {
            await axios.post(
                `http://localhost:3001/api/reports/${patient_id}`,
                data,
                { withCredentials: true }
            );
            Swal.fire({
                title: "Success!",
                text: "Your report was created successfully.",
                icon: "success",
                confirmButtonText: "OK",
            });
        }

        if (onSubmitSuccess) {
            onSubmitSuccess(patient_id, appointment_id);
        }
        closeModal();
    } catch (error) {
        if (error.name === "ValidationError") {
           
            const errors = {};
            error.inner.forEach((err) => {
                errors[err.path] = err.message;
            });
            setFormErrors(errors);
        } else {
            handleApiError(error, "Error submitting form");
        }
    }
};

    
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
          
            <form className="container mt-4" style={{width: '100%'}} onSubmit={handleSubmit}>
            <div className="row mb-3">
            <label htmlFor="first_name" className="form-label">First Name:</label>
            <div className="col-sm-10">
                <input type="text" className="form-control" id="first_name"
                value={formData.first_name} onChange={handleChange} readOnly={readOnly} />
                {formErrors.first_name && <div className="text-danger">{formErrors.first_name}</div>}
            </div>
            </div>
            <div className="row mb-3">
            <label htmlFor="last_name" className="form-label">Last Name:</label>
            <div className="col-sm-10">
                <input type="text" className="form-control" id="last_name"
                value={formData.last_name} onChange={handleChange} readOnly={readOnly} />
                {formErrors.last_name && <div className="text-danger">{formErrors.last_name}</div>}
            </div>
            </div>


               
                <div className="row mb-3">
                <label for="symptoms" className="form-label">Symptoms:</label>
                <div className="col-sm-10">
                <input type="text" className="form-control" id="symptoms" aria-describedby="symptoms"
                value={formData.symptoms} onChange={handleChange} readOnly={readOnly}/>
                {formErrors.symptoms && <div className="text-danger">{formErrors.symptoms}</div>}
                </div>


                </div>
                <div className="row mb-3">
                <label for="diagnose" className="form-label">Diagnose:</label>
                <div className="col-sm-10">
                <input type="text" className="form-control" id="diagnose"
                value={formData.diagnose} onChange={handleChange} readOnly={readOnly}/>
                {formErrors.diagnose && <div className="text-danger">{formErrors.diagnose}</div>}
                </div>

                </div>
                <div className="row mb-3 ">
                <label className="form-label" for="alergies">Alergies:</label>
                <div className="col-sm-10">
                    <input type="text" className="form-control" id="alergies"
                    value={formData.alergies} onChange={handleChange} readOnly={readOnly}/>
                    {formErrors.alergies && <div className="text-danger">{formErrors.alergies}</div>}
                </div>


                </div>

                <div className="row mb-3 ">
                 <label className="form-label" for="description">Description:</label>
                <div className="col-sm-10">
                 <input type="text" className="form-control" id="result_text"
                 value={formData.result_text} onChange={handleChange} readOnly={readOnly}/>
                 {formErrors.result_text && <div className="text-danger">{formErrors.result_text}</div>}
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
                    <div className="d-flex justify-content-center mt-4">

                <button type="submit" name="action" value="submit" className="btn m-5" 
                style={{backgroundColor: '#51A485',color: '#fff',width: '100%',maxWidth:"400px",fontSize: "16px",padding:"15px"}}>Submit</button></div>
                
                </>

                )}
                {isEditing && (
                    <div className="d-flex justify-content-center mt-4">
                     <button 
                     type="submit" 
                     name="action" 
                     value="submit"
                      className="btn m-5" 
                      style={{backgroundColor: '#51A485',color: '#fff',width: '100%',maxWidth:"400px",fontSize: "16px",padding:"15px"}}>
                        Update</button></div>

                )}
                {readOnly && (
                    <div className="d-flex justify-content-center mt-4">
                     <button
                      type="button"
                      onClick={handleEmailSend} 
                      name="action" value="email" 
                      className="btn " 
                      style={{backgroundColor: '#51A485',
                    color: '#fff',
                    padding: '15px',
                    fontSize: '16px',
                    width: '100%',
                    maxWidth: '400px'}}
                     disabled={loading}>
                         {loading?(
                                <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                            ):(
                                "Send Results by email"

                            )}</button></div>

                )}
               
                </div>
              
                </form>
            </div>
            </div>
            </>
    );

}
export default Modal;