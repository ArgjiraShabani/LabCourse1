//import doctorRoutes from "./modules/doctor/doctorRoutes.js";
const express=require("express")
const app=express()
const mysql=require("mysql2")
const cors=require("cors");
const multer = require('multer');
const path = require('path');
const { emit } = require("process");
const { error } = require("console");
const bcrypt=require("bcrypt");
const cron = require('node-cron');
const bcrypt = require('bcrypt');

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
    password:"database",
    //password:"valjeta1!",
    //password: "mysqldb",
    //password:"mysql123",
    //password:"valjeta1!",
    password: "mysqldb",
    database:"hospital_management",
    
    port: 3307,
   

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
        return res.json(data);
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
  db.query("select image_path from patients where patients.patient_id=?",[id],(err,data)=>{
     if(err){
      return res.json("Didnt fetch image!");
    }
    
      if(data.length>0){
        const imageFetch=data[0].image_path;
        const image = req.file ? req.file.filename : imageFetch;

  
   
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
            db.query("SELECT * from patients inner join gender on patients.gender_id=gender.gender_id inner join blood on patients.blood_id=blood.blood_id where patients.patient_id = ?",[id],(err,result)=>{
              if(err){
                  console.log(err);
              }else{
                console.log(result[0])
                  res.send(result[0])
              }
              })
            
          });
     }else{
      return res.json("No matching blood found");
     };
 });
}else{
  return res.json("No matching gender found");
}
  });
}})
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
  const image = req.file ? req.file.filename : null;
  bcrypt.hash(password, 10, (err, hashedPassword) => {
  if (err) {
    console.error('Error hashing password:', err);

  }
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

                    db.query(`insert into patients(first_name,last_name,email,password,phone,role_id,date_of_birth,gender_id,blood_id,status_id,image_path)value(?, ?, ?, ?, ?, ?, ?, ?, ?, ?,?)`, [name, lastname, email, hashedPassword, number,roleId, birth, genderId, bloodId, statusId,image],(err,data)=>{
                    if(err){
                      return res.json("Error");
                    }                       
                       return res.json("");
                        
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
              });
            }});
            });
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
});

