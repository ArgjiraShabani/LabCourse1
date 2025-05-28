const express=require('express');
const router=express.Router();
const multer=require('multer');
const {createReportHandler}=require('../Controllers/reportController');

const storage=multer.diskStorage({
    destination: (req,file,cb)=>cb(null,'public/reports'),
    filename: (req,file,cb)=>cb(null,Date.now()+ '-' + file.originalname),
});

const upload=multer({storage});

router.post('/reports/:patient_id',upload.single('attachment'),createReportHandler);

module.exports=router;