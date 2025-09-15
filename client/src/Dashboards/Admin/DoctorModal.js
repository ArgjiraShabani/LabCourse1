import axios from "axios";
import { useState,useEffect } from "react";
import { IoCloseSharp } from "react-icons/io5";
import {FaUser,FaEnvelope,FaPhone,FaGenderless,FaStethoscope,FaHospital} from "react-icons/fa";
import { PiStudentFill } from "react-icons/pi";
import { LuCalendarDays } from "react-icons/lu";

function DoctorModal({doctor_id,closeModal}){

    const [docInfo,SetDocInfo] = useState({});

    useEffect(()=>{
        axios.get(`http://localhost:3001/api/doctorInfo/${doctor_id}`,{
            withCredentials: true
        })
         .then((response)=>{
            console.log("Doctor Info:", response.data);

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
                src={`http://localhost:3001/uploads/${docInfo.image_path}`}
                alt={`${docInfo.first_name} ${docInfo.last_name}`}
                style={{
                    width: '150px',
                    height: '150px',
                    borderRadius: '50%',
                    objectFit: 'cover',
                    display: 'block',
                    margin: '0 auto'
                    }}
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
                        <FaUser size={60}/>
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
                <li className="list-group-item border-0 px-0 py-1" style={{backgroundColor: '#f8f9fa'}}>
                    <FaUser size={18} color="#51A485" title="Name" className="me-2"/> 
                    Name: {docInfo.first_name} {docInfo.last_name} </li>
                
                <li className="list-group-item border-0 px-0 py-1" style={{backgroundColor: '#f8f9fa'}}>
                    <LuCalendarDays size={18} color="#51A485" title="BirthDay" className="me-2"/>
                    Birthdate: {docInfo.date_of_birth}</li>
                <li className="list-group-item border-0 px-0 py-1" style={{backgroundColor: '#f8f9fa'}}>
                    <FaGenderless size={18} color="#51A485" title="Gender" className="me-2"/>
                    Gender:  {docInfo.gender_name || "Unknown"} </li>
                <li className="list-group-item border-0 px-0 py-1" style={{backgroundColor: '#f8f9fa'}}>
                    <FaEnvelope size={18} color="#51A485" title="Email" className="me-2"/> 
                    Email:  {docInfo.email} </li>
                <li className="list-group-item border-0 px-0 py-1" style={{backgroundColor: '#f8f9fa'}}>
                    <FaPhone size={18} color="#51A485" title="Phone" className="me-2"/> 
                    Phone Number: {docInfo.phone} </li>
                {/*<li className="list-group-item border-0 px-0 py-1" style={{backgroundColor: '#f8f9fa'}}>Password: {docInfo.password} </li>*/}
                <li className="list-group-item border-0 px-0 py-1" style={{backgroundColor: '#f8f9fa'}}>
                    <PiStudentFill size={25} color="#51A485" title="Name" className="me-2"/> 
                    Education: {docInfo.education} </li>
                <li className="list-group-item border-0 px-0 py-1" style={{backgroundColor: '#f8f9fa'}}>
                    <FaStethoscope size={18} color="#51A485" title="Specialization" className="me-2"/>
                    Specialization:  {docInfo.specialization_name || "Unknown"} </li>
                <li className="list-group-item border-0 px-0 py-1" style={{backgroundColor: '#f8f9fa'}}>
                    <FaHospital size={18} color="#51A485" title="Gender" className="me-2"/>
                    Department:  { docInfo.department_name} </li>

            </ul>
           
            </div>
            </div>
            </>
        
    );

    

}
export default DoctorModal;