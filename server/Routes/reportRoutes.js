const express=require('express');
const router=express.Router();
const multer=require('multer');
const {createReportHandler,getReportHandler}=require('../Controllers/reportController');
const {authenticateToken}=require("../middlewares.js");

const storage=multer.diskStorage({
    destination: (req,file,cb)=>cb(null,'public/reports'),
    filename: (req,file,cb)=>cb(null,Date.now()+ '-' + file.originalname),
});

const upload=multer({storage});

router.post('/reports/:patient_id', authenticateToken, upload.single('attachment'),createReportHandler);

router.get('/getReports/:patient_id/:appointment_id',authenticateToken,getReportHandler);

module.exports=router;