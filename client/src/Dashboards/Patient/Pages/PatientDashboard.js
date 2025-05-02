import React from 'react';
import Sidebar from "../../../Components/AdminSidebar"
import { useNavigate } from 'react-router-dom'; 
import Axios from "axios";
import { useState,useEffect } from 'react';
import { useParams } from 'react-router-dom';


const PatientDashboard = () => {
  const navigate = useNavigate(); 
  const param=useParams();
  const {id}=param;


  return (
    <>
    <div className="d-flex" style={{ minHeight: '100vh' }}>
      <Sidebar role='patient' id={id} />
      <div style={{marginTop:"100px"}}>
        <h1>Dashboard</h1>
      </div>
    </div>
   
   
    </>
  
  );
};

export default PatientDashboard;
