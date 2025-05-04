import React from 'react';
import Sidebar from '../../Components/AdminSidebar';
import { useNavigate } from 'react-router-dom'; 
import { useState,useEffect } from 'react';
import { useParams } from 'react-router-dom';

const AdminDashboard = () => {
  const navigate = useNavigate(); 
  const param=useParams();
  const {id}=param;


  return (
    <>
    <div className="d-flex" style={{ minHeight: '100vh' }}>
      <Sidebar role="admin" id={id}/>
      <div className="flex-grow-1 p-4">
        <h2>Welcome to the Admin Dashboard</h2>
        <p>Select a section from the sidebar.</p>
      </div>
    </div>
    </>
  );
};

export default AdminDashboard;

