const express =require('express');
const crypto=require('crypto');
const db=require('../db');
const router=express.Router();
const nodemailer =require("nodemailer");

    const transporter=nodemailer.createTransport({
    host: "sandbox.smtp.mailtrap.io",
    port: 587,
    auth: {
        user: '1c986629a75622',
        pass: '3bfae535a1005d',
    },
    
      tls: {
                rejectUnauthorized: false,
            }
});


router.post("/forgotPassword",(req,res)=>{
    const {email}=req.body;

    db.query("SELECT * from admin WHERE email=?",[email],(err,admin)=>{
        if(err) return res.status(500).json({message: "Database error"});

        db.query("SELECT * from doctors WHERE email=?",[email],(err,doctor)=>{
        if(err) return res.status(500).json({message: "Database error"});

        db.query("SELECT * from patients WHERE email=?",[email],(err,patient)=>{
        if(err) return res.status(500).json({message: "Database error"});

        let role;

        if(admin.length) role="admin";
        else if(doctor.length) role="doctor";
        else if(patient.length) role="patient";
        else return res.status(404).json({message: "Email not found"});
        
        
        const token=crypto.randomBytes(32).toString("hex");
        const expiresAt=new Date(Date.now() + 15 *60*1000);

         db.query("INSERT INTO password_reset(email,role,token,expires_at) VALUES(?,?,?,?)",
            [email,role,token,expiresAt],
            (err)=>{
                if(err) return res.status(500).json({message: "Database error"});

                 const resetLink= `http://localhost:3000/resetPassword/${token}`;

                 transporter.sendMail(
                    {
                        from: '"Support" <support@carewave.com>',
                        to: email,
                        subject: "Password reset Request",
                        html: `<p>You requested a password reset.</p>
                    <p>Click here to reset your password: <a href="${resetLink}">${resetLink}</a></p>`

                    },
                    (err,info)=>{
                        if(err){
                            console.error(err);
                            return res.status(500).json({message: "Email error"});
                        }
                        res.json({message: "Password reset email sent"});
                    }
                 );

  
            }
        );


        
    });

        
    });

    });
});



module.exports=router;

