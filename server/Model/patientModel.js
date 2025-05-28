const db=require('../db');

const getPatientAppointments=(doctorId,callback)=>{
    const query=`SELECT a.appointment_id,p.patient_id,p.first_name,p.last_name
        FROM patients p inner join appointments a
        on p.patient_id=a.patient_id inner join doctors d
        on d.doctor_id=a.doctor_id
        WHERE a.status='completed' and d.doctor_id=?;`

        db.query(query,[doctorId],callback);

};

module.exports={
    getPatientAppointments,
}