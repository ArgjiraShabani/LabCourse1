import React, { useEffect, useState } from "react";
import Sidebar from "../../Components/AdminSidebar";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Swal from 'sweetalert2';
import {useForm} from "react-hook-form";
import {yupResolver} from "@hookform/resolvers/yup"
import * as yup from "yup";


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
        /*confirmedPassword: yup.string()
            .required('Confirm password is required!')
            .oneOf([yup.ref('password'), null], 'Passwords must match!'), */
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
        status:yup.string().required("Status is required!"),

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


function Register(){
   
    const navigate=useNavigate();
    const [gender,setGender]=useState([]);
    const [blood,setBlood]=useState([]);
    const [status,setStatus]=useState([]);
    const [error,setError]=useState("");
    const [info,setInfo]=useState({
        name:"",
        lastname:"",
        email:"",
        password:"",
        number:"",
        birth:"",
        gender:"",
        blood:"",
        status:"",
        file:""

    });


     const {register,handleSubmit,formState: { errors},getValues}=useForm({
                 resolver:yupResolver(schema),
             });
     

     useEffect(()=>{
    axios.get('http://localhost:3001/gender').then((response)=>{
      setGender(response.data);
    })
  },[]);
   useEffect(()=>{
    axios.get('http://localhost:3001/blood').then((response)=>{
      setBlood(response.data);
    })
  },[]);
  useEffect(()=>{
        axios.get("http://localhost:3001/status").then((response)=>{
            setStatus(response.data);
        })
    },[]);
    const formSubmit=(e)=>{

        const formdata=new FormData();

                const file = getValues("file");
                if (file && file.length > 0) {
                formdata.append("image", file[0]);
                }
            formdata.append("first_name", e.name);
            formdata.append("last_name", e.lastname);
            formdata.append("email", e.email);
            formdata.append("password", e.password);
            formdata.append("number", e.number);
            formdata.append("birth", e.birth);
            formdata.append("gender", e.gender);
            formdata.append("blood", e.blood);
            formdata.append("status", e.status);
        
         axios.post("http://localhost:3001/registerPatient",formdata).then(res=>{
             if(res){
            setError(res.data);
             }
             if(res.data===""){ 
            Swal.fire({
                position: "center",
                icon: "success",
                title: "The patient is successfully registered!",
                showConfirmButton: false,
                timer: 2000
                });
                navigate(`/registerPatient`);
            }
        }).catch(err=>{

           console.log(err);
             Swal.fire({
                position: "center",
                icon: "error",
                title: "Patient is not registered!Please check again!",
                showConfirmButton: false,
                timer: 1500
                });
        });
    }
    

    return (
        <>
        <div style={{display:"flex"}}>
            <Sidebar role={"doctor"}/>
            <div className="container mt-5">
                <h2 style={{textAlign:"center",marginBottom:"50px"}}>Register Patient</h2> 
                <form   className="mt-4" onSubmit={handleSubmit(formSubmit)} style={{borderRadius:'10px',borderWidth:'1px',borderColor:"white",boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)',padding:"50px",margin:"50px"}}>
                 {error && <p style={{ color: 'red' }}>{error}</p>}

                    <div className="mb-3">
                    <label htmlFor="name" className="form-label">Firstname:</label>
                    <input type="text" name="name" className="form-control" {...register("name")}/>
                     <p style={{color:"red"}}>{errors.name?.message}</p>
                    </div>
                    <div className="mb-3">
                    <label  className="form-label" >Lastname:</label>
                    <input type="text" name="lastname" className="form-control" {...register("lastname")}/>
                    <p style={{color:"red"}}>{errors.lastname?.message}</p>
                    </div>
                    <div className="mb-3">
                    <label htmlFor="email" className="form-label" >Email:</label>
                    <input type="email" name="email" className="form-control"{...register("email")} />
                    <p style={{color:"red"}}>{errors.email?.message}</p>
                     </div>
                    <div className="mb-3">
                    <label htmlFor="email" className="form-label" >Password:</label>
                    <input type="password" name="password" className="form-control" {...register("password")} />
                     <p style={{color:"red"}}>{errors.password?.message}</p>
                    </div>
                     <div className="mb-3">
                    <label htmlFor="email" className="form-label">Phone Number:</label>
                    <input type="text" name="phoneNumber" className="form-control" {...register("phoneNumber")} />
                    <p style={{color:"red"}}>{errors.phoneNumber?.message}</p>
                    </div>
                    <div className="mb-3">
                    <label  className="form-label">Birthday:</label>
                    <input type="date" name="birth" className="form-control" {...register("birth")} onFocus={(e) => e.target.showPicker && e.target.showPicker()} />
                    <p style={{color:"red"}}>{errors.birth?.message}</p>            
                    </div>
                    <div className="mb-3">
                    <label htmlFor="photo" className="form-label">Upload Photo:</label>
                     <input type="file" name="file" className="form-control" {...register("file")} />                     </div>
                    <div style={{display:"flex",justifyContent:"space-between",flexWrap:"wrap"}}>
                    <div className="mb-3">
                    <select className="form-control" name="gender" {...register("gender")}>
                        <option value="" disabled selected>Gender</option>
                        {gender.map((value,key)=>{
                            return(
                            <option key={key}>{value.gender_name}</option>
                            )
                        })}
                    </select>
                   <p style={{color:"red"}}>{errors.gender?.message}</p>             
                    </div>
                    <div className="mb-3">
                    <select className="form-control" name="blood" {...register("blood")}  >
                       <option value="" disabled selected>Blood</option>
                        {blood.map((value,key)=>{
                            return(
                            <option key={key} >{value.blood_type}</option>
                            )
                        })}
                    </select>
                     <p style={{color:"red"}}>{errors.blood?.message}</p>                
                   </div>
                   <div className="mb-3">
                    <select className="form-control" name="status" {...register("status")} >
                        <option value="" disabled selected>Status</option>
                         {status.map((value,key)=>{
                            return(
                            <option key={key}>{value.status_name}</option>
                            )
                        })}
                    </select>
                    <p style={{color:"red"}}>{errors.status?.message}</p>
                   </div>
                   </div>
                  <button type="submit" className="form-control" style={{backgroundColor:"#51A485",color:"white",height:"50px"}}>Register</button>

                </form>
            </div>
    </div>
    </>
  );
};

export default Register;
