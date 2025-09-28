const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");
const multer = require("multer");
const path = require("path");
const { emit } = require("process");
const { error } = require("console");
const bcrypt = require("bcrypt");
const cron = require("node-cron");
const { ResultWithContextImpl } = require("express-validator/lib/chain");
const doctorRoutes = require("./Routes/doctorRoutes");
const departmentRoutes = require("./Routes/departmentRoutes");
const dataRoutes = require("./Routes/dataRoutes");
const specializationRoutes = require("./Routes/specializationRoutes");
const reportRoutes = require("./Routes/reportRoutes");
const db = require("./db");
const cookieParser = require("cookie-parser");
const loginRoutes = require("./Routes/loginRoute");
const signUpRoutes = require("./Routes/signupRoute");
const pRPatient = require("./Routes/protectedRoutes/pRPatient");
const pRAdmin = require("./Routes/protectedRoutes/pRAdmin");
const patientRoutes = require("./Routes/patientRoutes");
const app = express();
const dayjs = require("dayjs");
const standardScheduleRoutes = require("./Routes/standardScheduleRoutes");
const serviceRoutes = require("./Routes/servicesRoutes");
const weeklyScheduleRoutes = require("./Routes/weeklyScheduleRoutes");
const pRDoctor = require("./Routes/protectedRoutes/pRDoctor");
const appointmentRoutes = require("./Routes/appointmentRoutes");
const emailRoutes =require("./Routes/emailRoute");
const logoutRoutes = require("./Routes/logoutRoutes");
const adminRoutes = require("./Routes/adminRoutes");
const adminController = require("./Controllers/adminController");
const settingsRoutes = require('./Routes/settingsRoutes');
const initAdminUser=require("./Routes/initAdmin");
const forgotPasswordRoutes=require("./Routes/forgotPasswordRoute");
const resetPasswordRoutes=require("./Routes/resetPasswordRoute");
const auditRoutes = require("./Routes/auditRoutes");

app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true, 
  })
);
app.use("/reports", express.static(path.join(__dirname, "public/reports")));

app.use(express.json());
app.use(cookieParser());
initAdminUser();
app.use("/", loginRoutes);
app.use("/", logoutRoutes);
app.use("/", pRPatient);
app.use("/", pRAdmin);
app.use("/", signUpRoutes);
app.use("/patient", patientRoutes);
app.use("/api", departmentRoutes);
app.use("/api", serviceRoutes);
app.use("/api", pRDoctor);
app.use("/", appointmentRoutes);
app.use("/api/admin", adminRoutes);
app.use('/api/settings', settingsRoutes);

app.use("/uploads", express.static("public/uploads"));

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/uploads");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage: storage });


app.use("/api", doctorRoutes);
app.use("/api", departmentRoutes);
app.use("/api", dataRoutes);
app.use("/api", specializationRoutes);
app.use("/api", reportRoutes);
app.use("/api", emailRoutes);
app.use("/api", standardScheduleRoutes);
app.use("/api/weekly-schedules", weeklyScheduleRoutes);
app.use("/api", forgotPasswordRoutes);
app.use("/api",resetPasswordRoutes);
app.use("/api", auditRoutes);


app.listen(3001, () => {
  console.log("Hey po punon");
});

