const {createReport} =require('../Model/reportModel');

const createReportHandler=(req,res)=>{
    const patientId=req.params.patient_id;
    const reportData={
        patient_id: req.body.patient_id,
        doctor_id: req.body.doctor_id,
        appointment_id: req.body.appointment_id,
        symptoms: req.body.symptoms,
        alergies: req.body.alergies,
        diagnose: req.body.diagnose,
        result_text: req.body.result_text,
        attachment: req.file? req.file.filename: null,
    };

    createReport(patientId,reportData,(err,result)=>{
        if(err){
            console.error(err);
            return res.status(500).json({error: "Database error"});
        }
        res.status(200).json({message: "Report created successfully",id: result.insertId});
    });
};
module.exports={createReportHandler};