import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Sidebar from '../../Components/AdminSidebar';
import Button from 'react-bootstrap/Button';
import Swal from 'sweetalert2';
import { useNavigate } from "react-router-dom";




const FeedbacksAdmin = () => {
  const [feedbacks, setFeedbacks] = useState([]);
  const navigate = useNavigate();

  
  useEffect(() => {
  axios
    .get(`http://localhost:3001/FeedbacksAdmin`, {
      withCredentials: true, // this sends the JWT cookie
    })
    .then((res) => {
      if (res.data.user?.role !== 'admin') {
        // Not a patient? Block it.
        Swal.fire({
          icon: 'error',
          title: 'Access Denied',
          text: 'Only admin can access this page.',
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
}, []);

  useEffect(() => {
    axios.get('http://localhost:3001/api/feedbacksAdmin',{
        withCredentials: true
    }).then((response)=>{
       const formattedData = response.data.map(item => {
        if (item.created_at) {
          const datePart = item.created_at.split("T")[0];
          const [year, month, day] = datePart.split("-");
          const formattedDate = `${month}-${day}-${year}`;
          return {
            ...item,
            created_at: formattedDate
          };
        }
        return item;
      });
            setFeedbacks(formattedData);
        })
        .catch((err)=>{
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
        })
  }, []);
 
function handleDelete(id){
     Swal.fire({
            title: "Are you sure about deleting this feedback?",
            showCancelButton: true,
            confirmButtonColor: "#51A485",
            cancelButtonColor: "#d33",
            confirmButtonText: "Delete"
            }).then((result) => {
            if (result.isConfirmed) {
                axios.patch(`http://localhost:3001/api/updateFeedback/${id}`,{
        withCredentials: true
    })
                     .then(response=>{
                        const updatedFeedback = feedbacks.filter(feedback => feedback.feedback_id !== id);
                    setFeedbacks(updatedFeedback);
                      Swal.fire({
                position: "center",
                icon: "success",
                title: "Feedback has been removed!",
                showConfirmButton: false,
                timer: 1100
                });
                         })
                     .catch(err=>{
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
                    })
                
              
            }
            });

}
 
  return (
    <div className="d-flex" style={{ minHeight: "100vh" }}>
      <Sidebar role="admin" />
      <div className="container py-4 flex-grow-1">
        <h3 className="mb-3">Feedbacks</h3>
      <div className="table-responsive">
        <table className="table table-bordered table-hover align-middle">
          <thead >
            <tr>
              <th style={{ backgroundColor: '#51A485', color: 'white' }}>Patient ID</th>
              <th style={{ backgroundColor: '#51A485', color: 'white' }}>First Name</th>
              <th style={{ backgroundColor: '#51A485', color: 'white' }}>Last Name</th>
              <th style={{ backgroundColor: '#51A485', color: 'white' }}>Message</th>
              <th style={{ backgroundColor: '#51A485', color: 'white',width:"200px" }}>Date</th>
              <th style={{ backgroundColor: '#51A485', color: 'white' }}>Delete</th>
            </tr>
          </thead>
          <tbody>
              {feedbacks.length>0 ? (feedbacks.map((value,key)=>{
                return(
                <tr key={key}>
                  <td>{value.patient_id}</td>
                  <td>{value.first_name}</td>
                  <td>{value.last_name}</td>
                  <td>{value.feedback_text}</td>
                  <td>{value.created_at}</td>
                  <td style={{display:"flex",justifyContent:"center"}}>
                  <Button variant="danger" onClick={()=>{handleDelete(value.feedback_id)}}>Delete</Button>
                  </td>
                </tr>
                )
              })):(
                <tr>
                  <td colSpan="6" className='text-center'>No feedbacks found!</td>
                </tr>
              )}
          </tbody>
        </table>
        </div>
      </div>
    </div>
    
  );
};

export default FeedbacksAdmin;
