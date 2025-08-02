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
  const {id}=param; 
  const navigate = useNavigate();


  useEffect(() => {
  axios
    .get(`http://localhost:3001/feedbacksPatient/${id}`, {
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
      navigate('/');
    });
}, [id]);

    useEffect(()=>{
         axios.get(`http://localhost:3001/patient/feedbacksPatient/${id}`).then((response)=>{
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
          console.log(err);
        })
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
                      axios.delete(`http://localhost:3001/patient/deleteFeedback/${feedbackId}`)
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
                                  .catch(error=>{
                                      console.error('Not deleted!')
                                  })
                                }})
    }

   return(
    <>
      <div className="d-flex" style={{ minHeight: "100vh" }}>
        <Sidebar role="patient" id={id} />
        <div className="container py-4 flex-grow-1">
          <h3 className="mb-3">My Feedbacks</h3>
          <div className="table-responsive">
          <table className="table table-bordered table-hover align-middle" style={{minWidth:"400px"}}>
            <thead>
              <tr>
                <th style={{ backgroundColor: '#51A485', color: 'white' }}>Message</th>
                <th style={{ backgroundColor: '#51A485', color: 'white'}}>Date</th>
                <th style={{ backgroundColor: '#51A485', color: 'white' }}>Delete</th>
              </tr>
            </thead>
            <tbody> 
          {info.length>0 ? (info.map((value,key)=>{
            return(
              <>
              <tr>
            <td>{value.feedback_text}</td>
            <td >{value.created_at}</td>
            <td style={{display:"flex",justifyContent:"center"}}>
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