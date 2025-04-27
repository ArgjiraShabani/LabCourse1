import React from 'react';
import Sidebar from "../../Patient/SideBar/MyProfile";
import { useNavigate } from 'react-router-dom'; 

const MyProfile = () => {
  const navigate = useNavigate(); 

  return (
    <div className="d-flex" style={{ minHeight: '100vh' }}>
      <Sidebar />
      <div className="flex-grow-1 p-4">
        <h2>MyProfile</h2>
        <p>Select a section from the sidebar.</p>
      </div>
    </div>
  );
};

export default MyProfile;
