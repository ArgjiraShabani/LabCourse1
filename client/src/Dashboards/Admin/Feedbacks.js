import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Sidebar from '../../Components/AdminSidebar';

const PatientFeedbacks = () => {
  const [feedbacks, setFeedbacks] = useState([]);

  useEffect(() => {
    fetchFeedbacks();
  }, []);

  const fetchFeedbacks = async () => {
    try {
      const response = await axios.get('http://localhost:3001/api/feedbacks');
      setFeedbacks(response.data);
    } catch (error) {
      console.error('Error fetching feedbacks:', error);
    }
  };

  return (
    <div className="d-flex" style={{ minHeight: "100vh" }}>
      <Sidebar role="admin" />
      <div className="container mt-4">
        <h3 className="mb-4" style={{ color: '#51A485' }}>Feedbacks</h3>
        <table className="table table-bordered">
          <thead style={{ backgroundColor: '#51A485', color: 'white' }}>
            <tr>
              <th>#</th>
              <th>First Name</th>
              <th>Last Name</th>
              <th>Message</th>
              <th>Date</th>
              <th>Role</th> 
            </tr>
          </thead>
          <tbody>
            {feedbacks.length > 0 ? (
              feedbacks.map((fb, index) => (
                <tr key={fb.feedback_id}>
                  <td>{index + 1}</td>
                  <td>{fb.first_name || 'Unknown'}</td>
                  <td>{fb.last_name || 'Unknown'}</td>
                  <td>{fb.message}</td>
                  <td>{new Date(fb.created_at).toLocaleString()}</td>
                  <td>{fb.submitted_by || 'Unknown'}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="text-center">No feedbacks found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PatientFeedbacks;
