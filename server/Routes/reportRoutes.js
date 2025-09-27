const express=require('express');
const router=express.Router();
const multer=require('multer');
const {createReportHandler,getReportHandler, deleteReportHandler, updateReportHandler, getReportByIdHandler}=require('../Controllers/reportController');
const {authenticateToken, authorizeRoles}=require("../middlewares.js");

const storage=multer.diskStorage({
    destination: (req,file,cb)=>cb(null,'public/reports'),
    filename: (req,file,cb)=>cb(null,Date.now()+ '-' + file.originalname),
});

const upload=multer({storage});

router.post('/reports/:patient_id', authenticateToken,   upload.single('attachment'),createReportHandler);

router.get('/getReports/:patient_id/:appointment_id', authenticateToken,getReportHandler);
router.delete('/deleteReports/:result_id', authenticateToken, deleteReportHandler);
router.put('/updateReports/:result_id', authenticateToken,upload.single('attachment'), updateReportHandler);
router.get('/getReportId/:result_id', authenticateToken,getReportByIdHandler);
router.get('/checkAuth', authenticateToken, (req, res) => {
    res.status(200).json({ message: "Authenticated" });
});
module.exports=router;