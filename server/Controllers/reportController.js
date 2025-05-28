const {createReport,getReport} =require('../Model/reportModel');

const createReportHandler=(req,res)=>{
    const patientId=req.params.patient_id;
    const doctorId=req.params.doctor_id;
    const reportData={
        
        doctor_id: doctorId,
        appointment_id: req.body.appointment_id,
        first_name: req.body.first_name,
        last_name: req.body.last_name,
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

const getReportHandler=(req,res)=>{
    const patientId=req.params.patient_id;
    const doctorId=req.params.doctor_id;
    const appointmentId=req.params.appointment_id;

    getReport(patientId,doctorId,appointmentId,(err,results)=>{
        if(err){
            return res.status(500).json({error: "Database error"});
        }
        if (!results || results.length === 0) {
      return res.status(404).json({ error: "Report not found" });
    }

    res.json({ report: results[0] });
    });
};
module.exports={createReportHandler,getReportHandler};