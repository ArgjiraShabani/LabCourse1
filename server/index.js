
const express=require("express")
const app=express()
const mysql=require("mysql2")
const cors=require("cors");

app.use(cors());
app.use(express.json());


const db = mysql.createConnection({
    user:"root",
    host:"localhost",
    password:"mysqldb",
    database:"hospital_management",
    port: 3307
    

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

app.listen(3001,()=>{
    console.log("Hey po punon")
})
