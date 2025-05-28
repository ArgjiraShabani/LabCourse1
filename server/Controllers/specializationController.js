const  {createSpecialization,getSpecializations}= require('../Model/specializationModel');

const createSpecializationHandler=(req,res)=>{
    const {specialization_name}=req.body;
    if(!specialization_name){
           
            return res.status(400).json({error: "Specialization name is required"});
        }
    createSpecialization(specialization_name,(err,results)=>{
        if(err){
            console.error("Database error",err);
            return res.status(500).json({error: "Database error"});
        }
        
        res.status(201).json({message: "Specialization created successfully",id: results.insertId});
    });
};
const getSpecializationsHandler=(req,res)=>{
    getSpecializations((err,results)=>{
        if(err){
            console.error("Database error",err);
            return res.status(500).json({error: "Database error"});
        }
        res.json(results);
    });
};

module.exports={
    createSpecializationHandler,
    getSpecializationsHandler,
};
