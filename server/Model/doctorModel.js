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

const getAllDoctors=(callback)=>{
    const sqlGet=` SELECT d.doctor_id,d.first_name,
    d.last_name,
    d.email,
    d.password,
    d.phone,
    r.role_name,
    d.date_of_birth,
    g.gender_name,
  s.specialization_name,
  dep.department_name ,
  d.education
  FROM doctors d inner join roles r on d.role_id=r.role_id
   inner join gender g on d.gender_id=g.gender_id
    inner join specialization s on d.specialization_id=s.specialization_id
   inner join departments dep on d.department_id=dep.department_id`;
   db.query(sqlGet,callback);
};
const deleteDoctor=(doctorId,callback)=>{
    const sqlDel="DELETE FROM doctors WHERE doctor_id=?";
    db.query(sqlDel,[doctorId],callback);
};

const getDoctorById=(doctorId,callback)=>{
    const sql=`SELECT d.doctor_id,d.first_name,
  d.last_name,
  d.email,
  d.password,
  d.phone,
  d.role_id,
  r.role_name,
  d.date_of_birth,
  d.gender_id,
  g.gender_name,
  d.specialization_id,
s.specialization_name,
d.department_Id,
dep.department_name,
d.education,
d.image_path
FROM doctors d inner join roles r on d.role_id=r.role_id
 inner join gender g on d.gender_id=g.gender_id
  inner join specialization s on d.specialization_id=s.specialization_id
 inner join departments dep on d.department_Id=dep.department_Id
 WHERE d.doctor_id=?
 `;

 db.query(sql,[doctorId],callback);
};





module.exports={
    createDoctor,
    getDocPasswordById,
    updateDoctorById,
    getAllDoctors,
    deleteDoctor,
    getDoctorById,
    
};