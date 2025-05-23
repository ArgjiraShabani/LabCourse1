import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Sidebar from '../../Components/AdminSidebar';
import Button from 'react-bootstrap/Button';
import Swal from 'sweetalert2';



const FeedbacksAdmin = () => {
  const [feedbacks, setFeedbacks] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:3001/feedbacksAdmin').then((response)=>{
      const formattedData = response.data.map(item => {
                return {
                  ...item,
                  created_at: item.created_at ? item.created_at.split("T")[0] : item.created_at
                };
              });
            setFeedbacks(formattedData);
        })
        .catch((err)=>{
          console.log(err);
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
                axios.delete(`http://localhost:3001/deleteFeedback/${id}`)
                     .then(response=>{
                        const updatedFeedback = feedbacks.filter(feedback => feedback.feedback_id !== id);
                    setFeedbacks(updatedFeedback);
                         })
                     .catch(error=>{
                         console.error('Not deleted!')
                    })
                
                Swal.fire({
                position: "center",
                icon: "success",
                title: "Feedback has been deleted!",
                showConfirmButton: false,
                timer: 1100
                });
            }
            });

}
 
  return (
    <div className="d-flex" style={{ minHeight: "100vh" }}>
      <Sidebar role="admin" />
      <div className="container mt-4">
        <h3 className="mb-4" style={{ color: '#51A485' }}>Feedbacks</h3>
        <table className="table table-bordered">
          <thead >
            <tr style={{ backgroundColor: '#51A485', color: 'white' }}>
              <th style={{ backgroundColor: '#51A485', color: 'white' }}>Patient ID</th>
              <th style={{ backgroundColor: '#51A485', color: 'white' }}>First Name</th>
              <th style={{ backgroundColor: '#51A485', color: 'white' }}>Last Name</th>
              <th style={{ backgroundColor: '#51A485', color: 'white' }}>Message</th>
              <th style={{ backgroundColor: '#51A485', color: 'white',width:"100px" }}>Date</th>
              <th style={{ backgroundColor: '#51A485', color: 'white' }}>Delete</th>
            </tr>
          </thead>
          <tbody>
              {feedbacks.map((value,key)=>{
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
              })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default FeedbacksAdmin;
