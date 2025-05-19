
import { useState,useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import * as yup from "yup";
import {useForm} from "react-hook-form";
import {yupResolver} from "@hookform/resolvers/yup";
import Info from "./UserInfo";
import MyProfile from "../Pages/MyProfile";


const schema =yup.object().shape({
 name:yup.string().required("Firstname is required!")
 .matches(/^\S+$/, "Firstname cannot contain spaces!"),
        lastname:yup.string().required("Lastname is required!")
        .matches(/^\S+$/, "Lastname cannot contain spaces!"),
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


function UpdateProfile({id}){
  const [info,setInfo]=useState({
    first_name: "",
    last_name: "",
    phone: "",
    date_of_birth: "",
    gender_name: "",
    blood_type: "",
    file:""
  });
  
  const {register,handleSubmit,formState: { errors},setValue,
    reset,getValues}=useForm({
              resolver:yupResolver(schema),
          });
  useEffect(() => {
    if (info.first_name && info.last_name) {
      reset({
        name: info.first_name,
        lastname: info.last_name,
        phoneNumber: info.phone,
        birth: info.date_of_birth,
        gender: info.gender_name,
        blood: info.blood_type,
        file:info.file
      });
    }
  }, [info, reset]);

  const navigate=useNavigate();
  
  const [gender,setGender]=useState([]);
  const [blood,setBlood]=useState([]);
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
      axios.get(`http://localhost:3001/infoPatient/${id}`).then((response)=>{
        const dateOfBirth = response.data.date_of_birth.split("T")[0];
        response.data.date_of_birth = dateOfBirth;
          setInfo(response.data);

      })
  },[id]);


  if (!info) {
    return <p>Loading...</p>;
  }
   

  const formSubmit=(data)=>{
    const formdata=new FormData();

    const file = getValues("file");
    if (file && file.length > 0) {
      formdata.append("image", file[0]);
    }
      formdata.append("first_name",data.name);
      formdata.append("last_name",data.lastname);
      formdata.append("phone",data.phoneNumber);
      formdata.append("date_of_birth",data.birth);
      formdata.append("gender_name",data.gender);
      formdata.append("blood_type",data.blood);
       Swal.fire({
            title: "Are you sure about updating your data?",
            showCancelButton: true,
            confirmButtonColor: "#51A485",
            cancelButtonColor: "#d33",
            confirmButtonText: "Update"
            }).then((result) => {
            if (result.isConfirmed) {
                 axios.put(`http://localhost:3001/updatePatient/${id}`,formdata)
                  .then(res=>{
                      const updated = res.data;
                        updated.date_of_birth = updated.date_of_birth.split("T")[0]; // format date
                        <Info re={info}/>
                        setInfo(res.data); // ✅ This updates the shared state in pa
                    
                  })
                  .catch(err=>console.log(err));
                
                Swal.fire({
                position: "center",
                icon: "success",
                title: "Your data have been updated!",
                showConfirmButton: false,
                timer: 1100
                });
            }else{
                reset({
                name: info.first_name,
                lastname: info.last_name,
                phoneNumber: info.phone,
                birth: info.date_of_birth ? info.date_of_birth.split("T")[0] : "", // Make sure the date is formatted
                gender: info.gender_name,
                blood: info.blood_type,
                file: info.file // Ensure the file field is also reset
              });
            }
            });
   
  }


  return(
    <>
            <div style={{marginTop:"20px",borderStyle:"solid",padding:"60px 90px",borderRadius:'10px',borderWidth:'1px',borderColor:"white",   boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)'}}>
          <h1 style={{textAlign:"center",marginBottom:"40px"}}>Update Profile</h1>
          <form className="mt-4" onSubmit={handleSubmit(formSubmit)}>
            <div className="mb-3" style={{marginBottom:"20px"}}>
              <label>Firstname:</label><br/>
              <input className="form-control" type="text" name="name" {...register("name")}  style={{width:'300px',height:"40px"}}/>
              <p style={{color:"red"}}>{errors.name?.message}</p>

            </div>
            <div style={{marginBottom:"20px"}}>
              <label >Lastname:</label><br/>
              <input className="form-control" type="text" name="lastname" {...register("lastname")}  style={{width:'300px',height:"40px"}}/>
              <p style={{color:"red"}}>{errors.lastname?.message}</p>

            </div>
            <div style={{marginBottom:"20px"}}>
              <label>Phone Number:</label><br/>
                <input className="form-control" type="text" name="phoneNumber" {...register("phoneNumber")}  style={{width:'300px',height:"40px"}}/>
                <p style={{color:"red"}}>{errors.phoneNumber?.message}</p>

             </div>
            <div style={{marginBottom:"20px"}}>
              <label>Birthday:</label><br/>
              <input className="form-control" type="date" name="birth" {...register("birth")} onFocus={(e) => e.target.showPicker && e.target.showPicker()}   style={{width:'300px',height:"40px"}}/>
              <p style={{color:"red"}}>{errors.birth?.message}</p>

            </div>
             <div style={{marginBottom:"20px"}}>
              <label>Photo:</label><br/>
              <input className="form-control" type="file" name="file" style={{width:'300px',height:"40px"}} {...register("file")}/>

            </div>
            <div style={{marginBottom:"20px"}}>
              <label>Gender:</label><br/>
              <select  className="form-control" name="gender" {...register("gender")}  style={{width:"300px",height:"40px"}}>
              {gender.map((value,key)=>{
                return(
                <option key={key}>{value.gender_name}</option>
                )
              })}
              </select>
            <p style={{color:"red"}}>{errors.gender?.message}</p>

            </div>
            <div style={{marginBottom:"20px"}}>
              <label>Blood Type:</label><br/>
              <select  className="form-control" name="blood" {...register("blood")} onChange={e=>setInfo({...info,blood_type:e.target.value})} style={{width:"300px",height:"40px"}}>
              {blood.map((value,key)=>{
                return(
                <option key={key}>{value.blood_type}</option>
                )
              })}
              </select>
             <p style={{color:"red"}}>{errors.blood?.message}</p>

            </div>

            <div style={{marginBottom:"10px"}}>
              <button  className="form-control" type="submit"  style={{width:"300px",borderColor:"#51A485",backgroundColor:"#51A485",height:"50px",color:"white"}}>UPDATE</button>
            </div>
            
          </form>
        </div>

    </>
  )
}

export default UpdateProfile;