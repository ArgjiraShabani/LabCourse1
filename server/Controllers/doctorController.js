const bcrypt=require('bcrypt');
const {createDoctor} = require('../Model/doctorModel');
const {getDocPasswordById,updateDoctorById,getAllDoctors,
    deleteDoctor,getDoctorById,getStaff
}=require('../Model/doctorModel');
const {getPatientAppointments} =require('../Model/patientModel');
const { json } = require('body-parser');



const createDoctorHandler=async(req,res)=>{
    try{
  const{
  first_name,
  last_name,
  email,
  password,
  phone,
  role_id,
  date_of_birth,
  gender_id,
  specialization_id,
  department_Id,
  education
 }=req.body;
  const hashedPassword=await bcrypt.hash(password,13);
  const doctorData={
    first_name,
      last_name,
      email,
      password: hashedPassword,
      phone,
      role_id,
      date_of_birth,
      gender_id,
      specialization_id,
      department_Id,
      education,
      image_path: req.file ? req.file.filename : null,
  };
  createDoctor(doctorData,(err,data)=>{
    if(err){
        console.error("Db inserton error",err);
        return res.status(500).json({error: err.message});
    }
    console.log("Insertion successful:",data);
    return res.json("Doctor has been successfully created");
  });

}catch(error){
  console.error("Server error:", error);
  return res.status(500).json({error: "Internal server error"});
 };
};

const updateDoctorHandler=(req,res)=>{
    const doctorId=req.params.doctor_id;

    getDocPasswordById(doctorId,(err,results)=>{
        if(err){
            console.error(err);
            return res.status(500).json({error: "Internal server error"});
        }
        if(results.length===0){
            return res.status(404).json({message: "Doctor not found"});
        }

        const savedPassword=results[0].password;

        const updateDoctor=(hashedPassword)=>{
            const doctorData={
                first_name: req.body.first_name,                            
                last_name: req.body.last_name,
                email: req.body.email,
                password: hashedPassword,
                phone: req.body.phone,
                role_id: req.body.role_id,
                date_of_birth: req.body.date_of_birth,
                gender_id: req.body.gender_id,
                specialization_id: req.body.specialization_id,
                department_Id: req.body.department_Id,
                education: req.body.education,
                image_path: req.file? req.file.filename: req.body.image_path,
            };

            updateDoctorById(doctorId,doctorData,(err,results)=>{
                if(err){
                    console.error(err);
                    return res.status(500).json({error: "Internal server error"});
                }
                if(results.affectedRows===0){
                    return res.status(404).json({message: "Doctor not found"});

                }
                return res.json("Doctor has been updated successfully");
            });
        };
        if(req.body.password && req.body.password.trim()!==""){
            bcrypt.hash(req.body.password,13,(err,hashed)=>{
                if(err){
                    console.error(err);
                    return res.status(500).json({error: "Internal server error"});
                }
                updateDoctor(hashed);
            });
        }else{
            updateDoctor(savedPassword);
        }
    });
};

const getAllDoctorsHandlers=(req,res)=>{
    getAllDoctors((err,results)=>{
        if(err){
            console.error('Database error:',err);
            return res.status(500).json({error: 'Database error'});
        }
        res.json(results);
    });
};

const deleteDoctorHandler=(req,res)=>{
    const doctorId=req.params.doctor_id;

    deleteDoctor(doctorId,(err,result)=>{
        if(err){
            console.error("Database error:",err);
            return res.status(500).json({error: "Database error"});
        }
        if(result.affectedRows===0){
            return res.status(404).json({message: "Doctor not found"});
        }
        res.json({message: "Doctor deleted successfully"});
    });
};

const getDoctorByIdHandler=(req,res)=>{
    const doctorId=req.params.doctor_id;

    getDoctorById(doctorId,(err,results)=>{
        if(err){
            console.error("Database error:" , err);
            return res.status(500).json({error: "Database error"});
        }
        if(results.length===0){
            return res.status(404).json({message: "Doctor not found"});
        }
        res.json(results[0]);
    });
};

const getAppointments=(req,res)=>{
    const doctorId=req.params.doctor_id;
    getPatientAppointments(doctorId,(err,results)=>{
        if(err){
            return res.status(500).json({error: "Database error"});
        }
        res.json({patients: results});
    });
};
const getStaffHandler=(req,res)=>{
    getStaff((err,results)=>{
        if(err){
            console.error('Database error:',err);
            return res.status(500).json({error: 'Database error'});
        }
        res.json(results);
    });
};






module.exports={
    createDoctorHandler,
    updateDoctorHandler,
    getAllDoctorsHandlers,
    deleteDoctorHandler,
    getDoctorByIdHandler,
    getAppointments,
    getStaffHandler,
    
};
  
