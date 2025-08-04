const  {createSpecialization,getSpecializations,deleteSpecialization, updateSpecialization}= require('../Model/specializationModel');

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
const deleteSpecializationHandler=(req,res)=>{
    const specializationId=req.params.specialization_id;
    deleteSpecialization(specializationId,(err,results)=>{
        if(err){
            console.error("Database error:", err);
            return res.status(500).json({error: "Database error"});
        }
        if(results.affectedRows===0){
            return res.status(404).json({error: "Specialization not found"});

        }
        res.json({message: "Specialization deleted successfully!"});

    });
};
const updateSpecializationHandler=(req,res)=>{
    const {specialization_id}=req.params;
    const {specialization_name}=req.body;

    if(!specialization_name || !specialization_id){
        return res.status(400).json({error: "Missing specialization Id or name"});
    }
    updateSpecialization(specialization_id,specialization_name,(err,results)=>{
        if(err){
            console.error("Database error:", err);
            return res.status(500).json({error: "Database error"});
        }

        if(results.affectedRows===0){
            return res.status(404).json({error: "Specialization not found."});


        }
        res.json({message: "Specialization updated successfilly"});
    });

};

module.exports={
    createSpecializationHandler,
    getSpecializationsHandler,
    deleteSpecializationHandler,
    updateSpecializationHandler
    
};
