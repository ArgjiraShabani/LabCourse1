const bcrypt=require('bcrypt');
const {createDoctor} = require('../Model/doctorModel');
const {getDocPasswordById,updateDoctorById,getAllDoctors,
    deleteDoctor,getDoctorById,getStaff,getAllActiveDoctors,getAllPatients, getAppointmentNumber, updateMyProfile,
    getImagePathByDoctorId
}=require('../Model/doctorModel');
const db=require('../db');

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

 const emailCheck=`SELECT email from patients where email=?
 union select email from admin where email=?`;
 db.query(emailCheck,[email,email],async(err,results)=>{
    if (err) {
        console.error("Error checking email existence:", err);
        return res.status(500).json({ error: "Database error while checking email." });
      }

      if (results.length > 0) {
        return res.status(400).json({ error: "Email already exists in the system." });
      }

 
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
const updateMyProfileHandler = (req, res) => {
  const doctor_id = req.user.id;
  let image_path;

  if (req.file) {
    image_path = `${req.file.filename}`;
    proceedUpdate();
  } else {
    
    getImagePathByDoctorId(doctor_id, (err, results) => {
      if (err) {
        console.error("Database error:", err);
        return res.status(500).json({ error: "Database error" });
      }

      if (results.length === 0) {
        return res.status(404).json({ error: "Profile not found." });
      }

      image_path = results[0].image_path; // use existing image path
      proceedUpdate();
    });
  }

  function proceedUpdate() {
    const doctorData = {
      first_name: req.body.first_name,
      last_name: req.body.last_name,
      email: req.body.email,
      phone: req.body.phone,
      date_of_birth: req.body.date_of_birth,
      gender_id: req.body.gender_id,
      specialization_id: req.body.specialization_id,
      department_Id: req.body.department_Id,
      education: req.body.education,
      image_path: image_path
    };

    updateMyProfile(doctor_id, doctorData, (err, result) => {
      if (err) {
        console.error("Database error:", err);
        return res.status(500).json({ error: "Database error" });
      }

      if (result.affectedRows === 0) {
        return res.status(404).json({ error: "Profile not found." });
      }

      res.json({ message: "Profile updated successfully" });
    });
  }
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
        res.json({message: "Doctor deactivated successfully"});
    });
};

const getDoctorByIdHandler=(req,res)=>{
    const doctorId=req.user.id;

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
const getDoctorByIdAdminHandler=(req,res)=>{
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


const getPatientAppointments=(doctorId,callback)=>{
    
    const query=`
     SELECT a.appointment_id, p.patient_id, p.first_name, p.last_name,r.result_id,
    CASE 
        WHEN r.appointment_id IS NOT NULL THEN 1
        ELSE 0
    END AS hasPrescription
    FROM appointments a
    JOIN patients p ON p.patient_id=a.patient_id
    LEFT JOIN results r
    ON r.appointment_id=a.appointment_id AND r.doctor_id=a.doctor_id
    WHERE a.status= 'completed' AND a.doctor_id=?
    GROUP BY a.appointment_id,p.patient_id,p.first_name,
    p.last_name,r.result_id;
    `;
    db.query(query,[doctorId],callback);


};

const getAppointments=(req,res)=>{
    const doctorId=req.user.id;

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

const getAllActiveDoctorsHandler = (req, res) => {
  getAllActiveDoctors((err, doctors) => {
    if (err) {
      console.error("Error while fetching doctors:", err.message);
      return res.status(500).json({ error: "Error while fetching doctors" });
    }
    res.json(doctors);
  });
};

const getAllPatientsHandler=(req,res)=>{
    const doctorId= req.user.id;
    getAllPatients(doctorId,(err,results)=>{
        if(err){
            console.error('Database error:',err);
            return res.status(500).json({error: 'Database error'});
        }
        if (!results || results.length === 0) {
      
      return res.status(404).json({ error: 'Doctor not found or no patients' });
    }
        const {first_name,last_name, total_patients}=results[0];
        res.json({first_name,last_name,total_patients});
    });
}
const getAppointmentNumberHandler=(req,res)=>{
    const doctorId=req.user.id;
    getAppointmentNumber(doctorId,(err,results)=>{
        if(err){
            console.error('Database error:',err);
            return res.status(500).json({error: 'Database error'});
        }
        const {total_appointments }=results[0];
        res.json({total_appointments });
    });
}


module.exports={
    createDoctorHandler,
    updateDoctorHandler,
    getAllDoctorsHandlers,
    deleteDoctorHandler,
    getDoctorByIdHandler,
    getAppointments,
    getStaffHandler,
    getAllActiveDoctorsHandler,
    getDoctorByIdAdminHandler,
    getAllPatientsHandler,
    getAppointmentNumberHandler,
    updateMyProfileHandler,
    
    
};
  
