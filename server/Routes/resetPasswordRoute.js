const bcrypt=require("bcrypt");
const express =require('express');
const db=require('../db');
const router=express.Router();



router.post("/resetPassword/:token",(req,res)=>{
    const {token}=req.params;
    const {password}=req.body;

    db.query("SELECT * from password_reset WHERE token=?",[token],(err,rows)=>{
        if(err) return res.status(500).json({ message: "DB error" });
        if (!rows.length) return res.status(400).json({ message: "Invalid or expired token" });

        const reset=rows[0];

        if(new Date()>reset.expires_at){
            return res.status(400).json({message: "Token expired"});
        }

        bcrypt.hash(password,10,(err,hashed)=>{
            if(err) return res.status(500).json({message: "Hashing error"});

            let query;
            if(reset.role==="admin"){
            query="UPDATE admin SET password=? WHERE email=?";
        }
        else if(reset.role==="doctor"){
            query="UPDATE doctors SET password=? WHERE email=?";
        }
        else if(reset.role==="patient"){
            query="UPDATE patients SET password=? WHERE email=?";
        }

        db.query(query,[hashed, reset.email],(err)=>{
            if(err) return res.status(500).json({message: "Database error"});

            db.query("DELETE FROM password_reset WHERE email=?",[reset.email],(err)=>{
                if(err) return res.status(500).json({message: "Database error"});

                res.json({message: "Password updated successfully"});
            });
        });

        });

    });


});

module.exports= router;