import  axios  from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import Navbar from "../Components/Navbar";
import {useForm} from "react-hook-form";
import {yupResolver} from "@hookform/resolvers/yup"
import * as yup from "yup";

 const schema =yup.object().shape({
        email:yup.string().email("Email must be a valid email").required("Email is required!"),
        password:yup.string().min(8,"Password must be at least 8 characters").max(15)
                    .required("Password is required!")
    });

function Login(){
   const [errorMessage, setErrorMessage] = useState("");
    const {register,handleSubmit,formState: { errors}}=useForm({
        resolver:yupResolver(schema),
    });

    const navigate=useNavigate();
   
       const submitForm = (event) => {
  axios.post('http://localhost:3001/login', event).then(res => {
    if (res.data.message === 'Success') {
    
      localStorage.setItem("role", res.data.role);

      if (res.data.role === 'doctor') {
        localStorage.setItem("doctor_id", res.data.id);
        navigate(`/doctordashboard`);
      } else if (res.data.role === 'patient') {
        localStorage.setItem("patient_id", res.data.id);
        //navigate(`/patientdashboard/${res.data.id}`);
        navigate(`/${res.data.id}`)
      } else {
      localStorage.setItem("admin_id", res.data.id);
        navigate(`/adminDashboard/${res.data.id}`);
      }

    } else {
      setErrorMessage("Incorrect email or password!");
    }
  })
  .catch(err => console.log(err));
};

    return(
        <>
        <Navbar/>
        <hr style={{color:"#51A485"}}/>
       <div className="d-flex justify-content-center align-items-center " style={{marginTop:"100px"}}>
                <div className="p-5 rounded bg-white" style={{ width: '100%', maxWidth: '650px',borderStyle:"solid",borderColor:"white", boxShadow: '0 4px 20px rgba(0, 0, 0, 0.2)',marginBottom:""}}>
                    <form onSubmit={handleSubmit(submitForm)}>
                    <h3 className="text-center mb-4">Login</h3>
                     {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
                    <div className="mb-3">
                        <label>Email:</label>
                        <input 
                        type="text" 
                        name='email' 
                        className="form-control"
                        {...register("email")} 
                        />
                        <p style={{color:"red"}}>{errors.email?.message}</p>
                    </div>
                    
                    <div className="mb-3">
                        <label>Password:</label>
                        <input 
                        type="password" 
                        name='password' 
                        className="form-control" 
                        {...register("password")}
                        />
                        <p style={{color:"red"}}>{errors.password?.message}</p>
                    </div>
                
                    <div className="mb-3">
                        <button type="submit" className="w-100" style={{backgroundColor:"#51A485",borderColor:"white",height:"50px",color:"white",borderRadius:"7px"}}>LOGIN</button>
                    </div>
                    <p className="text-right">
                        Forgot <a href=''>Password?</a> | <Link to="/signUp">Sign Up</Link>
                    </p>
                    </form>
                </div>
        </div>

        </>
    );
}

export default Login;