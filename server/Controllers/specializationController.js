const  {getSpecializations}= require('../Model/specializationModel');

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
    getSpecializationsHandler,
};
