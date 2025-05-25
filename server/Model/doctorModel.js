const db=require('../db');

const createDoctor=(doctorData,callback)=>{
    const q=`INSERT INTO doctors (first_name,last_name,email,password
    ,phone,role_id,date_of_birth,gender_id,specialization_id ,department_Id,education,image_path) VALUES(?,?,?,?,?,?,?,?,?,?,?,?)`;

    const values=[
  doctorData.first_name,
  doctorData.last_name,
  doctorData.email,
  doctorData.password,
  doctorData.phone,
  doctorData.role_id,
  doctorData.date_of_birth,
  doctorData.gender_id,
  doctorData.specialization_id,
  doctorData.department_Id,
  doctorData.education,
  doctorData.image_path || null,
 ];
 db.query(q,values,(err,data)=>{
    callback(err,data);
 });
};

const getDocPasswordById=(doctorId,callback)=>{
    const query="Select password FROM doctors WHERE doctor_id=?";
    db.query(query,[doctorId],callback);

};

const updateDoctorById=(doctorId,doctorData,callback)=>{
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
        education,
        image_path,

    }=doctorData;

    const query=`UPDATE  doctors SET first_name=?,last_name=?,email=?,password=?,phone=?,role_id=?,
  date_of_birth=?,gender_id=?,specialization_id=?,department_Id=?,
  education=?,image_path=?  WHERE doctor_id=?`;

   const values=[
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
        education,
        image_path,
        doctorId

   ];

   db.query(query,values,callback);
};


module.exports={
    createDoctor,
    getDocPasswordById,
    updateDoctorById,
    
};