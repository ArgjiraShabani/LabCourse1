import React from 'react';
import { useNavigate, useParams,} from 'react-router-dom'; 
import axios from 'axios';
import Info from '../Components/UserInfo';
import UpdateProfile from '../Components/updateProfile';
import { useState,useEffect } from "react";
import Sidebar from '../../../Components/AdminSidebar';
import { set } from 'react-hook-form';


const MyProfile = () => {
  const navigate = useNavigate();
  const param=useParams();
  const {id}=param; 

    const [info,setInfo]=useState(null);

  useEffect(()=>{
        axios.get(`http://localhost:3001/infoPatient/${id}`).then((response)=>{
            console.log(response.data)
            const dateOfBirth = response.data.date_of_birth.split("T")[0];
            response.data.date_of_birth = dateOfBirth;
            setInfo(response.data);
        })
    },[id]);

  return (
    <div className="d-flex" style={{ minHeight: '100vh' }}>
      <Sidebar role='patient' id={id} />
      <div className="flex-grow-1 p-4">
        <h2>Patient Profile</h2>
        <div style={{display:'flex',justifyContent:"space-around",flexWrap:'wrap'}}>
        <Info info={info} id={id} setInfo={setInfo}/>
        <UpdateProfile id={id} info={info} setInfo={setInfo}/>
        </div>
      </div>
    </div>
  );
};

export default MyProfile;
