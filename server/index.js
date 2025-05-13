//import doctorRoutes from "./modules/doctor/doctorRoutes.js";
const express=require("express")
const app=express()
const mysql=require("mysql2")
const cors=require("cors");
const multer = require('multer');
const path = require('path');
const { emit } = require("process");
const { error } = require("console");

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

const userStorage=multer.diskStorage({
  destination: (req,file,cb)=>{
    cb(null,'public/userUploads');
  },
  filename: (req,file,cb)=>{
    cb(null,'user_' + Date.now()+ path.extname(file.originalname));
  },
});
const userUpload=multer({storage: userStorage});
app.use('/userUploads',express.static(path.join(__dirname,'public/userUploads')));



const db = mysql.createConnection({
    user:"root",
    host:"localhost",
    //password:"password",
    //password:"mysql123",
    password:"valjeta1!",
    database:"hospital_management",
    
    //port: 3307,
   

});
db.connect((err) => {
  if (err) {
    console.error('Database connection failed: ' + err.stack);
    return;
  }
  console.log('Connected to the database');
});

app.get('/staff',(req,res)=>{
    db.query("SELECT doctors.first_name,doctors.last_name,specialization.specialization_name FROM doctors inner join specialization on doctors.specialization_id=specialization.specialization_id",(err,result)=>{
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

//app.use("/server/doctorRoutes", docRoutes);

app.get('/infoPatient/:id',(req,res)=>{
  const id=req.params.id;

  db.query("SELECT * from patients inner join gender on patients.gender_id=gender.gender_id inner join blood on patients.blood_id=blood.blood_id where patients.patient_id = ?",[id],(err,result)=>{
  if(err){
      console.log(err);
  }else{
      res.send(result[0])
  }
  })
});

app.get('/gender',(req,res)=>{
  db.query('Select gender_name from gender',(err,data)=>{
    if(err){
      return res.json("You did not fetch Gender!");
    }else{
      res.send(data);
    }
  })
});

app.get('/status',(req,res)=>{
  db.query('Select * from status',(err,data)=>{
    if(err){
      return res.json("You did not fetch Status!");
    }else{
      res.send(data);
    }
  })
});

app.put('/updateStatus',(req,res)=>{
  const status_id=req.body.status;
  const id=req.body.id;
  db.query("update patients set status_id=? where patient_id=?",[status_id,id],(err,data)=>{
    if(err){
      return res.json("Didnt Update Patient!");
    }else{
      console.log("Updated Patients!");
    }
  })
});



app.get('/blood',(req,res)=>{
  db.query('Select blood_type from blood',(err,data)=>{
    if(err){
      return res.json("You did not fetch Blood!");
    }else{
      res.send(data);
    }
  })
});

app.put('/updatePatient/:id',upload.single("image"),(req,res)=>{
  const first_name=req.body.first_name;
  const last_name=req.body.last_name;
  const phone=req.body.phone;
  const birth=req.body.date_of_birth;
  const gender_name=req.body.gender_name;
  const blood=req.body.blood_type;
  const id = req.params.id;
  const image = req.file ? req.file.filename : null;
   
  db.query("select gender_id from gender where gender_name=?",[gender_name],(err,data)=>{
    if(err){
      return res.json("Didnt fetch gender id!!");
    }
    
      if(data.length>0){
        const genderId=data[0].gender_id;
     
  
    db.query("select blood_id from blood where blood_type=?",[blood],(err,data)=>{
      if(err){
        return res.json("Error");
      }
        if(data.length>0){
          const bloodId=data[0].blood_id;
          
    
          db.query("UPDATE patients SET first_name=?,last_name=?,phone=?,date_of_birth=?,gender_id=?,blood_id=?,image_path=? WHERE patient_id=?",[first_name,last_name,phone,birth,genderId,bloodId,image,id],(err,data)=>{
            if(err){
              return res.json("Error");
            }
            return res.json("Patient updated successfully");
          });
     }else{
      return res.json("No matching blood found");
     };
 });
}else{
  return res.json("No matching gender found");
}
  })
})



app.get('/patient',(req,res)=>{
  db.query("SELECT patients.image_path,patients.patient_id,patients.first_name,patients.last_name,patients.email,patients.phone,patients.date_of_birth,gender.gender_name,status.status_name FROM patients inner join gender on patients.gender_id=gender.gender_id inner join status on patients.status_id=status.status_id",(err,result)=>{
  if(err){
      console.log(err);
  }else{
      res.send(result)
  }
  })
  
});

app.delete("/deletePatient/:id",(req,res)=>{
  const id = req.params.id;
  db.query("DELETE from patients where patient_id=?",[id],(err,result)=>{
    if(err){
      return res.json("Error");
    }else{
      res.send(result)
    }
  })
})

app.post("/registerPatient",upload.single("image"),(req,res)=>{
  const name=req.body.first_name;
  const lastname=req.body.last_name;
  const email=req.body.email;
  const password=req.body.password;
  const number=req.body.number;
  const birth=req.body.birth;
  const gender=req.body.gender;
  const blood=req.body.blood;
  const status=req.body.status;
    const image=req.file.filename
  db.query("select gender_id from gender where gender_name=?",[gender],(err,data)=>{
    if(err){
      return res.json("Didnt fetch gender id!!");
    }
    
      if(data.length>0){
        const genderId=data[0].gender_id;
     
  
    db.query("select blood_id from blood where blood_type=?",[blood],(err,data)=>{
      if(err){
        return res.json("Error");
      }
        if(data.length>0){
          const bloodId=data[0].blood_id;


        db.query("select status_id from status where status_name=?",[status],(err,data)=>{
          if(err){
            return res.json("Error");
          }
            if(data.length>0){
              const statusId=data[0].status_id;

                      db.query("select role_id from roles where role_name=?",['patient'],(err,data)=>{
                        if(err){
                          return res.json("Error");
                        }
                          if(data.length>0){
                            const roleId=data[0].role_id;

            db.query(`insert into patients(first_name,last_name,email,password,phone,role_id,date_of_birth,gender_id,blood_id,status_id,image_path)value(?, ?, ?, ?, ?, 3, ?, ?, ?, ?,?)`, [name, lastname, email, password, number, birth, genderId, bloodId, statusId,image],(err,data)=>{
            if(err){
              return res.json("Error");
            }
            return res.json("Patient registered successfully");
          });
          }else{
                  return res.json("No matching role found");
                };
                });
               }else{
                  return res.json("No matching status found");
                };
                });
          }else{
            return res.json("No matching blood found");
          };
          });
    }else{
      return res.json("No matching gender found");
    }
      })
    });

app.post('/login',(req,res)=>{
  const sql="SELECT patients.patient_id,patients.email,patients.password,roles.role_name FROM patients inner join roles on patients.role_id=roles.role_id WHERE `email`=? AND `password`=?";
  db.query(sql,[req.body.email,req.body.password],(err,data)=>{
      if(err){
      return res.json("Error");
      }
  if(data.length>0){
      return res.json({ message: "Success", id: data[0].patient_id,role: data[0].role_name});
  }else{
    const sql2="SELECT doctors.doctor_id,doctors.email,doctors.password,roles.role_name FROM doctors inner join roles on doctors.role_id=roles.role_id WHERE `email`=? AND `password`=?";
    db.query(sql2,[req.body.email,req.body.password],(err,data)=>{
      if(err){
        return res.json("Error");
        }
        if(data.length>0){
          return res.json({ message: "Success", id: data[0].doctor_id,role: data[0].role_name});
        }else{
          const sql3="SELECT admin.admin_id,admin.email,admin.password,roles.role_name FROM admin inner join roles on admin.role_id=roles.role_id WHERE `email`=? AND `password`=?";
          db.query(sql3,[req.body.email,req.body.password],(err,data)=>{
            if(err){
              return res.json("Error");
              }
              if(data.length>0){
                return res.json({ message: "Success", id: data[0].admin_id,role: data[0].role_name});
              }else{
                return res.json("Invalid email or password!");
              }
           }); 
                };
              });
}});
})
app.get('/specializations',(req,res)=>{
    db.query('SELECT specialization_id,specialization_name FROM specialization',(err,results)=>{
        if(err){
            console.log(err);
            return res.status(500).json({error: "Database error"});
        }
        res.json(results);
    });
});
app.get('/departments',(req,res)=>{
    db.query('SELECT department_Id,department_name FROM departments',(err,results)=>{
        if(err){
            console.log(err);
             return res.status(500).json({error: "Database error"});
        }
        res.json(results);
    });
});
app.get('/roles',(req,res)=>{
    db.query('SELECT role_id,role_name FROM  roles',(err,results)=>{
        if(err){
            console.log(err);
            return res.status(500).json({error: "Database error"});
        }
        res.json(results);
    });
});
app.get('/gender',(req,res)=>{
  db.query('SELECT gender_id,gender_name FROM gender',(err,result)=>{
    if(err){
      console.log(err);
      return res.status(500).json({error: "Database error"});
    }
    res.json(result);
  });
});
/*app.post("/addDoctor",userUpload.single('img'),(req,res)=>{
  console.log('Body:', req.body);
 console.log('File:', req.file);
  
  
  
  const {
    first_name,
    last_name,
    email,
    password,
    phone,
    role_id,
    date_of_birth,
    gender_id,
    specialization_id,
    department_Id
  }=req.body;
  const roleIdInt = role_id ? parseInt(role_id, 10) : null;
const genderIdInt = gender_id ? parseInt(gender_id, 10) : null;
const specializationIdInt = specialization_id ? parseInt(specialization_id, 10) : null;
const departmentIdInt = department_Id ? parseInt(department_Id, 10) : null;


  const image_path = req.file ? req.file.filename : null;
  db.query("INSERT INTO doctors(first_name,last_name,email,password,phone,role_id,date_of_birth,gender_id,specialization_id ,department_Id,image_path) VALUES(?,?,?,?,?,?,?,?,?,?,?)",
    [first_name,
     last_name,
     email,
     password,
     phone,
     roleIdInt,
     date_of_birth || null,
     genderIdInt,
     specializationIdInt,
     departmentIdInt,
     image_path || null
    ],(err,result)=>{
      if(err){
        console.log("Error inserting into users",err);
        return res.status(500).json({error: "Failed to insert user"});

      }
      res.json({message: "Doctor added successfully!"});
});
});*/
app.post("/doctors",userUpload.single('img'),(req,res)=>{
  const q="INSERT INTO doctors (`first_name`,`last_name`,`email`,`password`,`phone`,`role_id`,`date_of_birth`,`gender_id`,`specialization_id` ,`department_Id`,`image_path`) VALUES(?,?,?,?,?,?,?,?,?,?,?)";
  const gender_id= parseInt(req.body.gender_id);
  if (isNaN(gender_id)) {
    return res.status(400).json({ error: "Invalid gender" });
  }
  const values=[
    req.body.first_name,
    req.body.last_name,
    req.body.email,
    req.body.password,
    req.body.phone,
    parseInt(req.body.role_id),
    req.body.date_of_birth,
    gender_id,
    
    parseInt(req.body.specialization_id),
    parseInt(req.body.department_Id),
    req.file ? req.file.filename : null

  ];
  db.query(q,values,(err,data)=>{
     if (err) {
    console.error("DB INSERT ERROR:", err);
    return res.status(500).json({ error: err.message });
  }
   console.log("DB INSERT SUCCESS:", data);
    return res.json("Doctor has been successfully created");
  });
    
});

app.put("/updateDoctors/:id",(req,res)=>{
  const doctorId=req.params.id;
  const q= "UPDATE  doctors SET first_name=?,last_name=?,email=?,password=?,phone=?,role_id=?,date_of_birth=?,gender_id=?,specialization_id=?,department_Id=?,image_path=?  WHERE doctor_id=?";
  const values=[
    req.body.first_name,
    req.body.last_name,
    req.body.email,
    req.body.password,
    req.body.phone,
    req.body.role_id,
    req.body.date_of_birth,
    req.body.gender_id,
    req.body.specialization_id,
    req.body.department_Id,
    req.body.image_path
  ]
  
  db.query(q,[...values,doctorId],(err,data)=>{
    if(err) return res.json(err);
    return res.json("Doctor has been updated successfully");
  })
  
});
app.get('/viewDoctors',(req,res)=>{
  const sqlGet=`
  SELECT d.doctor_id,d.first_name,
    d.last_name,
    d.email,
    d.password,
    d.phone,
    r.role_name,
    d.date_of_birth,
    g.gender_name,
  s.specialization_name,
  dep.department_name 
  FROM doctors d inner join roles r on d.role_id=r.role_id
   inner join gender g on d.gender_id=g.gender_id
    inner join specialization s on d.specialization_id=s.specialization_id
   inner join departments dep on d.department_id=dep.department_id
   `;
  db.query(sqlGet,(err,result)=>{
    if(err){
      console.error("Database error:",err);
      return res.status(500).json({error: "Database error"});
    }
    return res.json(result);
   

  });
});
app.delete("/deleteDoctor/:doctor_id",(req,res)=>{
  const doctorId=req.params.doctor_id;
  const sqlDel="DELETE FROM doctors WHERE doctor_id=?";
  db.query(sqlDel,[doctorId],(err,result)=>{
    if(err){
      console.error("Database error:",err);
      return res.status(500).json({error: "Database error"});

    }
    if(result.affectedRows===0){
      return res.status(404).json({message: "Doctor not found"});
    }
    res.json({message: "Doctor deleted successfully"});
    
    
  });
});
app.get("/doctorId/:doctor_id",(req,res)=>{
  const doctorId=req.params.doctor_id;
  const s=`SELECT d.doctor_id,d.first_name,
  d.last_name,
  d.email,
  d.password,
  d.phone,
  d.role_id,
  r.role_name,
  d.date_of_birth,
  d.gender_id,
  g.gender_name,
  d.specialization_id,
s.specialization_name,
d.department_id,
dep.department_name,
d.image_path
FROM doctors d inner join roles r on d.role_id=r.role_id
 inner join gender g on d.gender_id=g.gender_id
  inner join specialization s on d.specialization_id=s.specialization_id
 inner join departments dep on d.department_id=dep.department_id
 WHERE d.doctor_id=?
 `;
 db.query(s,[doctorId],(err,result)=>{
  if(err){
    console.error("Database error:",err);
    return res.status(500).json({error: "Database error"});

  }
  if(result.length===0){
    return res.status(404).json({message: "Doctor not found"});
  }
  res.json(result[0]);
 });

});

/*app.post('/uploadProfileImage/:doctor_id',userUpload.single('profileImage'),
(req,res)=>{
  const doctorId=req.params.doctor_id;

  if(!req.file){
    return res.status(400).json({error: 'No file uploaded'});
  }
  const imagePath=`/userUploads/${req.file.filename}`;
  const sql = `UPDATE doctors SET image_path = ? WHERE doctor_id = ?`;
  db.query(sql,[imagePath,doctorId],(err,result)=>{
    if(err){
      console.log("Database error",err);
      return res.status(500).json({error: "Database error"});
    }
    res.json({message: "Image uploaded successfully",imagePath});
  });

});*/


app.get('/api/doctors', (req, res) => {
  const query = `
    SELECT doctor_id AS id, CONCAT(first_name, " ", last_name) AS name 
    FROM doctors 
   WHERE is_active = 1 AND department_id IS NOT NULL
  `;

  db.query(query, (err, results) => {
    if (err) {
      console.error('Gabim gjate marrjes se mjekeve:', err.message);
      return res.status(500).json({ error: 'Gabim gjate marrjes se mjekeve' });
    }
    res.json(results);
  });
});


app.get('/api/standardSchedules', (req, res) => {
  const query = `
    SELECT ss.schedule_id, ss.doctor_id, CONCAT(d.first_name, " ", d.last_name) AS doctor_name, 
           ss.weekday, ss.start_time, ss.end_time
    FROM standard_schedules ss
    JOIN doctors d ON ss.doctor_id = d.doctor_id
    WHERE d.is_active = 1
  `;

  db.query(query, (err, results) => {
    if (err) {
      console.error('Gabim gjatë marrjes së orareve:', err.message);
      return res.status(500).json({ error: 'Gabim gjatë marrjes së orareve' });
    }
    res.json(results);
  });
});


app.post('/api/standardSchedules', (req, res) => {
  const { doctor_id, weekday, start_time, end_time } = req.body;

  if (!doctor_id || !weekday || !start_time || !end_time) {
    return res.status(400).json({ error: 'Të dhenat e kerkuara mungojne' });
  }

  const query = `
    INSERT INTO standard_schedules (doctor_id, weekday, start_time, end_time)
    VALUES (?, ?, ?, ?)
  `;

  db.query(query, [doctor_id, weekday, start_time, end_time], (err, result) => {
    if (err) {
      console.error('Gabim gjatë ruajtjes së orarit:', err.message);
      return res.status(500).json({ error: 'Gabim gjate ruajtjes se orarit' });
    }
    res.status(201).json({ message: 'Orari u shtua me sukses' });
  });
});


app.put('/api/standardSchedules/:schedule_id', (req, res) => {
  const { schedule_id } = req.params;
  const { start_time, end_time } = req.body;

  if (!start_time || !end_time) {
    return res.status(400).json({ error: 'Të dhenat e kerkuara mungojne' });
  }

  const query = `
    UPDATE standard_schedules 
    SET start_time = ?, end_time = ?
    WHERE schedule_id = ?
  `;

  db.query(query, [start_time, end_time, schedule_id], (err, result) => {
    if (err) {
      console.error('Gabim gjate perditesimit te orarit:', err.message);
      return res.status(500).json({ error: 'Gabim gjate perditesimit te orarit' });
    }
    res.json({ message: 'Orari u perditesua me sukses' });
  });
});


app.delete('/api/standardSchedules/:schedule_id', (req, res) => {
  const { schedule_id } = req.params;

  const query = `DELETE FROM standard_schedules WHERE schedule_id = ?`;

  db.query(query, [schedule_id], (err, result) => {
    if (err) {
      console.error('Gabim gjate fshirjes së orarit:', err.message);
      return res.status(500).json({ error: 'Gabim gjate fshirjes së orarit' });
    }
    res.json({ message: 'Orari u fshi me sukses' });
  });
});

app.get('/services', async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT service_id, service_name, department_id
      FROM services
    `);
    res.json(rows);
  } catch (error) {
    console.error('Error fetching services:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

    
app.listen(3001,()=>{
    console.log("Hey po punon")
})



