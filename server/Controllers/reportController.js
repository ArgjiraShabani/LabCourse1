const {createReport,getReport, deleteReport} =require('../Model/reportModel');

const createReportHandler=(req,res)=>{
    const patientId=req.params.patient_id;
    const doctorId=req.user.id;
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
    console.log("Decoded user from token:", req.user);
    const patientId=req.params.patient_id;
    const doctorId=req.user.id;
    const appointmentId=req.params.appointment_id;

    getReport(patientId,doctorId,appointmentId,(err,results)=>{
        if(err){
            return res.status(500).json({error: "Database error"});
        }
        if (!results || results.length === 0) {
      return res.status(404).json({ error: "Report not found" });
    }

    res.json({

         result_id: results[0].result_id, 
         first_name: results[0].first_name,
         last_name: results[0].last_name,
         symptoms: results[0].symptoms,
         diagnose: results[0].diagnose,
         alergies: results[0].alergies,
         result_text: results[0].result_text,
         attachment: results[0].attachment
         
        
        });
    });
};

const deleteReportHandler=(req,res)=>{
    const resultId= req.params.result_id;
    deleteReport(resultId,(err,results)=>{
        if(err){
            console.error("Database error", err);
            return res.status(500).json({error: "Database error"});
        }
        if(results.affectedRows===0){
            return res.status(404).json({error: "Report not found"});

        }
        res.json({message: "Report deleted successfully!"});
    })

}
module.exports={createReportHandler,getReportHandler, deleteReportHandler};