import  axios  from "axios";
import { useState ,useEffect } from "react";
import Swal from "sweetalert2";
import Navbar from "../Components/Navbar";


 

function ForgotPassword(){

    const[email, setEmail]=useState("");
    const [loading, setLoading]=useState(false);

    const handleSubmit=async(e)=>{
        e.preventDefault();
        setLoading(true);
        try{
            const res=await axios.post("http://localhost:3001/api/forgotPassword",{email});
            setLoading(false);
            Swal.fire({
                icon: "success",
                title: "Email Sent!",
                text: res.data.message,
                confirmButtonColor: "#51A485",
      });
      setEmail("");
        }catch(err){
            setLoading(false);
            Swal.fire({
                icon: "error",
                title: "Oops...",
                text: err.response?.data?.message || "Something went wrong",
                confirmButtonColor: "#51A485",
      });
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
                        <button type="submit" className="w-100" style={{backgroundColor:"#51A485",borderColor:"white",height:"50px",color:"white",borderRadius:"7px"}}
                        disabled={loading}
                        >
                            {loading?(
                                <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                            ):(
                                "Send Reset Link"

                            )}
                            </button>
                        
                    </div>
                    
                  
                    </form>
                </div>
        </div>

        </>
    );
}

export default ForgotPassword;