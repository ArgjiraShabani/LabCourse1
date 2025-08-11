import React from 'react';
import { useNavigate, useParams,} from 'react-router-dom'; 
import axios from 'axios';
import Info from '../Components/UserInfo';
import UpdateProfile from '../Components/updateProfile';
import { useState,useEffect } from "react";
import Sidebar from '../../../Components/AdminSidebar';
import { set } from 'react-hook-form';
import UpdatePassword from '../Components/updatePassword';
import Swal from "sweetalert2";


const MyProfile = () => {
  const navigate = useNavigate();
  const param=useParams();
  const {id}=param; 

    const [info,setInfo]=useState(null);

   useEffect(() => {
  axios
    .get(`http://localhost:3001/myprofile/${id}`, {
      withCredentials: true, // this sends the JWT cookie
    })
    .then((res) => {
      if (res.data.user?.role !== 'patient') {
        // Not a patient? Block it.
        Swal.fire({
          icon: 'error',
          title: 'Access Denied',
          text: 'Only patients can access this page.',
        });
        navigate('/');
      }
    })
    .catch((err) => {
      if (err.response && (err.response.status === 401 || err.response.status === 403)) {
         Swal.fire({
                                  icon: "error",
                                  title: "Access Denied",
                                  text: "Please login.",
                                  confirmButtonColor: "#51A485",
                                });
        navigate('/');
      } else {
        console.error("Unexpected error", err);
      }
    });
}, [id]);

  useEffect(()=>{
        axios.get(`http://localhost:3001/patient/infoPatient/${id}`,{
        withCredentials: true
    }).then((response)=>{
            console.log(response.data)
            console.log(response.data.date_of_birth)
            const dateOfBirth = response.data.date_of_birth.split("T")[0];
            response.data.date_of_birth = dateOfBirth;
                        console.log(response.data.date_of_birth)

            setInfo(response.data);
        }).catch((err) => {
            if (err.response && (err.response.status === 401 || err.response.status === 403)) {
               Swal.fire({
                                        icon: "error",
                                        title: "Access Denied",
                                        text: "Please login.",
                                        confirmButtonColor: "#51A485",
                                      });
              navigate('/');
            } else {
              console.error("Unexpected error", err);
            }
          });
    },[id]);


  return (
    <div className="d-flex" style={{ minHeight: '100vh' }}>
      <Sidebar role='patient' id={id} />
      <div className="flex-grow-1 p-4">
        <h3>Patient Profile</h3>
        <div style={{display:'flex',justifyContent:"space-around",flexWrap:'wrap'}}>
        <Info info={info} id={id} setInfo={setInfo}/>
        <UpdateProfile id={id} info={info} setInfo={setInfo}/>
        <UpdatePassword id={id}/>
        </div>
      </div>
    </div>
  );
};

export default MyProfile;
