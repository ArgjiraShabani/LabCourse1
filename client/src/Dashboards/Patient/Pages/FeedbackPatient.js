import axios from "axios";
import Sidebar from "../../../Components/AdminSidebar";
import { useState,useEffect } from "react";
import { useParams } from "react-router-dom";


function FeedbacksPatient(){
    const [info,setInfo]=useState([]);
      const param=useParams();
      const {id}=param; 


    useEffect(()=>{
         axios.get(`http://localhost:3001/feedbacksPatient/${id}`).then((response)=>{
           const formattedData = response.data.map(item => {
                return {
                  ...item,
                  created_at: item.created_at ? item.created_at.split("T")[0] : item.created_at
                };
              });
            setInfo(formattedData);
        })
        .catch((err)=>{
          console.log(err);
        })
    },[]);

   return(
    <>
      <div className="d-flex" style={{ minHeight: "100vh" }}>
        <Sidebar role="patient" id={id} />
        <div className="flex-grow-1 p-4">
          <h3 className="mb-4" style={{ color: '#51A485' }}>My Feedbacks</h3>
          <table className="table table-bordered">
            <thead>
              <tr>
                <th style={{ backgroundColor: '#51A485', color: 'white' }}>Message</th>
                <th style={{ backgroundColor: '#51A485', color: 'white' }}>Date</th>
              </tr>
            </thead>
            <tbody>
          {info.map((value,key)=>{
            return(
              <>
              <tr>
            <td>{value.feedback_text}</td>
            <td>{value.created_at}</td>
            </tr>
            </>
            )
          })

          }

            </tbody>
          </table>
        </div>
      </div>

    </>
   )
}

export default FeedbacksPatient;