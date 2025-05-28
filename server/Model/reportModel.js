const db=require('../db');

const createReport=(patientId,reportData,callback)=>{

    const {
        
        doctor_id,
        appointment_id,
        symptoms,
        alergies,
        diagnose,
        result_text,
        attachment,
    }=reportData;
    const sql=`INSERT INTO results (patient_id,doctor_id,appointment_id,symptoms,alergies,diagnose,
    result_text,attachment) VALUES (?,?,?,?,?,?,?,?) `;

    const values=[
        patientId,
       doctor_id,
        appointment_id,
        symptoms,
        alergies,
        diagnose,
        result_text,
        attachment,
        

    ];
    db.query(sql,values,callback);
};

module.exports={createReport};