app.post('/signup',(req,res)=>{
  const name=req.body.name;
  const lastname=req.body.lastname;
  const email=req.body.email;
  const password=req.body.password;
  const phone=req.body.phoneNumber;
  const birth=req.body.birth;
  const gender=req.body.gender;
  const blood=req.body.blood;
  const image='1746947791225.png';
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
                                              db.query("INSERT INTO patients(first_name,last_name,email,password,phone,role_id,gender_id,status_id,date_of_birth,blood_id,image_path)value(?,?,?,?,?,?,?,?,?,?,?)",[name,lastname,email,password,phone,roleId,genderId,statusId,birth,bloodId,image],(err,data)=>{
                                                   if(err){
                                                        return res.json("Error");
                                                      }
                                                      return res.json("");
                                                      
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
app.get('/genderId', (req, res) => {
  
  db.query('SELECT * FROM gender', (err, result) => {
    if (err) {
      console.log(err);
      return res.status(500).json({ error: "Database error" });
    }
    console.log("GENDER RESULT:", result); // <- Add this
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

app.post("/doctors",userUpload.single('img'),async (req,res)=>{
  
  /*const gender_id= parseInt(req.body.gender_id);
  if (isNaN(gender_id)) {
    return res.status(400).json({ error: "Invalid gender" });
  }*/
 try{
  const{
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
  const hashedPassword=await bcrypt.hash(password,13)
  const q="INSERT INTO doctors (`first_name`,`last_name`,`email`,`password`,`phone`,`role_id`,`date_of_birth`,`gender_id`,`specialization_id` ,`department_Id`,`image_path`) VALUES(?,?,?,?,?,?,?,?,?,?,?)";
 const values=[
  first_name,
  last_name,
  email,
  hashedPassword,
  phone,
  role_id,
  date_of_birth,
  gender_id,
  specialization_id,
  department_Id,
  req.file?req.file.filename: null
 ];
  db.query(q,values,(err,data)=>{
     if (err) {
    console.error("DB INSERT ERROR:", err);
    return res.status(500).json({ error: err.message });
  }
   console.log("DB INSERT SUCCESS:", data);
    return res.json("Doctor has been successfully created");
  });

 }catch(error){
  console.error("Server error:", error);
  return res.status(500).json({error: "Internal server error"});
 }
 
    
});

app.put("/updateDoctors/:id",upload.single('img'),async(req,res)=>{
  const doctorId=req.params.id;
  try{
     const getDoctor="Select password FROM doctors WHERE doctor_id=?";
  db.query(getDoctor,[doctorId],async(err,results)=>{
    if(err) return res.status(500).json({error: err.message});
    if(results.length===0) return res.status(404).json({message: "doctor not found"});
    let currentPassword=results[0].password;
    let savePassword=currentPassword;
    if(req.body.password && req.body.password.trim() !==""){
      savePassword=await bcrypt.hash(req.body.password,13)
    }
  })
  const values=[
    req.body.first_name,
    req.body.last_name,
    req.body.email,
    savePassword,
    req.body.phone,
    req.body.role_id,
    req.body.date_of_birth,
    req.body.gender_id,
    req.body.specialization_id,
    req.body.department_Id,
    
  ];
  const image_path=req.file?req.file.filename: req.body.image_path;
  const q= "UPDATE  doctors SET first_name=?,last_name=?,email=?,password=?,phone=?,role_id=?,date_of_birth=?,gender_id=?,specialization_id=?,department_Id=?,image_path=?  WHERE doctor_id=?";
  
  
  db.query(q,[...values,image_path,doctorId],(err,result)=>{
    if(err) return res.json(err);
    
    if(result.affectedRows===0){
      return res.status(404).json({message: "Doctor not found"});
    }
    return res.json("Doctor has been updated successfully");
  });
  

  }catch(error){
    console.error("Update error:",error);
    return res.status(500).json({error: "Internal server error"});
  }
 
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
      console.error('Error while fetching doctors:', err.message);
      return res.status(500).json({ error: 'Error while fetching doctors' });
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
      console.error('Error while fetching schedules:', err.message);
      return res.status(500).json({ error: 'Error while fetching schedules' });
    }
    res.json(results);
  });
});


app.post('/api/standardSchedules', (req, res) => {
  const { doctor_id, weekday, start_time, end_time } = req.body;

  if (!doctor_id || !weekday || !start_time || !end_time) {
    return res.status(400).json({ error: 'The requested data is missing' });
  }

  const query = `
    INSERT INTO standard_schedules (doctor_id, weekday, start_time, end_time)
    VALUES (?, ?, ?, ?)
  `;

  db.query(query, [doctor_id, weekday, start_time, end_time], (err, result) => {
    if (err) {
      console.error('Error while saving the schedule:', err.message);
      return res.status(500).json({ error: 'Error while saving the schedule' });
    }
    res.status(201).json({ message: 'The schedule was added successfully' });
  });
});


app.put('/api/standardSchedules/:schedule_id', (req, res) => {
  const { schedule_id } = req.params;
  const { start_time, end_time } = req.body;

  if (!start_time || !end_time) {
    return res.status(400).json({ error: 'The requested data is missing' });
  }

  const query = `
    UPDATE standard_schedules 
    SET start_time = ?, end_time = ?
    WHERE schedule_id = ?
  `;

  db.query(query, [start_time, end_time, schedule_id], (err, result) => {
    if (err) {
      console.error('Error while updating the schedule:', err.message);
      return res.status(500).json({ error: 'Error while updating the schedule' });
    }
    res.json({ message: 'The schedule was updated successfully' });
  });
});


app.delete('/api/standardSchedules/:schedule_id', (req, res) => {
  const { schedule_id } = req.params;

  const query = `DELETE FROM standard_schedules WHERE schedule_id = ?`;

  db.query(query, [schedule_id], (err, result) => {
    if (err) {
      console.error('Error while deleting the schedule:', err.message);
      return res.status(500).json({ error: 'Error while deleting the schedule' });
    }
    res.json({ message: 'The schedule was deleted successfully' });
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

app.get('/getPatientInfo/:patient_id',(req,res)=>{
  const patientId=req.params.patient_id;
  const q=`SELECT p.first_name,p.last_name,
  p.gender_id,g.gender_name,p.medical_history,p.date_of_birth
  FROM patients p inner join gender g on p.gender_id=g.gender_id`;
  db.query(q,[patientId],(err,result)=>{
    if(err){
    console.error("Database error:",err);
    return res.status(500).json({error: "Database error"});

  }
  if(result.length===0){
    return res.status(404).json({message: "Patient not found"});
  }
  res.json(result[0]);
  });

});

app.get('/doctors/byDepartment/:department_id', (req, res) => {
    const departmentId = req.params.department_id;

    const sql = "SELECT doctor_id, first_name, last_name FROM doctors WHERE department_id = ?";
    db.query(sql, [departmentId], (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).json({error: "Database error"});
        }
        res.json(results);
    });
});

app.get('/api/feedbacks', (req, res) => {
  const query = `
    SELECT
      f.feedback_id,
      f.message,
      f.created_at,
      p.first_name AS patient_first_name,
      p.last_name AS patient_last_name,
      d.first_name AS doctor_first_name,
      d.last_name AS doctor_last_name,
      CASE
        WHEN f.patient_id IS NOT NULL THEN 'patient'
        WHEN f.doctor_id IS NOT NULL THEN 'doctor'
        ELSE 'unknown'
      END AS submitted_by
    FROM feedbacks f
    LEFT JOIN patients p ON f.patient_id = p.patient_id
    LEFT JOIN doctors d ON f.doctor_id = d.doctor_id
    ORDER BY f.created_at DESC
  `;

  db.query(query, (err, results) => {
    if (err) {
      console.error('Error fetching feedbacks:', err);
      res.status(500).json({ error: 'Database error' });
    } else {
      const formatted = results.map(row => ({
        feedback_id: row.feedback_id,
        message: row.message,
        created_at: row.created_at,
        first_name: row.patient_first_name || row.doctor_first_name || 'Unknown',
        last_name: row.patient_last_name || row.doctor_last_name || 'Unknown',
        submitted_by: row.submitted_by
      }));

      res.json(formatted);
    }
  });
});

app.post('/api/feedbacks', (req, res) => {
  const { message, patient_id, doctor_id } = req.body;

  if ((!patient_id && !doctor_id) || (patient_id && doctor_id)) {
    return res.status(400).json({
      error: 'Please provide either patient_id or doctor_id, not both.'
    });
  }

  const query = `
    INSERT INTO feedbacks (message, patient_id, doctor_id)
    VALUES (?, ?, ?)
  `;

  db.query(query, [message, patient_id || null, doctor_id || null], (err, result) => {
    if (err) {
      console.error('Error inserting feedback:', err);
      return res.status(500).json({ error: 'Database insert error' });
    }
    res.status(201).json({ message: 'Feedback inserted successfully' });
  });
});

cron.schedule('0 23 * * 0', async () => {
  try {
    const [doctors] = await db.query('SELECT doctor_id FROM doctors');
    const [standardSchedules] = await db.query('SELECT * FROM standard_schedules');

    const nextWeek = [];
    for (let i = 0; i < 7; i++) {
      const date = moment().add(1, 'weeks').startOf('isoWeek').add(i, 'days').format('YYYY-MM-DD');
      const weekday = moment(date).format('dddd');
      nextWeek.push({ weekday, date });
    }

    for (const doctor of doctors) {
      for (const day of nextWeek) {
        const schedule = standardSchedules.find(s =>
          s.doctor_id === doctor.doctor_id && s.weekday === day.weekday
        );

        if (schedule) {
          try {
            await db.query(
              `INSERT IGNORE INTO weekly_schedules (doctor_id, date, start_time, end_time, is_custom)
               VALUES (?, ?, ?, ?, false)`,
              [doctor.doctor_id, day.date, schedule.start_time, schedule.end_time]
            );
          } catch (err) {
            console.error(`Error inserting schedule for ${doctor.doctor_id} on ${day.date}:`, err);
          }
        }
      }
    }

    console.log("Weekly schedule generated successfully!");
} catch (err) {
  console.error("Error while generating the weekly schedule:", err);

  }
});

app.get("/api/weeklySchedules", (req, res) => {
  const query = `
    SELECT ws.schedule_id, ws.doctor_id, 
           CONCAT(d.first_name, ' ', d.last_name) AS doctor_name,
           ws.date, ws.start_time, ws.end_time, ws.is_custom,
           DAYNAME(ws.date) as weekday
    FROM weekly_schedules ws
    JOIN doctors d ON ws.doctor_id = d.doctor_id
    ORDER BY ws.doctor_id, ws.date;
  `;

  db.query(query, (err, results) => {
    if (err) {
      console.error("Error in query /api/weeklySchedules:", err);
return res.status(500).json({ message: "Error while retrieving existing schedules" });

    }
    res.json(results);
  });
});
app.post("/api/weeklySchedules", (req, res) => {
  const { doctor_id, date, start_time, end_time, is_custom } = req.body;
  const query = `
    INSERT INTO weekly_schedules (doctor_id, date, start_time, end_time, is_custom)
    VALUES (?, ?, ?, ?, ?)
    ON DUPLICATE KEY UPDATE
      start_time = VALUES(start_time),
      end_time = VALUES(end_time),
      is_custom = VALUES(is_custom)
  `;
  db.query(query, [doctor_id, date, start_time, end_time, is_custom || false], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: "Error while adding the schedule" });
}
res.json({ message: "Schedule added successfully", schedule_id: result.insertId });

  });
});

app.put("/api/weeklySchedules/:scheduleId", (req, res) => {
  const scheduleId = req.params.scheduleId;
  const { start_time, end_time, is_custom } = req.body;
  const query = `
    UPDATE weekly_schedules
    SET start_time = ?, end_time = ?, is_custom = ?
    WHERE schedule_id = ?
  `;
  db.query(query, [start_time, end_time, is_custom || false, scheduleId], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: "Error while updating the schedule" });
}
res.json({ message: "Schedule updated successfully" });

  });
});

app.delete("/api/weeklySchedules/:scheduleId", (req, res) => {
  const scheduleId = req.params.scheduleId;
  const query = "DELETE FROM weekly_schedules WHERE schedule_id = ?";
  db.query(query, [scheduleId], (err, result) => {
    if (err) {
      console.error(err);
     return res.status(500).json({ message: "Error while deleting the schedule" });
}
res.json({ message: "Schedule deleted successfully" });

  });
});
 
app.listen(3001,()=>{
    console.log("Hey po punon")
})



