import React from 'react';
import Sidebar from "../../Patient/SideBar/MyProfile";
import { useNavigate, useParams,} from 'react-router-dom'; 

import Info from '../Components/UserInfo';
import UpdateProfile from '../Components/updateProfile';

const MyProfile = () => {
  const navigate = useNavigate();
  const param=useParams();
  const {id}=param; 
  

  return (
    <div className="d-flex" style={{ minHeight: '100vh' }}>
      <Sidebar />
      <div className="flex-grow-1 p-4">
        <h2>Patient Profile</h2>
        <div style={{display:'flex',justifyContent:"space-around",flexWrap:'wrap'}}>
        <Info id={id}/>
        <UpdateProfile id={id} />
        </div>
      </div>
    </div>
  );
};

export default MyProfile;
