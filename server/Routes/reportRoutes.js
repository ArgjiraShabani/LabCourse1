const express=require('express');
const router=express.Router();
const multer=require('multer');
const {createReportHandler,getReportHandler, deleteReportHandler}=require('../Controllers/reportController');
const {authenticateToken, authorizeRoles}=require("../middlewares.js");

const storage=multer.diskStorage({
    destination: (req,file,cb)=>cb(null,'public/reports'),
    filename: (req,file,cb)=>cb(null,Date.now()+ '-' + file.originalname),
});

const upload=multer({storage});

router.post('/reports/:patient_id', authenticateToken,   upload.single('attachment'),createReportHandler);

router.get('/getReports/:patient_id/:appointment_id', authenticateToken,getReportHandler);
router.delete('/deleteReports/:result_id', authenticateToken, deleteReportHandler);

module.exports=router;