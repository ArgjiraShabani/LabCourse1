const express=require('express');
const router=express.Router();
const multer=require('multer');
const {createReportHandler,getReportHandler}=require('../Controllers/reportController');

const storage=multer.diskStorage({
    destination: (req,file,cb)=>cb(null,'public/reports'),
    filename: (req,file,cb)=>cb(null,Date.now()+ '-' + file.originalname),
});

const upload=multer({storage});

router.post('/reports/:patient_id/:doctor_id',upload.single('attachment'),createReportHandler);

router.get('/getReports/:patient_id/:doctor_id/:appointment_id',getReportHandler);

module.exports=router;