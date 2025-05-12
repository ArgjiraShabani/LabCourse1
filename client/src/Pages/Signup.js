import Navbar from "../Components/Navbar";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { set } from "react-hook-form";

function SignUp(){
    const [gender,setGender]=useState([]);

    useEffect(()=>{
        axios.get('http://localhost:3001/gender').then((response)=>{
            setGender(response.data);
        }).catch(error => {
            console.error("Error:", error);
          });
    },[]);
    return(
        
        <>
            <Navbar/>
            <hr style={{color:"#51A485"}}/>
       <div className="d-flex justify-content-center align-items-center ">
                <div className="p-5 rounded bg-white" style={{ width: '100%', maxWidth: '550px',borderStyle:"solid",borderColor:"white", boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)',marginBottom:"10px"}}>
                    <form>
                    <h3 className="text-center mb-4">Sign Up</h3>

                    <div className="mb-3">
                        <label>Firstname:</label>
                        <input type="text" name='name' className="form-control"/>
                    </div>
                     <div className="mb-3">
                        <label>Lastname:</label>
                        <input type="text" name='lastname' className="form-control"/>
                    </div>
                    <div className="mb-3">
                        <label>Email:</label>
                        <input type="email" name='email' className="form-control" />
                    </div>
                    <div className="mb-3">
                        <label>Password:</label>
                        <input type="password" name='password' className="form-control" />
                    </div>
                     <div className="mb-3">
                        <label>Confirmed Password:</label>
                        <input type="password" name='confirmedPassword' className="form-control" />
                    </div>
                     <div className="mb-3">
                        <label>Birth:</label>
                        <input type="date" name='birth' className="form-control" />
                    </div>
                    <div className="mb-3">
                        <label>Phone Number</label>
                        <input type="text" name='phoneNumber' className="form-control" />
                    </div>
                     <div className="mb-3">
                        <label>Gender:</label>
                        <select className="form-control">
                            <option disabled selected>Choose Gender</option>
                            {gender.map((value,key)=>{
                                return(
                                <option key={key}>{value.gender_name}</option>
                                )
                            })}
                        </select>
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