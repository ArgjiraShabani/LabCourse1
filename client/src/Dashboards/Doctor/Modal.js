import { IoCloseSharp } from "react-icons/io5";
import { useEffect, useState} from "react";
import Axios from "axios";
function Modal({closeModal,patient_id}){


    const[patientInfo,setPatientInfo]=useState([]);
    useEffect(()=>{
        Axios.get(`http://localhost:3001/getPatientInfo/${patient_id}`)
        .then((response)=>{
            const birthDate=response.data.date_of_birth.split("T")[0];
            response.data.date_of_birth=birthDate;
            setPatientInfo(response.data);
        })
        .catch((error)=>{
            console.error("Error fetching user",error);
        });
    },[patient_id]);

    
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
            <ul className="list-group list-group-flush" 
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
            </ul>
            <form className="container mt-4" style={{width: '100%'}}>
                <div className="row mb-3">
                <label for="symptoms" className="form-label">Symptoms:</label>
                <div className="col-sm-10">
                <input type="text" className="form-control" id="symptoms" aria-describedby="symptoms"/>
                </div>


                </div>
                <div className="row mb-3">
                <label for="diagnose" className="form-label">Diagnose:</label>
                <div className="col-sm-10">
                <input type="text" className="form-control" id="diagnose"/>
                </div>

                </div>
                <div className="row mb-3 ">
                <label className="form-label" for="alergies">Alergies:</label>
                <div className="col-sm-10">
                    <input type="text" className="form-control" id="alergies"/>
                </div>


                </div>

                <div className="row mb-3 ">
                 <label className="form-label" for="description">Description:</label>
                <div className="col-sm-10">
                 <input type="text" className="form-control" id="description"/>
                </div>


                </div>
                <div className="row mb-3 ">
                <div className="col-sm-10">
                 <input type="file" className="form-control" id="results"/>
                </div>


                </div>

                <button type="submit" className="btn m-5" style={{backgroundColor: '#51A485',color: '#fff',width: '100px',height: '60px'}}>Submit</button>
                <button type="submit" className="btn " style={{backgroundColor: '#51A485',color: '#fff',width: '100px'}}>Send by email</button>
               <button type="submit" className="btn m-5" style={{backgroundColor: '#51A485',color: '#fff',width: '100px',height: '60px'}}>Print</button>
            </form>
            </div>
            </div>
            </>
    );

}
export default Modal;