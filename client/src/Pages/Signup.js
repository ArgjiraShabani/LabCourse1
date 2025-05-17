import Navbar from "../Components/Navbar";
import { Link, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { set } from "react-hook-form";
import {useForm} from "react-hook-form";
import {yupResolver} from "@hookform/resolvers/yup"
import * as yup from "yup";
//import { parse, isDate, differenceInYears,isValid,isFuture } from 'date-fns';
import { useNavigate } from "react-router-dom";
import Swal from 'sweetalert2';



 const schema =yup.object().shape({
        name:yup.string().required("Firstname is required!")
         .matches(/^\S+$/, "Firstname cannot contain spaces!"),
        lastname:yup.string().required("Lastname is required!")
         .matches(/^\S+$/, "Firstname cannot contain spaces!"),
        email:yup.string().email("Email must be a valid email").required("Email is required!"),
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
        phoneNumber: yup.string()
            .required('Phone number is required!')
            .matches(/^\+?(\d{1,4})?[\s\(\)-]?\(?\d{1,4}\)?[\s\(\)-]?\d{1,4}[\s\(\)-]?\d{1,4}$|^0\d{8,12}$/,"Phone number must be a valid number!")
             .min(8, "Phone number must be at least 8 digits")
             .max(15, "Phone number cannot be longer than 15 digits"),
        
        gender: yup
                .string()
                .required("Gender is required!"),
        
         blood: yup
               .string()
               .required("Blood is required!"),

      birth: yup
        .string()
        .test('is-valid-date', 'Date is required!', value => value !== "" && !isNaN(Date.parse(value)))
        .transform(value => value === "" ? null : value) // Convert empty string to null
        .required("Date is required!")
         .test("max-date", "Date cannot be in the future!", (value) => {
            const parsedDate = new Date(value);
            return parsedDate <= new Date(); // Check if the parsed date is not in the future
        }),
                
    });

function SignUp(){
    const [gender,setGender]=useState([]);
    const [blood,setBlood]=useState([]);
    const [error,setError]=useState("");
    const navigate=useNavigate();
    const {register,handleSubmit,formState: { errors}}=useForm({
            resolver:yupResolver(schema),
        });



  useEffect(()=>{
    axios.get('http://localhost:3001/blood').then((response)=>{
      setBlood(response.data);
    })
  },[]);
    useEffect(()=>{
        axios.get('http://localhost:3001/gender').then((response)=>{
            setGender(response.data);
        }).catch(error => {
            console.error("Error:", error);
          });
    },[]);

    function formSubmit(event){
        axios.post("http://localhost:3001/signup",event).then((response)=>{
         if(response){
            setError(response.data);
            if(response.data===""){
                 Swal.fire({
                                position: "center",
                                icon: "success",
                                title: "You are successfully registered!\nNow please login!",
                                showConfirmButton: false,
                                timer: 3300
                                });
               navigate('/login');
            }
         }
     }).catch(error => {
            console.error("Error:", error);
          });
    }


    return(
        
        <>
            <Navbar/>
            <hr style={{color:"#51A485"}}/>
       <div className="d-flex justify-content-center align-items-center ">
                <div className="p-5 rounded bg-white" style={{ width: '100%', maxWidth: '550px',borderStyle:"solid",borderColor:"white", boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)',marginBottom:"10px"}}>
                    <form onSubmit={handleSubmit(formSubmit)}>
                    <h3 className="text-center mb-4">Sign Up</h3>
                  {error && <p style={{ color: 'red' }}>{error}</p>}
                    <div className="mb-3">
                        <label>Firstname:</label>
                        <input type="text" name='name' className="form-control" {...register("name")}/>
                        <p style={{color:"red"}}>{errors.name?.message}</p>
                    </div>
                     <div className="mb-3">
                        <label>Lastname:</label>
                        <input type="text" name='lastname' className="form-control" {...register("lastname")}/>
                        <p style={{color:"red"}}>{errors.lastname?.message}</p>

                    </div>
                    <div className="mb-3">
                        <label>Email:</label>
                        <input type="email" name='email' className="form-control"{...register("email")} />
                        <p style={{color:"red"}}>{errors.email?.message}</p>
                    </div>
                    <div className="mb-3">
                        <label>Password:</label>
                        <input type="password" name='password' className="form-control"{...register("password")}/>
                        <p style={{color:"red"}}>{errors.password?.message}</p>
                    </div>
                     <div className="mb-3">
                        <label>Confirme Password:</label>
                        <input type="password" name='confirmedPassword' className="form-control" {...register("confirmedPassword")}/>
                         <p style={{color:"red"}}>{errors.confirmedPassword?.message}</p>

                    </div>
                     <div className="mb-3">
                        <label>Date of Birth:</label>
                        <input type="date" name='birth' className="form-control"{...register("birth")}/>
                    <p style={{color:"red"}}>{errors.birth?.message}</p>

                    </div>
                    <div className="mb-3">
                        <label>Phone Number</label>
                        <input type="text" name='phoneNumber' className="form-control"{...register("phoneNumber")} />
                        <p style={{color:"red"}}>{errors.phoneNumber?.message}</p>
                    </div>
                     <div className="mb-3">
                        <label>Gender:</label>
                        <select className="form-control" name="gender" {...register("gender")}>
                            <option value="" disabled selected>Choose Gender</option>
                            {gender.map((value,key)=>{
                                return(
                                <option key={key}>{value.gender_name}</option>
                                )
                            })}
                        </select>
                        <p style={{color:"red"}}>{errors.gender?.message}</p>

                    </div>
                    <div className="mb-3">
                     <label>Blood:</label>
                    <select className="form-control" name="blood" {...register("blood")}>
                       <option value="" disabled selected>Blood</option>
                        {blood.map((value,key)=>{
                            return(
                            <option key={key}>{value.blood_type}</option>
                            )
                        })}
                    </select>
                     <p style={{color:"red"}}>{errors.blood?.message}</p>

                   </div>
                
                    <div className="mb-3">
                        <button type="submit" className="w-100" style={{backgroundColor:"#51A485",borderColor:"white",height:"50px",color:"white",borderRadius:"7px"}}>SIGNUP</button>
                    </div>
                    
                    </form>
                </div>
        </div>
        </>
    )
}

export default SignUp;