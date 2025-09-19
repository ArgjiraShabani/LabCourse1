import axios from "axios";
import Sidebar from "../../../Components/AdminSidebar";
import { useState,useEffect } from "react";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import Button from 'react-bootstrap/Button';
import Swal from 'sweetalert2';




function FeedbacksPatient(){
  const [info,setInfo]=useState([]);
  const param=useParams();
const [id,setId]=useState("");
  const navigate = useNavigate();
const [editingFeedback, setEditingFeedback] = useState(null);
const [newFeedbackText, setNewFeedbackText] = useState("");



  useEffect(() => {
  axios
    .get(`http://localhost:3001/feedbacksPatient`, {
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
      setId(res.data.user.id);
    })
    .catch((err) => {
      if (err.response && (err.response.status === 401 || err.response.status === 403)) {
        
        navigate('/login');
      } else {
        console.error("Unexpected error", err);
      }
    });
}, [id]);

    useEffect(()=>{
      if (!id) return;
         axios.get(`http://localhost:3001/patient/feedbackPatient/${id}`,{
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
              });
            setInfo(formattedData);
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
        });
    },[id]);

    function deleteFeedback(feedbackId){
      Swal.fire({
                  title: "Are you sure about deleting this feedback?",
                  showCancelButton: true,
                  confirmButtonColor: "#51A485",
                  cancelButtonColor: "#d33",
                  confirmButtonText: "Delete"
                  }).then((result) => {
                  if (result.isConfirmed) {
                      axios.delete(`http://localhost:3001/patient/deleteFeedback/${feedbackId}`,{
                                   withCredentials: true
                                })
                                  .then(response=>{
                                  const updatedFeedback = info.filter(feedback => feedback.feedback_id !==feedbackId);
                                  setInfo(updatedFeedback);
                                    Swal.fire({
                                                  position: "center",
                                                  icon: "success",
                                                  title: "Feedback has been deleted!",
                                                  showConfirmButton: false,
                                                  timer: 1100
                                                  });
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
                                  })
                                }})
    }
    function handleUpdate(feedbackId){
      Swal.fire({
                  title: "Are you sure about updating this feedback?",
                  showCancelButton: true,
                  confirmButtonColor: "#51A485",
                  cancelButtonColor: "#d33",
                  confirmButtonText: "Update"
                  }).then((result) => {
                  if (result.isConfirmed) {
                     axios.patch(`http://localhost:3001/patient/updateFeedback/${feedbackId}`, 
                                    { feedback_text: newFeedbackText },
                                    { withCredentials: true }
                                  )
                      .then((response) => {
                              const updated = info.map(fb => {
                                      if (fb.feedback_id === feedbackId) {
                                        return { ...fb, feedback_text: newFeedbackText };
                                      }
                                      return fb;
                              });
                                    setInfo(updated);
                                    setEditingFeedback(null);
                                    Swal.fire({
                                      icon: 'success',
                                      title: 'Feedback updated!',
                                      showConfirmButton: false,
                                      timer: 1000
                                    });
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
                                  })
                                }})
    }

   return(
    <>
    {editingFeedback && (
  <div className="modal show d-block" tabIndex="-1" role="dialog">
    <div className="modal-dialog" role="document">
      <div className="modal-content">
        <div className="modal-header">
          <h5 className="modal-title">Edit Feedback</h5>
          <button type="button" className="btn-close" onClick={() => setEditingFeedback(null)}></button>
        </div>
        <div className="modal-body">
          <textarea
            className="form-control"
            rows="4"
            value={newFeedbackText}
            onChange={(e) => setNewFeedbackText(e.target.value)}
          ></textarea>
        </div>
        <div className="modal-footer">
          <Button variant="secondary" onClick={() => setEditingFeedback(null)}>Cancel</Button>
          <Button variant="primary" onClick={() => handleUpdate(editingFeedback)}>Update</Button>
        </div>
      </div>
    </div>
  </div>
)}

      <div className="d-flex" style={{ minHeight: "100vh" }}>
        <Sidebar role="patient" id={id} />
        <div className="container py-4 flex-grow-1">
          <h3 className="mb-3">My Feedbacks</h3>
          <div className="table-responsive">
          <table className="table table-bordered table-hover align-middle" style={{minWidth:"400px"}}>
            <thead>
              <tr>
                <th style={{ backgroundColor: '#51A485', color: 'white', width:'60%'}}>Message</th>
                <th style={{ backgroundColor: '#51A485', color: 'white'}}>Date</th>
                <th style={{ backgroundColor: '#51A485', color: 'white'}}>Edit</th>
                <th style={{ backgroundColor: '#51A485', color: 'white'}}>Delete</th>

              </tr>
            </thead>
            <tbody> 
          {info.length>0 ? (info.map((value,key)=>{
            return(
              <>
              <tr>
            <td>{value.feedback_text}</td>
            <td >{value.created_at}</td>
            <td>
                  <Button variant="danger" onClick={() =>{setEditingFeedback(value.feedback_id);
                          setNewFeedbackText(value.feedback_text);}}>Edit</Button>
            </td>
            <td>
                  <Button variant="danger" onClick={() =>{deleteFeedback(value.feedback_id)}}>Delete</Button>
            </td>

            </tr>
            </>
            )
          })):(
            <tr>
              <td colSpan="3" className="text-center">No feedbacks found</td>
            </tr>
          )

          }

            </tbody>
          </table>
          </div>
        </div>
      </div>

    </>
   )
}

export default FeedbacksPatient;