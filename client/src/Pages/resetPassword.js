import  axios  from "axios";
import { useState ,useEffect } from "react";
import { useParams , useNavigate} from "react-router-dom";
import Swal from "sweetalert2";





 

function ResetPassword(){

    const navigate=useNavigate();

   const {token}=useParams();
   const [password,setPassword]=useState("");
   const [confirm,setConfirm]=useState("");
   const [message,setMessage]=useState("");

   const handleSubmit=async(e)=>{
    e.preventDefault();
    if(password!==confirm){
        setMessage("Passwords do not match");
        return;
    }
    try{
        const res=await axios.post(`http://localhost:3001/api/resetPassword/${token}`,{password});
          await Swal.fire({
      icon: 'success',
      title: 'Password Reset Successful',
      text: res.data.message || 'Your password has been updated.',
      timer: 2500,
      showConfirmButton: false
    });
    navigate('/login')
   
    }catch(err){
        Swal.fire({
      icon: 'error',
      title: 'Error',
      text: err.response?.data?.message || 'Something went wrong. Try again.',
    });
    }
   };

 

   

    return(
        <>
        
        <hr style={{color:"#51A485"}}/>
       <div className="d-flex justify-content-center align-items-center " style={{marginTop:"100px"}}>
                <div className="p-5 rounded bg-white" style={{ width: '100%', maxWidth: '650px',borderStyle:"solid",borderColor:"white", boxShadow: '0 4px 20px rgba(0, 0, 0, 0.2)',marginBottom:""}}>
                    <form onSubmit={handleSubmit} >
                    <h3 className="text-center mb-4">Reset Password</h3>
                     
                    <div className="mb-3">
                        <label>New Password:</label>
                        <input 
                        type="password" 
                        name='password' 
                        value={password}
                        onChange={(e)=>setPassword(e.target.value)}
                        placeholder="New Password"
                        className="form-control"
                        required
                       
                        /></div>
                         <div className="mb-3">

                        <label>Confirm Password:</label>
                        <input
                        type="password"
                        value={confirm}
                        onChange={(e)=>setConfirm(e.target.value)}
                        placeholder="Confirm Password"
                        className="form-control"
                        required/>
                        
                    </div>
                    
                   
                
                    <div className="mb-3">
                        <button type="submit" className="w-100" style={{backgroundColor:"#51A485",borderColor:"white",height:"50px",color:"white",borderRadius:"7px"}}>Reset Password</button>
                        
                    </div>
                    <p>{message}</p>
                  
                    </form>
                </div>
        </div>

        </>
    );
}

export default ResetPassword;