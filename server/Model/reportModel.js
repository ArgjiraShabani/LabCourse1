const db=require('../db');

const createReport=(patientId,reportData,callback)=>{

    const {
        
        doctor_id,
        appointment_id,
        first_name,
        last_name,
        symptoms,
        alergies,
        diagnose,
        result_text,
        attachment,
    }=reportData;
    const sql=`INSERT INTO results (patient_id,doctor_id,appointment_id,first_name,last_name,symptoms,alergies,diagnose,
    result_text,attachment) VALUES (?,?,?,?,?,?,?,?,?,?) `;

    const values=[
        patientId,
       doctor_id,
        appointment_id,
        first_name,
        last_name,
        symptoms,
        alergies,
        diagnose,
        result_text,
        attachment,
        

    ];
    db.query(sql,values,callback);
};

const getReport=(patientId,doctorId, appointmentId,callback)=>{
    const query=`SELECT result_id,result_text,attachment,symptoms,alergies,diagnose,first_name,last_name
    FROM results WHERE patient_id=? AND doctor_id=? AND appointment_id=?`;
    db.query(query,[patientId,doctorId,appointmentId], callback);
}

const getReportById=(resultId,callback)=>{
    const query=`SELECT result_id,result_text,attachment,symptoms,alergies,diagnose,first_name,last_name
    FROM results WHERE result_id=?`;
    db.query(query,[resultId],callback);
}



const deleteReport=(resultId,callback)=>{
    const query=`DELETE FROM results WHERE result_id=?`;
    db.query(query,[resultId],(err,results)=>{
        callback(err,results);
    });
}

const updateReport=(resultId, reportData, callback)=>{
    const{
        first_name,
        last_name,
        symptoms,
        alergies,
        diagnose,
        result_text,
        attachment
    }=reportData;

    let query, values;

    if(attachment!=undefined){
        query= `UPDATE results SET first_name=?,last_name=?,symptoms=?,
alergies=?,diagnose=?, result_text=?, attachment=? WHERE  result_id=? `;

    values=[
        first_name,
        last_name,
        symptoms,
        alergies,
        diagnose,
        result_text,
        attachment,
        resultId

    ];

    }else{
        query= `UPDATE results SET first_name=?,last_name=?,symptoms=?,
alergies=?,diagnose=?, result_text=? WHERE  result_id=? `;


values=[
        first_name,
        last_name,
        symptoms,
        alergies,
        diagnose,
        result_text,
        resultId

    ];



    }
    

   
    db.query(query, values, callback);
};

module.exports={createReport,getReport, deleteReport, updateReport, getReportById};