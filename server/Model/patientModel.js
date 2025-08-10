const { callbackPromise } = require('nodemailer/lib/shared');
const db=require('../db');
const { param } = require('../Routes/doctorRoutes');

const getPatientAppointments=(doctorId,callback)=>{
    const query=`SELECT a.appointment_id,p.patient_id,p.first_name,p.last_name
        FROM patients p inner join appointments a
        on p.patient_id=a.patient_id inner join doctors d
        on d.doctor_id=a.doctor_id
        WHERE a.status='completed' and d.doctor_id=?;`

        db.query(query,[doctorId],callback);

};

const getPatientById=(patientId,callback)=>{
    const sql=`SELECT * from patients left join gender
     on patients.gender_id=gender.gender_id left join blood 
     on patients.blood_id=blood.blood_id where patients.patient_id = ?`;
     db.query(sql,[patientId],callback);
};

const getAllPatients=(callback)=>{
    const sql=`SELECT patients.image_path,patients.patient_id,patients.first_name,patients.last_name,patients.email,patients.phone,patients.date_of_birth,gender.gender_name,status.status_name
     FROM patients left join gender
     on patients.gender_id=gender.gender_id left join status
     on patients.status_id=status.status_id`;

     db.query(sql,callback);
};

const deletePatientById=(id,callback)=>{
    const sql=`DELETE from patients where patient_id=?`;
    db.query(sql,id,callback);
};

const removePhoto=(id,callback)=>{
    const sql='UPDATE patients set image_path= NULL where patient_id=?';
    db.query(sql,id,callback);
};

const getOldPassword=(params,callback)=>{
    const sql='SELECT patients.password,patients.first_name FROM patients WHERE patients.password=? AND patients.patient_id=?';
    db.query(sql,params,callback);
};

const changePassword=(params,callback)=>{
    const sql='UPDATE patients SET patients.password=? WHERE patients.patient_id=?';
    db.query(sql,params,callback);
};

const getImagePath=(id,callback)=>{
    const sql='select image_path from patients where patients.patient_id=?';
    db.query(sql,id,callback);
};

const getGender=(gender_name,callback)=>{
    const sql='select gender_id from gender where gender_name=?';
    db.query(sql,gender_name,callback);
};

const getBlood=(blood,callback)=>{
    const sql='select blood_id from blood where blood_type=?';
    db.query(sql,blood,callback);
};

const updatePatient=(params,callback)=>{
    const sql='UPDATE patients SET first_name=?,last_name=?,phone=?,date_of_birth=?,gender_id=?,blood_id=?,image_path=? WHERE patient_id=?';
    db.query(sql,params,callback);
};

const getPatient=(id,callback)=>{
    const sql='SELECT * from patients inner join gender on patients.gender_id=gender.gender_id inner join blood on patients.blood_id=blood.blood_id where patients.patient_id = ?';
    db.query(sql,id,callback);
};

const getEmail=(email,callback)=>{
    const sql=`SELECT email FROM patients WHERE email = ?
                UNION
                SELECT email FROM doctors WHERE email = ?
                UNION
                SELECT email FROM admin WHERE email = ?`;
    
    db.query(sql,email,callback);
};

const getStatus=(status,callback)=>{
    const sql='select status_id from status where status_name=?';
    db.query(sql,status,callback);
};

 const getRole=(roleName,callback)=>{
    const sql=`select role_id from roles where role_name=?`;
    db.query(sql,roleName,callback);
 };


 const registerPatient=(params,callback)=>{
    const sql=`insert into patients(first_name,last_name,email,password,phone,role_id,date_of_birth,gender_id,blood_id,status_id,image_path)value(?, ?, ?, ?, ?, ?, ?, ?, ?, ?,?)`;
    db.query(sql,params,callback);
 };

const setFeedbacks=(params,callback)=>{
    const sql='INSERT INTO feedbacks (feedback_text,patient_id)VALUES (?, ?)';
    db.query(sql,params,callback);
};

const getFeedbacksPatient=(id,callback)=>{
    const sql='Select feedback_text,created_at,feedback_id from feedbacks where patient_id=?';
    db.query(sql,id,callback);
};

const deleteFeedback=(id,callback)=>{
    const sql='DELETE FROM feedbacks WHERE feedback_id=?';
    db.query(sql,id,callback);
};

const getPatientForUpdation=(id,callback)=>{
    const sql='Select p.first_name,p.last_name,p.email,p.phone,p.date_of_birth,p.gender_id from patients p left join gender g on p.gender_id=g.gender_id where p.patient_id=?';
    db.query(sql,id,callback);
};

const updatePatientAdmin=(params,callback)=>{
    const sql='UPDATE patients SET first_name=?,last_name=?,email=?,phone=?,date_of_birth=?,gender_id=? WHERE patient_id=?';
    db.query(sql,params,callback);

};

module.exports={
    getPatientAppointments,
    getPatientById,
    getAllPatients,
    deletePatientById,
    removePhoto,
    getOldPassword,
    changePassword,
    getImagePath,
    getGender,
    getBlood,
    updatePatient,
    getPatient,
    getEmail,
    getStatus,
    getRole,
    registerPatient,
    setFeedbacks,
    getFeedbacksPatient,
    deleteFeedback,
    getPatientForUpdation,
    updatePatientAdmin,

}