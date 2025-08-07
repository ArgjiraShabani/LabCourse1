import {useForm} from "react-hook-form";
import {yupResolver} from "@hookform/resolvers/yup"
import * as yup from "yup";
import Swal from 'sweetalert2';
import axios from "axios";
import { useState } from "react";


 const schema =yup.object().shape({
       oldPassword:yup.string("Old Password is required!")
                     .required("Password is required!")
                    .min(8,"Password must be at least 8 characters")
                    .max(15,"Password must be maximum 15 characters!")
                    .matches(/[a-z]/, "Password must contain at least one lowercase letter")
                    .matches(/[A-Z]/, "Password must contain at least one uppercase letter")
                    .matches(/[^a-zA-Z0-9]/, "Password must contain at least one symbol")
                    .matches(/[0-9]/,"Password must contain at least a number!"),
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

 

function UpdatePassword({id,info,setInfo}){
     const {register,handleSubmit,formState: { errors},reset}=useForm({
                resolver:yupResolver(schema),
            });
      const [error,setError]=useState("");

     function changePassword(event){
        event.id=id;
        axios.patch('http://localhost:3001/patient/changePassword',event,{
             withCredentials: true
         }).then((response)=>{
            if(response.data==='Changed'){
                 Swal.fire({
                       position: "center",
                       icon: "success",
                       title: "Your Password is updated!",
                       showConfirmButton: false,
                       timer: 1200
                                          });
                    reset();
                    setError("");
            }else{
            setError(response.data);
            }
        }).catch((error)=>{
            console.log(error);
        })






            };

    return(
     <>
        
            <div style={{marginTop:"5px",borderStyle:"solid",padding:"60px 110px",borderRadius:'10px',borderWidth:'1px',borderColor:"white",   boxShadow: '0 4px 20px rgba(0, 0, 0, 0.2)'}}>
          <h1 style={{textAlign:"center",marginBottom:"40px"}}>Change Password</h1>
          <form className="mt-4" onSubmit={handleSubmit(changePassword)}>
            <p style={{color:"red",fontSize:"17px"}}>{error}</p>
              <div className="mb-3">
                        <label>Old Password:</label>
                        <input type="password" name='oldPassword' className="form-control"{...register("oldPassword")}/>
                        <p style={{color:"red"}}>{errors.oldPassword?.message}</p>
                         
                    </div>
                 <div className="mb-3">
                        <label>New Password:</label>
                        <input type="password" name='password' className="form-control"{...register("password")}/>
                        <p style={{color:"red"}}>{errors.password?.message}</p>
                    </div>
                     <div className="mb-3">
                        <label>Confirme Password:</label>
                        <input type="password" name='confirmedPassword' className="form-control" {...register("confirmedPassword")}/>
                         <p style={{color:"red"}}>{errors.confirmedPassword?.message}</p>

                    </div>
                         <button type="submit" className="w-100" style={{backgroundColor:"#51A485",borderColor:"white",height:"50px",color:"white",borderRadius:"7px"}}>CHANGE</button>

            </form>
            </div>
          </>
    )
};

export default UpdatePassword;