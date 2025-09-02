import  axios  from "axios";
import { useState ,useEffect } from "react";
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

      useEffect(() => {
    axios.post('http://localhost:3001/logout', {}, { withCredentials: true })
      .then(() => console.log('Auth cookies cleared'))
      .catch(err => console.error('Logout cleanup failed:', err));
  }, []);

   
       const submitForm = (data) => {
          
          axios.post('http://localhost:3001/login', data,{withCredentials:true}).then(res => {
            console.log(res.data)
            if (res.data.message === 'Success') {
              
               const role = res.data.role;
               const id = res.data.id;

              

              if (res.data.role === 'doctor') {
                navigate(`/doctordashboard`);
              } else if (res.data.role === 'patient') {
                navigate(`/homePagePatient`)
              } else {
                navigate(`/adminDashboard`);
              }
            }
          })
              .catch(err => {
          if (err.response && err.response.status === 401) {
            // Login failed
            setErrorMessage(err.response.data.message);
          } else {
            // Other errors
            setErrorMessage("An unexpected error occurred. Please try again.");
            console.log(err);
          }
    });
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
                        <Link to="/forgotPassword">Forgot Password?</Link> | <Link to="/signUp">Sign Up</Link>
                    </p>
                    </form>
                </div>
        </div>

        </>
    );
}

export default Login;