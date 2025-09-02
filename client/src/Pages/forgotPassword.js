import  axios  from "axios";
import { useState ,useEffect } from "react";

import Navbar from "../Components/Navbar";


 

function ForgotPassword(){

    const[email, setEmail]=useState("");
    const[message, setMessage]=useState("");

    const handleSubmit=async(e)=>{
        e.preventDefault();
        try{
            const res=await axios.post("http://localhost:3001/api/forgotPassword",{email});
            setMessage(res.data.message);
        }catch(err){
            setMessage(err.response?.data?.message || "Something went wrong");
        }
    };

 

   

    return(
        <>
        <Navbar/>
        <hr style={{color:"#51A485"}}/>
       <div className="d-flex justify-content-center align-items-center " style={{marginTop:"100px"}}>
                <div className="p-5 rounded bg-white" style={{ width: '100%', maxWidth: '650px',borderStyle:"solid",borderColor:"white", boxShadow: '0 4px 20px rgba(0, 0, 0, 0.2)',marginBottom:""}}>
                    <form onSubmit={handleSubmit} >
                    <h3 className="text-center mb-4">Forgot Password</h3>
                     
                    <div className="mb-3">
                        <label>Email:</label>
                        <input 
                        type="email" 
                        name='email' 
                        value={email}
                        onChange={(e)=>setEmail(e.target.value)}
                        placeholder="Enter your email"
                        className="form-control"
                        required
                       
                        />
                        
                    </div>
                    
                   
                
                    <div className="mb-3">
                        <button type="submit" className="w-100" style={{backgroundColor:"#51A485",borderColor:"white",height:"50px",color:"white",borderRadius:"7px"}}>Send Reset Link</button>
                        
                    </div>
                    <p>{message}</p>
                  
                    </form>
                </div>
        </div>

        </>
    );
}

export default ForgotPassword;