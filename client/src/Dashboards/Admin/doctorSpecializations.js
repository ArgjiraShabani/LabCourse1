import Sidebar from "../../Components/AdminSidebar";
import { useState,useEffect } from "react";
import axios from "axios";
import { FaRegEdit,FaRegEye } from "react-icons/fa";
import { GoTrash } from "react-icons/go";
function DoctorSpecializations(){
    const [specialization,setSpecialization]=useState([]);
    const [specializationName,setSpecializationName]=useState('');

    useEffect(()=>{
        fetchSpecializations();
    },[]);
    const fetchSpecializations=()=>{
          axios.get("http://localhost:3001/api/specializations").then((response)=>{
            setSpecialization(response.data);
        }) .catch((error) => {
            console.error("Error fetching specializations:", error);
        });
    }

    

    const handleChange=(e)=>{
        setSpecializationName( e.target.value);

    }
    const submitHandler= async (e)=>{
        e.preventDefault();
        if(!specializationName.trim()){
            alert("Please enter specialization name.");
            return;
        }
        try{
            await axios.post("http://localhost:3001/api/addSpecialization",
            {specialization_name: specializationName});
            alert("Specialization added successfully!");
            setSpecializationName('');
            fetchSpecializations();
    }catch(error){
            console.log("Error adding specialization:",error);
            alert("Error adding specialization");
        }
    };
        
   
    return(
        <>
        <div style={{display: "flex",minHeight: "100vh"}}>
            <div style={{width: "250px"}}>
                <Sidebar role="admin"/>
            </div>

            <div
                style={{
                    flexGrow: 1,
                    padding: "40px",
                    backgroundColor: "#f9f9f9",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                }}
            >

            <h2 style={{ color: "#51A485", marginBottom: "20px" }}>Add a new specialization</h2>

            <form style={{ width: "100%", maxWidth: "400px" }}
            onSubmit={submitHandler}>
                <label className="form-label">Specialization Name:</label>
                <input type="text"  className="form-control mb-3" placeholder="Add the specialization name"
                value={specializationName}
                onChange={handleChange}/>
                <button type="submit"  className="btn btn-primary" style={{backgroundColor: '#51A485',width: '100%'}}>Add specialization</button>
            </form>

             <table className="table  table-borderes" style={{
            width: '100%',
             maxWidth: '900px',
              fontSize: '1rem', 
              borderCollapse: 'collapse',
              margin:'0 auto',
              border: '1px solid #D3D3D3'
               }}>
        
  <thead style={{backgroundColor: '#51A485',color: '#fff',padding: '12px 15px'}}>
    <tr style={{backgroundColor: '#51A485',color: '#fff',padding: '12px 15px'}}>
      <th scope="col" >Id</th>
      <th scope="col">Specialization Name</th>
      
    </tr>
  </thead>
  <tbody>
    {specialization.map((s)=>(
        <tr key={s.specialization_id}>
        <td >{s.specialization_id}</td>
        <td >{s.specialization_name}</td>
        
      
        <td><FaRegEdit size={18} color="#51A485" title="Update"/></td>
        <td><GoTrash size={18} color="#51A485" title="Delete"/></td>

        
      </tr>

    ))}
    
    
  </tbody>
</table>
            </div>
            </div>
       
        </>
    );

}
export default DoctorSpecializations;