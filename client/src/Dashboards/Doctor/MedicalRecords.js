import { useState } from "react";
import Sidebar from "../../Components/AdminSidebar";
import Modal from "./Modal";
function MedicalRecords(){

    const [openModal,setOpenModal] = useState(false);
    

    return(
       <>
       <div style={{display: "flex",minHeight: "100vh"}}>
      <div style={{width: "250px"}}>
                <Sidebar role="doctor"/>
        </div>
        <div style={{ flex: 1, padding: "2rem" }}>
       <button  style={{
            padding: "40px 50px",
            backgroundColor: "#51A485",
            color: "#fff",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
          }} onClick={()=>{
        setOpenModal(true);
       }}>Write prescription</button>
       {openModal && <Modal closeModal={()=>setOpenModal(false)} />}
        </div>
        </div>

       </>
    );

}
export default MedicalRecords;