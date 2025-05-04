
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
    user:"root",
    host:"localhost",
    password:"mysql123",
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


// ==================== Departments ==================== //


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

app.listen(3001,()=>{
    console.log("Hey po punon")
})
