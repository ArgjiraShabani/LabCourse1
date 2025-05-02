import  axios  from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import Navbar from "../Components/Navbar";


function Login(){
    const [values,setValues]=useState({
        email:'',
        password:''
    });

    const navigate=useNavigate();

    const handleSubmit=(event)=>{
        event.preventDefault();
        axios.post('http://localhost:3001/login',values).then(res=>{
            if(res.data.message==='Success'){
                if(res.data.role==='doctor'){
                    navigate(`/doctordashboard`);
                }else if(res.data.role==='patient'){
                    navigate(`/patientdashboard/${res.data.id}`)
                }else{
                    navigate(`/adminDashboard`);
                }
               
            }else{
                alert("No record existed!");
            }
        })
        .catch(err=>console.log(err));

    }
    const handleInput=(event)=>{
        setValues(prev=>({...prev,[event.target.name]:event.target.value}))
    }

    return(
        <>
        <Navbar/>
        <hr style={{color:"#51A485"}}/>
       <div className="d-flex justify-content-center align-items-center vh-100">
                <div className="p-5 rounded bg-white" style={{ width: '100%', maxWidth: '550px',borderStyle:"solid",borderColor:"white", boxShadow: '0 4px 20px rgba(0, 0, 0, 0.5)',marginBottom:"300px"}}>
                    <form onSubmit={handleSubmit}>
                    <h3 className="text-center mb-4">Login</h3>
                    <div className="mb-3">
                        <label>Email:</label>
                        <input 
                        type="text" 
                        onChange={handleInput} 
                        name='email' 
                        className="form-control" 
                        />
                    </div>
                    <div className="mb-3">
                        <label>Password:</label>
                        <input 
                        type="password" 
                        onChange={handleInput} 
                        name='password' 
                        className="form-control" 
                        />
                    </div>
                    <div className="mb-3">
                        <button type="submit" className="w-100" style={{backgroundColor:"#51A485",borderColor:"white",height:"50px",color:"white",borderRadius:"7px"}}>LOGIN</button>
                    </div>
                    <p className="text-right">
                        Forgot <a href=''>Password?</a> | <a href="">Register</a>
                    </p>
                    </form>
                </div>
        </div>

        </>
    );
}

export default Login;