import  axios  from "axios";
import { useState ,useEffect } from "react";
import { useParams , useNavigate} from "react-router-dom";
import Swal from "sweetalert2";
import {yupResolver} from "@hookform/resolvers/yup"
import * as yup from "yup";
import { useForm } from "react-hook-form";




 const schema =yup.object().shape({
      
        password:yup.string()
                    .required("Password is required!")
                    .min(8,"Password must be at least 8 characters")
                    .max(15,"Password must be maximum 15 characters!")
                    .matches(/[a-z]/, "Password must contain at least one lowercase letter")
                    .matches(/[A-Z]/, "Password must contain at least one uppercase letter")
                    .matches(/[^a-zA-Z0-9]/, "Password must contain at least one symbol")
                    .matches(/[0-9]/,"Password must contain at least a number!"),
        confirmedPassword: yup.string()
            .required('Confirm password is required!')
            .oneOf([yup.ref('password'), null], 'Passwords must match!'), 
      
        
           
    });
 

function ResetPassword(){

    const navigate=useNavigate();

   const {token}=useParams();
   const [password,setPassword]=useState("");
   const [confirm,setConfirm]=useState("");
   const [message,setMessage]=useState("");

   const {register,handleSubmit, formState: {errors},}=useForm({
    resolver: yupResolver(schema),
   });

   const onSubmit=async(data)=>{
    
   
    try{
        const res=await axios.post(`http://localhost:3001/api/resetPassword/${token}`,{password: data.password});
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
                    <form onSubmit={handleSubmit(onSubmit)} >
                    <h3 className="text-center mb-4">Reset Password</h3>
                     
                    <div className="mb-3">
                        <label>New Password:</label>
                        <input 
                        type="password" 
                        name='password' 
                       
                        {...register("password")}
                        placeholder="New Password"
                        className="form-control"
                        required
                       
                        />{errors.password && <p className="text-danger">{errors.password.message}</p>}</div>
                         <div className="mb-3">

                        <label>Confirm Password:</label>
                        <input
                        type="password"
                        {...register("confirmedPassword")}
                        placeholder="Confirm Password"
                        className="form-control"
                        required/>
                        {errors.confirmedPassword && <p className="text-danger">{errors.confirmedPassword.message}</p>}
                        
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