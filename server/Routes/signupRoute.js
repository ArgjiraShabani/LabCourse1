const db = require("../db"); // Your MySQL connection
const express = require("express");
const router = express.Router();
require('dotenv').config();
const bcrypt = require('bcrypt');



router.post('/signup',(req,res)=>{
  const name=req.body.name;
  const lastname=req.body.lastname;
  const email=req.body.email;
  const password=req.body.password;
  const phone=req.body.phoneNumber;
  const birth=req.body.birth;
  const gender=req.body.gender;
  const blood=req.body.blood;
  const image=null;
    db.query(` SELECT email FROM patients WHERE email = ?
                UNION
                SELECT email FROM doctors WHERE email = ?
                UNION
                SELECT email FROM admin WHERE email = ?`,[email,email,email],(err,data)=>{
      if(err){
           return res.json("Error 1");
        }
                    

          if(data.length>0){
            return res.json("This email exists.Please choose another one!")
           
          }else{
            db.query("select blood_id from blood where blood_type=?",[blood],(err,data)=>{
              if(err){
                    return res.json("Error 2");
                }
                if(data.length>0){
                      const bloodId=data[0].blood_id;
                  db.query("select role_id from roles where role_name=?",['patient'],(err,data)=>{
                          if(err){
                                return res.json("Error 2");
                            }
                            if(data.length>0){
                                  const roleId=data[0].role_id;
                                      
                        db.query("select status_id from status where status_name=?",['Active'],(err,data)=>{
                            if(err){
                              return res.json("Error 3");
                            }
                              if(data.length>0){
                                const statusId=data[0].status_id;
      
                                  db.query("select gender_id from gender where gender_name=?",[gender],(err,data)=>{
                                      if(err){
                                        return res.json("Didnt fetch gender id!!");
                                      }  
                                        if(data.length>0){
                                          const genderId=data[0].gender_id;
                                         bcrypt.hash(password, 10).then((hashedPassword) => {
                                                  db.query("INSERT INTO patients (first_name, last_name, email, password, phone, role_id, gender_id, status_id, date_of_birth, blood_id, image_path) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)", 
                                                  [name, lastname, email, hashedPassword, phone, roleId, genderId, statusId, birth, bloodId, image], (err, data) => {
                                                    if (err) {
                                                      return res.json("Insert error: " + err.message);
                                                    }
                                                    return res.json("");
                                                  });
                                                }).catch((err) => {
                                                  return res.json("Password hash error: " + err.message);
                                                });
                                            
                                           }else{
                                              return res.json("Gender not found!");
                                           }
                                          });
                                                     
                                }else{
                                  return res.json("Status does not found!");
                                }
                                  });
                          }else{
                            return res.json("Role not found!");
                          }
                      });
                       }else{
                            return res.json("Blood not found!");
                     }
                  });
}})
});

module.exports = router;