import axios from "axios";
import Sidebar from "../SideBar/MyProfile";
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
     <div className="container-fluid">
      <div className="row">
        {/* Sidebar column */}
        <div className="col-12 col-md-3">
          <Sidebar />
        </div>

        {/* Main content column */}
        <div className="col-12 col-md-9 mt-4 mt-md-0">
          <table className="table table-striped table-bordered">
            <thead className="table-primary">
              <tr>
                <th>Message</th>
                <th>Date</th>
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
    </div>
    </>
   )
}

export default FeedbacksPatient;