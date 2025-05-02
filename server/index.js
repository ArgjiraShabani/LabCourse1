
const express=require("express")
const app=express()
const mysql=require("mysql2")
const cors=require("cors");

app.use(cors());
app.use(express.json());


const db = mysql.createConnection({
    user:"root",
    host:"localhost",
    password:"database",
    database:"hospital_management",

})
db.connect((err) => {
    if (err) {
        console.error("Database connection failed: " + err.stack);
        return;
    }
    console.log("Connected to the database");
});

app.get('/staff',(req,res)=>{
    db.query("SELECT users.first_name,users.last_name,departments.department_name FROM doctors inner join users on doctors.doctor_id=users.user_id inner join departments on doctors.department_id=departments.department_Id",(err,result)=>{
    if(err){
        console.log(err);
    }else{
        res.send(result)
    }
    })
})
app.get('/infoPatient/:id',(req,res)=>{
    const id=req.params.id;

    db.query("SELECT * from users inner join patients on users.user_id=patients.patient_id where users.user_id = ?",[id],(err,result)=>{
    if(err){
        console.log(err);
    }else{
        res.send(result[0])
    }
    })
})
app.put('/updatePatient/:id',(req,res)=>{
    const first_name=req.body.first_name;
    const last_name=req.body.last_name;
    const email=req.body.email;
    const phone=req.body.phone;
    const birth=req.body.date_of_birth;
    const gender=req.body.gender;
    const blood=req.body.blood_type;
    const id = req.params.id;
    db.query("UPDATE users SET first_name=?,last_name=?,email=?,phone=? WHERE user_id=?",[first_name,last_name,email,phone,id],(err,data)=>{
        if(err){
        return res.json("Error");
    }

    db.query("UPDATE patients SET date_of_birth=?,blood_type=?,gender=? WHERE patient_id=?",[birth,blood,gender,id],(err,data)=>{
        if(err){
        return res.json("Error");
    }
    
   }
   );   

});
});
app.post('/login',(req,res)=>{
    const sql="SELECT user_id,email,password,role_name FROM users inner join roles on users.role_id=roles.role_id WHERE `email`=? AND `password`=?";
    db.query(sql,[req.body.email,req.body.password],(err,data)=>{
        if(err){
        return res.json("Error");
    }
    if(data.length>0){
        return res.json({ message: "Success", id: data[0].user_id,role: data[0].role_name});
    }else{
        return res.json("Failed");
    }

  });

});
app.listen(3001,()=>{
    console.log("Hey po punon")
})
