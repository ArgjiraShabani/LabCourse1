const express=require('express');
const nodemailer=require('nodemailer');

const fs=require('fs');
const path=require('path');
const db=require('../db');
const {authenticateToken}= require("../middlewares");

const router=express.Router();


const getEmail=(query,id)=>{
    return new Promise((resolve,reject)=>{
        db.query(query,[id],(err,results)=>{
            if(err) return reject("Database error");
            if(results.length===0) return reject ("User not found");
            resolve(results[0].email);
        });
    });
};

router.post('/sendReport',authenticateToken,async(req,res)=>{
    const {subject,text, patient_id, appointment_id}=req.body;
    
    const doctor_id=req.user.id;

    if(!doctor_id || !patient_id || !appointment_id){
        return res.status(400).json({message: "Missing doctor, patient id or appointment_id"});
    }

    try{
        const patientEmail=await getEmail(`SELECT email FROM patients WHERE patient_id=?`,patient_id);
        const doctorEmail=await getEmail(`SELECT email FROM doctors WHERE doctor_id=?`, doctor_id);

        const reportQuery=`SELECT first_name,last_name, symptoms, alergies, diagnose, result_text, attachment 
        FROM results WHERE patient_id=? AND appointment_id=? LIMIT 1`;

        db.query(reportQuery,[patient_id, appointment_id], async(err,results)=>{
            if(err){
                console.error("Database error:", err);
                return res.status(404).json({message: "Database error."});
            }
            if(results.length===0){
                return res.status(404).json({message: "Report not found"});
            }
            const report=results[0];

            if (!report.attachment) {
                return res.status(404).json({ message: "No attachment found in the report" });
            }
            const absolutePath=path.join(__dirname, '..', 'public', 'reports', report.attachment);

            if(!fs.existsSync(absolutePath)){
                console.error("File not found at path:", absolutePath);
                return res.status(404).json({message: "Attachment file not found"});
            }

            const transporter=nodemailer.createTransport({
            host: 'sandbox.smtp.mailtrap.io',
            port: 587,
            auth: {
                user: '1c986629a75622',
                pass: '3bfae535a1005d',
            },
            tls: {
                rejectUnauthorized: false,
            }
        });
        const mailOptions={
            from: `"CareWave Clinic" <${doctorEmail}>`,
            to: patientEmail,
            subject: subject || "Medical Report",
            text: text || "Please find your medical report attached.",
            attachments: [{
                filename: report.attachment,
                path: absolutePath
            }]

        };
        await transporter.sendMail(mailOptions);
        return res.json({success:true,message: "Email sent successfullY!"});
        });

        
        
       
    }catch(error){
        console.error("Error sending email:", error);
        res.status(500).json({success: false,message: "Failed to send email",error: error.toString()});
    };

  
 

   

    
   
});
module.exports=router;