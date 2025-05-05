import Sidebar from "../../Components/AdminSidebar";
import { useState,useEffect } from "react";
import Axios from 'axios';
const AdminDoctor=()=>{

    const [formData, setFormData] = useState({
        first_name: '',
        last_name: '',
        gender: '',
        phone: '',
        specialization_id: '',
        department_id: '',
        email: '',
        password: '',
        role_id: '',
    });
    const [options,setOptions]=useState({
        specializations: [],
        departments: [],
        roles: []
    });
    useEffect(()=>{
        const fetchOptions=async()=>{
            try{
                const [spectRes,depRes,roleRes]=await Promise.all([
                    fetch('http://localhost:3001/specializations'),
                    fetch('http://localhost:3001/departments'),
                    fetch('http://localhost:3001/roles')
                ]);
                setOptions({
                    specializations: await spectRes.json(),
                    departments: await depRes.json(),
                    roles: await roleRes.json()
                });
            }catch(error){
                console.error('Error fetching options:', error);
            }
        };
        fetchOptions();
        

    },[]);
    const handleChange=(e)=>{
        setFormData({...formData,[e.target.name]: e.target.value});
    };
    const handleSubmit= async(e)=>{
        e.preventDefault();

        try{
            const response=await fetch('http://localhost:3001/insertDoctor',{
                method: 'POST',
                headers:{
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    userData: {
                        first_name: formData.first_name,
                        last_name: formData.last_name,
                        email: formData.email,
                        password: formData.password,
                        phone: formData.phone,
                        role_id: formData.role_id,

                    },
                    doctorData: {
                        specialization_id: formData.specialization_id,
                        department_id: formData.department_id,
                        gender: formData.gender
                    }
                }),
            });
            if(response.ok){
                alert('Doctor added successfully!');

                setFormData({
                    first_name: '',
                    last_name: '',
                    gender: '',
                    phone: '',
                    specialization_id: '',
                    department_id: '',
                    email: '',
                    password: '',
                    role_id: '',
                });
            }else{
                alert('Failed to add doctor.');
            }
        }catch(error){
            console.log('Fetch error: ',error);
            alert('Something went wrong.');
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
                
                <form onSubmit={handleSubmit}>
                    <div className="row">
                        <div className="col-md-6">
                            <div className="mb-3">
                                <label htmlFor="first_name" className="form-label">Name:</label>
                                <input type="text" className="form-control w-100" id="first_name" aria-describedby="name"
                                name="first_name" value={formData.first_name} onChange={handleChange}/>
                            
                            </div>
                            <div className="mb-3">
                                <label htmlFor="last_name" className="form-label">Last Name:</label>
                                <input type="text" className="form-control w-100" id="last_name" aria-describedby="lastname"
                                name="last_name" value={formData.last_name} onChange={handleChange}/>
                            
                            </div>
                            <div className="mb-3">
                                <label htmlFor="gender" className="form-label">Gender:</label>
                                <select name="gender" id="gender" className="form-control w-100" aria-describedby="specialization"
                                value={formData.gender} onChange={handleChange} >
                                    <option value={"Female"}>Female</option>
                                    <option value={"Male"}>Male</option>
                                    <option value={"Other"}>Other</option>
                                </select>
                                    
                            
                            </div>
                        
                           
                            <div className="mb-3">
                                <label htmlFor="phone" className="form-label">Phone Number:</label>
                                <input type="text" className="form-control w-100" id="phone" aria-describedby="phone"
                               name="phone" value={formData.phone} onChange={handleChange}/>
                            
                            </div>
                            <div className="mb-3">
                                <label htmlFor="img" className="form-label">Upload image:</label>
                                <input type="file" className="form-control w-100" id="img" aria-describedby="emailHelp"
                                />
                                
                            
                            </div>
                    </div>
                    
                    <div className="col-md-6">
                    <div className="mb-3">
                        <label htmlFor="specialization" className="form-label">Specialization:</label>
                        <select name="specialization_id" id="specialization" className="form-control w-100" aria-describedby="specialization"
                        value={formData.specialization_id} onChange={handleChange} >
                            <option value="">Select Specialization</option>
                            {options.specializations.map(s=>(
                                <option key={s.specialization_id} value={s.specialization_id}>{s.specialization_name}</option>
                            ))}
                        </select>
                        
                       
                    </div>
                    <div className="mb-3">
                        <label htmlFor="department" className="form-label">department:</label>
                        <select name="department_id" id="department" className="form-control w-100" aria-describedby="department"
                        value={formData.department_id} onChange={handleChange} >
                            <option value="">Select department</option>
                            {options.departments.map(d=>(
                                <option key={d.department_id} value={d.department_id}>{d.department_name}</option>
                            ))}
                        </select>
                        
                       
                    </div>
                    <div className="mb-3">
                                <label htmlFor="email" className="form-label">Email address</label>
                                <input type="email" className="form-control w-100" id="email" aria-describedby="email"
                               name="email" value={formData.email} onChange={handleChange}/>
                            
                            </div>
                            <div className="mb-3">
                                <label htmlFor="password" className="form-label">Password</label>
                                <input type="password" className="form-control w-100" id="password"
                               name="password" value={formData.password} onChange={handleChange}/>
                            </div>
                            <div className="mb-3">
                            <label htmlFor="role" className="form-label">Role:</label>
                            <select name="role_id" id="role" className="form-control w-100" aria-describedby="role"
                            value={formData.role_id} onChange={handleChange} >
                                <option value="">Select role</option>
                                {options.roles.map(r=>(
                                    <option key={r.role_id} value={r.role_id}>{r.role_name}</option>
                                ))}
                                
                        </select>
                        
                       
                    </div>
                    
                    
                    
                    </div>
                    <button type="submit" className="btn btn-primary" style={{backgroundColor: '#51A485',width: '100%'}}
                    onClick={handleSubmit}>Add a doctor</button>
                    </div>
                </form>
            </div>
        </div>
        
</>

    );
};
export default AdminDoctor;