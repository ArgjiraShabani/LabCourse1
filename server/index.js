
const express=require("express")
const app=express()
const mysql=require("mysql2")
const cors=require("cors");
const multer = require('multer');
const path = require('path');

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('public/uploads'));

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/uploads');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});
const upload = multer({ storage: storage });



const db = mysql.createConnection({
  user: 'root',
  host: 'localhost',
  password: 'database',
  database: 'hospital_management',

});
db.connect((err) => {
  if (err) {
    console.error('Database connection failed: ' + err.stack);
    return;
  }
  console.log('Connected to the database');
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


//Departments


app.get('/departments', (req, res) => {
  const query = 'SELECT * FROM departments';
  db.query(query, (err, results) => {
    if (err) {
      console.error('Error fetching departments:', err);
      return res.status(500).send('Error fetching departments');
    }
    res.json(results);
  });
});


app.post('/departments', upload.single('photo'), (req, res) => {
  const { department_name, description } = req.body;
  const image_path = req.file ? req.file.filename : null;

  const query = 'INSERT INTO departments (department_name, description, image_path) VALUES (?, ?, ?)';
  db.query(query, [department_name, description, image_path], (err, result) => {
    if (err) {
      console.error('Error creating department:', err);
      return res.status(500).send('Error creating department');
    }
    res.status(201).send('Department created successfully');
  });
});


app.put('/departments/:id', upload.single('photo'), (req, res) => {
  const { department_name, description } = req.body;
  const departmentId = req.params.id;
  const image_path = req.file ? req.file.filename : null;

  const query = image_path
    ? 'UPDATE departments SET department_name = ?, description = ?, image_path = ? WHERE department_Id = ?'
    : 'UPDATE departments SET department_name = ?, description = ? WHERE department_Id = ?';

  const values = image_path
    ? [department_name, description, image_path, departmentId]
    : [department_name, description, departmentId];

  db.query(query, values, (err, result) => {
    if (err) {
      console.error('Error updating department:', err);
      return res.status(500).send('Error updating department');
    }
    res.status(200).send('Department updated successfully');
  });
});


app.delete('/departments/:id', (req, res) => {
  const departmentId = req.params.id;

  const query = 'DELETE FROM departments WHERE department_Id = ?';
  db.query(query, [departmentId], (err, result) => {
    if (err) {
      console.error('Error deleting department:', err);
      return res.status(500).send('Error deleting department');
    }
    res.status(200).send('Department deleted successfully');
  });
});


//Services
app.get('/services', (req, res) => {
  const query = 'SELECT * FROM services';
  db.query(query, (err, results) => {
    if (err) {
      console.error('Error fetching services:', err);
      return res.status(500).send('Error fetching services');
    }
    res.json(results);
  });
});
app.post('/services', (req, res) => {
  const { service_name, department_Id } = req.body;

  const query = 'INSERT INTO services (service_name, department_Id) VALUES (?, ?)';
  db.query(query, [service_name, department_Id], (err, result) => {
    if (err) {
      console.error('Error creating service:', err);
      return res.status(500).send('Error creating service');
    }
    res.status(201).send('Service created successfully');
  });
});
app.put('/services/:id', (req, res) => {
  const { service_name, department_Id } = req.body;
  const serviceId = req.params.id;

  const query = 'UPDATE services SET service_name = ?, department_Id = ? WHERE service_id = ?';
  db.query(query, [service_name, department_Id, serviceId], (err, result) => {
    if (err) {
      console.error('Error updating service:', err);
      return res.status(500).send('Error updating service');
    }
    res.status(200).send('Service updated successfully');
  });
});
app.delete('/services/:id', (req, res) => {
  const serviceId = req.params.id;

  const query = 'DELETE FROM services WHERE service_id = ?';
  db.query(query, [serviceId], (err, result) => {
    if (err) {
      console.error('Error deleting service:', err);
      return res.status(500).send('Error deleting service');
    }
    res.status(200).send('Service deleted successfully');
  });
});

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