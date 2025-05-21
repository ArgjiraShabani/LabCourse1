import axios from "axios";
import { useState,useEffect } from "react";
import { IoCloseSharp } from "react-icons/io5";

function DoctorModal({doctor_id,closeModal}){

    const [docInfo,SetDocInfo] = useState({});

    useEffect(()=>{
        axios.get(`http://localhost:3001/doctorId/${doctor_id}`)
         .then((response)=>{
            const birthDate=response.data.date_of_birth.split("T")[0];
            response.data.date_of_birth=birthDate;
            SetDocInfo(response.data);
        })
        .catch((error)=>{
            console.error("Error fetching user",error);
        });
    },[doctor_id])
    return(
        <>
        <div style={{
            width: '100vw',
            height: '100vh',
            backgroundColor: 'rgba(200,200,200,0.2)',
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
            <div>
                {docInfo.image_path?(
                <img
                src={`http://localhost:3001${docInfo.image_path}`}
                alt={`${docInfo.first_name} ${docInfo.last_name}`}
                style={{width: '150px',height: '150px',borderRadius: '50%',objectFit: 'cover',border: '3px solidrgb(86, 245, 186)'}}
                />
                ):(
                    <div
                    style={{
                        width: '150px',
                        height: '150px',
                        borderRadius: '50%',
                        backgroundColor: '#ccc',
                        lineHeight: '150px',
                        textAlign: 'center',
                        fontSize: '16px',
                        color: '#555',
                        margin: '0 auto'
                    }

                    }>
                        No Image
                </div>
                )
                }
            </div>
            <ul className="list-group list-group-flush" 
            style={{
           
            width: '100%',
            marginBottom: '2rem',
        
            backgroundColor: '#f8f9fa',
            padding: '1rem'}}>
                <li className="list-group-item border-0 px-0 py-1" style={{backgroundColor: '#f8f9fa'}}>First Name: {docInfo.first_name} </li>
                <li className="list-group-item border-0 px-0 py-1" style={{backgroundColor: '#f8f9fa'}}>Last Name:{docInfo.last_name}</li>
                <li className="list-group-item border-0 px-0 py-1" style={{backgroundColor: '#f8f9fa'}}>Birthdate:{docInfo.date_of_birth}</li>
                <li className="list-group-item border-0 px-0 py-1" style={{backgroundColor: '#f8f9fa'}}>Gender: {docInfo.gender_name} </li>
                <li className="list-group-item border-0 px-0 py-1" style={{backgroundColor: '#f8f9fa'}}>Email: {docInfo.email} </li>
                <li className="list-group-item border-0 px-0 py-1" style={{backgroundColor: '#f8f9fa'}}>Password: {docInfo.password} </li>
                <li className="list-group-item border-0 px-0 py-1" style={{backgroundColor: '#f8f9fa'}}>Specialization: {docInfo.specialization_name} </li>
                <li className="list-group-item border-0 px-0 py-1" style={{backgroundColor: '#f8f9fa'}}>Department: {docInfo.department_name} </li>

            </ul>
           
            </div>
            </div>
            </>
        
    );

    

}
export default DoctorModal;