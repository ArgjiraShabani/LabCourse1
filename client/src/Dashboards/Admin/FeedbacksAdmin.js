import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Sidebar from '../../Components/AdminSidebar';
import Button from 'react-bootstrap/Button';


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
              console.log(formattedData)
            setFeedbacks(formattedData);
        })
        .catch((err)=>{
          console.log(err);
        })
  }, []);

 
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
                <tr>
                  <td>{value.patient_id}</td>
                  <td>{value.first_name}</td>
                  <td>{value.last_name}</td>
                  <td>{value.feedback_text}</td>
                  <td>{value.created_at}</td>
                  <td>
                  <Button variant="danger">Delete</Button>
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
