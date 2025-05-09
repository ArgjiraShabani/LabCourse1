import Sidebar from "../../Components/AdminSidebar";
import { useState,useEffect } from "react";
import Axios from 'axios';
import { useLocation } from "react-router-dom";
const UpdateDoctor=()=>{



    const [formData, setFormData] = useState({
        first_name: '',
        last_name: '',
        email: '',
        password: '',
        phone: '',
        role_id: '',
        date_of_birth: '',
        gender_id: '',
        specialization_id: '',
        department_Id: '',
        image_path: ''
        
        
    });
    const [options,setOptions]=useState({
        specializations: [],
        departments: [],
        roles: [],
        gender: []
    });
    const location=useLocation();

    const update=(e)=>{
        e.preventDefault();
        Axios.put('http://localhost:3001/updateDoctors/:id',formData)
        .then((response)=>{
            console.log("Doctor added:",response.data);
        })
        .catch((error)=>{
            console.log("Error adding doctor:",error);
        });
        setFormData({
            first_name: '',
            last_name: '',
            email: '',
            password: '',
            phone: '',
            role_id: '',
            date_of_birth: '',
            gender_id: '',
            specialization_id: '',
            department_Id: '',
            image_path: ''

        });
    };
    
    
        
    useEffect(()=>{
        const fetchOptions=async()=>{
            try{
                const [spectRes,depRes,roleRes,genderRes]=await Promise.all([
                    fetch('http://localhost:3001/specializations'),
                    fetch('http://localhost:3001/departments'),
                    fetch('http://localhost:3001/roles'),
                    fetch('http://localhost:3001/gender')
                ]);
                setOptions({
                    specializations: await spectRes.json(),
                    departments: await depRes.json(),
                    roles: await roleRes.json(),
                    gender: await genderRes.json()
                });
            }catch(error){
                console.error('Error fetching options:', error);
            }
        };
        fetchOptions();
        

    },[]);
    
   
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
                
                <form >
                    <div className="row">
                        <div className="col-md-6">
                            <div className="mb-3">
                                <label htmlFor="first_name" className="form-label">Name:</label>
                                <input type="text" className="form-control w-100" id="first_name" aria-describedby="name"
                                name="first_name" value={formData.first_name} onChange={(e)=>{
                                    setFormData({...formData,first_name: e.target.value});
                                }}/>
                            
                            </div>
                            <div className="mb-3">
                                <label htmlFor="last_name" className="form-label">Last Name:</label>
                                <input type="text" className="form-control w-100" id="last_name" aria-describedby="lastname"
                                name="last_name" value={formData.last_name} onChange={(e)=>{
                                    setFormData({...formData,last_name: e.target.value});
                                }}/>
                            
                            </div>
                            <div className="mb-3">
                                <label htmlFor="gender" className="form-label">Gender:</label>
                                <select name="gender_id" id="gender" className="form-control w-100" aria-describedby="gender"
                                value={formData.gender_id}
                                onChange={(e)=>{
                                    setFormData({...formData,gender_id: parseInt(e.target.value)});
                                }} >
                                    <option value="">Select gender:</option>
                                    {options.gender.map(g=>(
                                        <option key={g.gender_id} value={g.gender_id}>{g.gender_name}</option>
                                    ))}
                                </select>
                                    
                            
                            </div>

                            <div className="mb-3">
                                <label htmlFor="date_of_birth" className="form-label">Date of birth:</label>
                                <input type="date" className="form-control w-100" id="date_of_birth" aria-describedby="date_of_birth"
                                name="date_of_birth" value={formData.date_of_birth} onChange={(e)=>{
                                    setFormData({...formData,date_of_birth: e.target.value});
                                }}/>
                            
                            </div>
                        
                           
                            <div className="mb-3">
                                <label htmlFor="phone" className="form-label">Phone Number:</label>
                                <input type="text" className="form-control w-100" id="phone" aria-describedby="phone"
                               name="phone" value={formData.phone} onChange={(e)=>{
                                setFormData({...formData,phone: e.target.value});
                            }}/>
                            
                            </div>
                           <div className="mb-3">
                                <label htmlFor="img" className="form-label">Upload image:</label>
                                <input type="text" className="form-control w-100" id="img" aria-describedby="emailHelp"
                                name="image_path" value={formData.image_path} onChange={(e)=>{
                                    setFormData({...formData,image_path: e.target.value});
                                }}/>
                                
                            
                            </div>
                    </div>
                    
                    <div className="col-md-6">
                    <div className="mb-3">
                        <label htmlFor="specialization" className="form-label">Specialization:</label>
                        <select name="specialization_id" id="specialization" className="form-control w-100" aria-describedby="specialization"
                        value={formData.specialization_id} onChange={(e)=>{
                            setFormData({...formData,specialization_id: parseInt(e.target.value)});
                        }}>
                            <option value="">Select Specialization</option>
                            {options.specializations.map(s=>(
                                <option key={s.specialization_id} value={s.specialization_id}>{s.specialization_name}</option>
                            ))}
                        </select>
                        
                       
                    </div>
                    <div className="mb-3">
                        <label htmlFor="department" className="form-label">Department:</label>
                        <select name="department_Id" id="department" className="form-control w-100" aria-describedby="department"
                        value={formData.department_Id} onChange={(e)=>{
                            setFormData({...formData,department_Id: e.target.value});
                        }}>
                            <option value="">Select Department</option>
                            {options.departments.map(d=>(
                                <option key={d.department_Id} value={d.department_Id}>{d.department_name}</option>
                            ))}
                        </select>
                        
                       
                    </div>
                    <div className="mb-3">
                                <label htmlFor="email" className="form-label">Email address</label>
                                <input type="email" className="form-control w-100" id="email" aria-describedby="email"
                               name="email" value={formData.email} onChange={(e)=>{
                                setFormData({...formData,email: e.target.value});
                            }}/>
                            
                            </div>
                            <div className="mb-3">
                                <label htmlFor="password" className="form-label">Password</label>
                                <input type="password" className="form-control w-100" id="password"
                               name="password" value={formData.date_of_birth.password} onChange={(e)=>{
                                setFormData({...formData,password: e.target.value});
                            }}/>
                            </div>
                            <div className="mb-3">
                            <label htmlFor="role" className="form-label">Role:</label>
                            <select name="role_id" id="role" className="form-control w-100" aria-describedby="role"
                            value={formData.role_id} onChange={(e)=>{
                                setFormData({...formData,role_id: parseInt(e.target.value)});
                            }} >
                                <option value="">Select role</option>
                                {options.roles.map(r=>(
                                    <option key={r.role_id} value={r.role_id}>{r.role_name}</option>
                                ))}
                                
                        </select>
                        
                       
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