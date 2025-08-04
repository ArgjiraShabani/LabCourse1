import Sidebar from "../../Components/AdminSidebar";
import { useState,useEffect } from "react";
import axios, { Axios } from "axios";
import { FaRegEdit,FaRegEye } from "react-icons/fa";
import { GoTrash } from "react-icons/go";
import Swal from "sweetalert2";
import withReactContent from 'sweetalert2-react-content';

function DoctorSpecializations(){
    const swal=withReactContent(Swal);
    const [specialization,setSpecialization]=useState([]);
    const [specializationName,setSpecializationName]=useState('');
    const [editingId, setEditingId]=useState(null);
    const [editingName, setEditingName]= useState('');

    const confirmDeletion=(specializationId)=>{
        swal.fire({
             title: "Are you sure you want to delete the specialization?",
            text: "This action cannot be undone!",
            icon : "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, delete it!",
            cancelButtonText: "Cancel"
        }).then((result)=>{
            if(result.isConfirmed){
                deleteSpecialization(specializationId);
            }
        });
    }

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
    const deleteSpecialization=(specializationId)=>{
        console.log("delete specialization Id:",specializationId);
        axios.delete(`http://localhost:3001/api/deleteSpecialization/${specializationId}`,{
            withCredentials: true
        }).then(()=>{
            fetchSpecializations();
            swal.fire('Deleted!','Specialization has been deleted.','success');
        }).catch(error=>{
            console.log(error);
            swal.fire('Failed to delete specialization.');
        });
    }

    const handleUpdate=async(id)=>{
        if(!editingName.trim()){
            swal.fire('Error', 'Specialization name cannot be empty.', 'error');
            return;
        }
        try{
            await axios.put(`http://localhost:3001/api/updateSpecialization/${id}`,{
                specialization_name: editingName
            });
            swal.fire('Updated!', 'Specialization has been updated.','success');
            setEditingId(null);
            fetchSpecializations();
        }catch(error){
            console.error("Error updating specialization:", error);
            swal.fire('Error', 'Failed to update specialization.', 'error');
        }
    };

    

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
                    alignItems: "center" // left-align form
                }}
              >
               <div style={{ width: "100%", maxWidth: "900px", display: "flex", justifyContent: "flex-start" }}>
                <div style={{ maxWidth: "400px", width: "100%", marginBottom: "40px" }}>
            <h2 style={{ color: "#51A485", marginBottom: "20px" }}>Add a new specialization</h2>

            <form 
            onSubmit={submitHandler}>
                <label className="form-label">Specialization Name:</label>
                <input type="text"  className="form-control mb-3" placeholder="Add the specialization name"
                value={specializationName}
                onChange={handleChange}/>
                <button type="submit"  className="btn btn-primary" style={{backgroundColor: '#51A485',width: '100%'}}>Add specialization</button>
            </form>
            </div>
            </div>
            
              <div style={{ width: "100%", display: "flex", justifyContent: "center" }}>

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
      <th scope="col" >Specialization Id</th>
      <th scope="col">Specialization Name</th>
      
    </tr>
  </thead>
  <tbody>
    {specialization.map((s)=>(
        <tr key={s.specialization_id}>
        <td >{s.specialization_id}</td>

        <td>
            {editingId===s.specialization_id? (
                <input type="text" value={editingName} onChange={(e)=>setEditingName(e.target.value)}
                className="form-control"/>
            
            ):(
                s.specialization_name
            )}
        </td>
        <td>
            {editingId===s.specialization_id?(
                <>
                <button
                    className="btn btn-sm btn-success me-2"
                    onClick={()=>handleUpdate(s.specialization_id)}
                >
                    Save
                </button>
                <button
                    className="btn btn-sm btn-secondary"
                    onClick={()=>setEditingId(null)}
                >
                    Cancel

                </button>
                </>
            ):(
                <button
            onClick={()=>{
                setEditingId(s.specialization_id);
                setEditingName(s.specialization_name);
            }}
            style={{
                background: 'none',
                border: 'none',
                padding: 0,
                cursor: 'pointer'
            }}>
            <FaRegEdit size={18} color="#51A485" title="Update"/></button>
            )}
        </td>
        
      
        
        <td><button onClick={()=>confirmDeletion(s.specialization_id)}
            style={{
                background: 'none',
                border: 'none',
                padding: 0,
                cursor: 'pointer'
            }}><GoTrash size={18} color="#51A485" title="Delete"/></button></td>

        
      </tr>

    ))}
    
    
  </tbody>
</table>
            </div>
            </div>
            </div>
       
        </>
    );

}
export default DoctorSpecializations;