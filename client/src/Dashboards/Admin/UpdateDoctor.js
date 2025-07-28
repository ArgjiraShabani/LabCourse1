import Sidebar from "../../Components/AdminSidebar";
import { useState,useEffect } from "react";
import { IoEyeOff,IoEye } from "react-icons/io5";

import Axios from 'axios';
import { data, useLocation,useNavigate } from "react-router-dom";
import * as yup from 'yup';
import {yupResolver} from '@hookform/resolvers/yup';
import {useForm} from "react-hook-form";
import Swal from "sweetalert2";
import withReactContent from 'sweetalert2-react-content';
const UpdateDoctor=()=>{

     const schema = yup.object().shape({
        first_name: yup.string().required("First name is required"),
        last_name: yup.string().required("Last name is required"),
        gender_id: yup.number().typeError("Gender is required").required(),
        date_of_birth: yup.date().required("Date of birth is required"),
        phone: yup.string().required("Phone is required"),
        specialization_id: yup.number().typeError("Specialization is required").required(),
        department_Id: yup.number().typeError("Department is required").required(),
        email: yup.string().email("Invalid email").required("Email is required"),
        password: yup.string().transform((value)=>(value===""? undefined: value)).notRequired().min(8,"Password must be at least 8 characters").max(20).nullable(),
        role_id: yup.number().typeError("Role is required").required(),
        education: yup.string().required()
    });
    const navigate=useNavigate();  

    const swal=withReactContent(Swal);



        
        
  
    const [img,setImg]=useState(null);
    const[role,setRole]=useState([]);
    const[gender,setGender]=useState([]);
    const[specialization,setSpecialization]=useState([]);
    const[department,setDepartment]=useState([]);
    
    const location=useLocation();
    const doctorId=location.pathname.split("/")[2];
    const {register,handleSubmit,formState: {errors},reset}=useForm({
            resolver: yupResolver(schema)
        });
    const[show,setShow]=useState(false);
    const handleClick=()=>{
        setShow(!show);
    }
    
    
    useEffect(()=>{
        Axios.get(`http://localhost:3001/api/doctorId/${doctorId}`)
        .then((response)=>{
            const data=response.data;
            console.log("Fetched data:",data);
            reset({
                first_name: data.first_name,
                last_name: data.last_name,
                email: data.email,
                password: "",
                phone: data.phone,
                role_id: Number(data.role_id),
                date_of_birth: data.date_of_birth?data.date_of_birth.slice(0,10): "",
                gender_id: Number(data.gender_id),
                specialization_id: Number(data.specialization_id),
                department_Id: Number(data.department_Id),
                education: data.education
                
                 
            });
            setImg(data.image_path);
        })
        .catch((error)=>{
            console.log("Error fetching the doctor",error);
        });
        
    },[doctorId,role,gender,specialization,department,reset]);

    useEffect(()=>{
        Axios.get('http://localhost:3001/api/roles').then((response)=>{
            setRole(response.data);
        })
    },[]);
    useEffect(()=>{
        Axios.get('http://localhost:3001/api/gender').then((response)=>{
            setGender(response.data);
        })

    },[]);
    useEffect(()=>{
        Axios.get('http://localhost:3001/api/specializations').then((response)=>{
            setSpecialization(response.data);
        })
    },[]);
    useEffect(()=>{
        Axios.get('http://localhost:3001/api/departments').then((response)=>{
            setDepartment(response.data);
        })
    },[]);

    const update= async (formValues)=>{
        
     try{
        
        const data= new FormData();
        const formattedValues = {
        ...formValues,
        date_of_birth: new Date(formValues.date_of_birth).toISOString().split('T')[0], 
        };
        Object.entries(formattedValues).forEach(([key,value])=>{
            data.append(key,value);
        });
        if(img){
            data.append("img",img);
        }
        const response=await
        Axios.put(`http://localhost:3001/api/updateDoctors/${doctorId}`,data);
        
            await swal.fire({
            title: "Success!",
            text: "Your form was updated successfully.",
            icon: "success",
            confirmButtonText: "OK",});
           
             navigate("/viewDoctors");
        

        }
    catch(error){
            console.log("Error adding doctor:",error);
           
           await swal.fire({
                title: "Error!",
                text: "Something went wrong.",
                icon: "error",
                confirmButtonText: "OK",
            });
       
       
        
    }
};
    
    
        
    
   
    
   
    return(
        <>
        <div style={{display: "flex",minHeight: "100vh"}}>
            <div style={{width: "250px"}}>
                <Sidebar role="admin"/>
            </div>
            <div style={{
                flexGrow: 1,
                display: "flex",
                justifyContent: "center",
                alignItems: "center",                
                padding:"40px",
                marginBottom:"20px",
                maxWidth: "1500px",
                width: "100%"}}>
                
                <form onSubmit={handleSubmit(update) } className="needs-validation">
                    <div className="row">
                        <div className="col-md-6">
                            <div className="mb-3">
                                <label htmlFor="first_name" className="form-label">First Name:</label>
                                <input type="text" className={`form-control w-100 ${errors.first_name?'is-invalid': ''}`} id="first_name" aria-describedby="name"
                                name="first_name" {...register("first_name")} placeholder="First Name"/>
                                {errors.first_name && (
                                    <div className="invalid-feedback">{errors.first_name.message}</div>
                                )}
                            
                            </div>
                            <div className="mb-3">
                                <label htmlFor="last_name" className="form-label">Last Name:</label>
                                <input type="text" className={`form-control w-100 ${errors.last_name?'is-invalid': ''}`} id="last_name" aria-describedby="lastname"
                                name="last_name" {...register("last_name")} placeholder="Last Name"/>
                                {errors.last_name && (
                                    <div className="invalid-feedback">{errors.last_name.message}</div>
                                )}
                            
                                                        </div>
                            <div className="mb-3">
                                <label htmlFor="gender" className="form-label">Gender:</label>
                                <select name="gender_id" id="gender" className={`form-control w-100 ${errors.gender_id?'is-invalid': ''}`} aria-describedby="gender"
                                {...register("gender_id",{ valueAsNumber: true })} placeholder="Gender"
                                >
                                    <option value="">Select gender</option>
                                    {gender.map(g=>(
                                        <option key={`gender-${g.gender_id}`} value={g.gender_id}>{g.gender_name}</option>
                                    ))}
                                </select>
                                 {errors.gender_id && (
                                    <div className="invalid-feedback">{errors.gender_id.message}</div>
                                )}
                                    
                            
                            </div>

                            <div className="mb-3">
                                <label htmlFor="date_of_birth" className="form-label">Date of birth:</label>
                                <input type="date" className={`form-control w-100 ${errors.date_of_birth?'is-invalid': ''}`} id="date_of_birth" aria-describedby="date_of_birth"
                                name="date_of_birth" {...register("date_of_birth")}/>
                                 {errors.date_of_birth && (
                                    <div className="invalid-feedback">{errors.date_of_birth.message}</div>
                                )}
                            </div>
                        
                           
                            <div className="mb-3">
                                <label htmlFor="phone" className="form-label">Phone Number:</label>
                                <input type="text" className={`form-control w-100 ${errors.phone?'is-invalid': ''}`} id="phone" aria-describedby="phone"
                               name="phone" {...register("phone")} placeholder="Phone Number"/>
                            {errors.phone && (
                                    <div className="invalid-feedback">{errors.phone.message}</div>
                                )}
                            </div>
                           <div className="mb-3">
                                <label htmlFor="img" className="form-label">Upload image:</label>
                                <input type="file" className="form-control w-100 " id="img" aria-describedby="img"
                                name="img" onChange={(e)=>{
                                    setImg( e.target.files[0]);
                                }}/>
                                {img && (
                                    <div style={{ marginTop: '8px', fontSize: '0.9em', color: '#555'} }>
                                        Current image path: {img}
                                    </div>
                                )}
                                
                            
                            </div>
                    </div>
                    
                    
                    <div className="col-md-6">
                        <div className="mb-3">
                                <label htmlFor="education" className="form-label">Education</label>
                                <input type="education" className={`form-control w-100 ${errors.email?'is-invalid': ''}`} id="education" aria-describedby="education"
                               name="education" {...register("education")} placeholder="Education"/>
                            {errors.education && (
                                    <div className="invalid-feedback">{errors.education.message}</div>
                                )}
                            </div>
                    <div className="mb-3">
                        <label htmlFor="specialization" className="form-label">Specialization:</label>
                        <select name="specialization_id" id="specialization" className={`form-control w-100 ${errors.specialization_id?'is-invalid': ''}`} aria-describedby="specialization"
                        {...register("specialization_id",{ valueAsNumber: true })}>
                            <option value="">Select Specialization</option>
                            {specialization.map(s=>(
                                <option key={`specialization-${s.specialization_id}`} value={s.specialization_id}>{s.specialization_name}</option>
                            ))}
                        </select>
                        {errors.specialization_id && (
                                    <div className="invalid-feedback">{errors.specialization_id.message}</div>
                                )}
                        
                       
                    </div>
                    <div className="mb-3">
                        <label htmlFor="department" className="form-label">Department:</label>
                        <select name="department_Id" id="department" className={`form-control w-100 ${errors.department_Id?'is-invalid': ''}`} aria-describedby="department"
                        {...register("department_Id",{ valueAsNumber: true })}>
                            <option value="">Select Department</option>
                            {department.map(d=>(
                                <option key={`department-${d.department_Id}`} value={d.department_Id}>{d.department_name}</option>
                            ))}
                        </select>
                        {errors.department_Id && (
                                    <div className="invalid-feedback">{errors.department_Id.message}</div>
                                )}
                        
                       
                    </div>
                    <div className="mb-3">
                                <label htmlFor="email" className="form-label">Email address</label>
                                <input type="email" className={`form-control w-100 ${errors.email?'is-invalid': ''}`} id="email" aria-describedby="email"
                               name="email" {...register("email")} placeholder="Email"/>
                            {errors.email && (
                                    <div className="invalid-feedback">{errors.email.message}</div>
                                )}
                            </div>
                            <div className="mb-3" style={{ position: "relative" }}>
                                                            <label htmlFor="password" className="form-label">Password</label>
                                                            <input type={show? "text": "password"} className={`form-control w-100 ${errors.password?'is-invalid': ''}`} id="password"
                                                           name="password" {...register("password")} placeholder="Password"
                                                           style={{paddingRight: '40px'}}
                                                           />
                                                           <span onClick={handleClick} 
                                                           style={{position: 'absolute',
                                                           top: '50%',
                                                           right: '12px',
                                                           transform: 'translateY(-50%)',
                                                            cursor: 'pointer',color: '#888',zIndex: 1}}>{show? <IoEye/>: <IoEyeOff />}</span>
                                                           
                                                            {errors.password && (
                                                                <div className="invalid-feedback">{errors.password.message}</div>
                                                            )}
                                                        </div>
                            <div className="mb-3">
                            <label htmlFor="role" className="form-label">Role:</label>
                            <select name="role_id" id="role" className={`form-control w-100 ${errors.role_id?'is-invalid': ''}`} aria-describedby="role"
                            {...register("role_id",{ valueAsNumber: true })} >
                                <option value="">Select role</option>
                                {role.map(r=>(
                                    <option key={`role-${r.role_id}`} value={r.role_id}>{r.role_name}</option>
                                ))}
                                
                        </select>
                         {errors.role_id && (
                                    <div className="invalid-feedback">{errors.role_id.message}</div>
                                )}
                        
                       
                    </div>
                    
                    
                    
                    </div>
                    <button type="submit" className="btn btn-primary" style={{backgroundColor: '#51A485',width: '100%'}}
                     >Update doctor</button>
                    </div>
                </form>
            </div>
        </div>
        
</>

    );

};
export default UpdateDoctor;