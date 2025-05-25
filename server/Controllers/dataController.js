const {getRoles,getGender}=require('../Model/dataModel');

const getRolesHandler=(req,res)=>{
    getRoles((err,results)=>{
        if(err) return res.status(500).json({error: 'Database error'});
        res.json(results);
        });
    
};
const getGenderHandler=(req,res)=>{
    getGender((err,results)=>{
        if(err) return res.status(500).json({error: 'Database error'});
        res.json(results);
        });
    
};

module.exports={
    getRolesHandler,
    getGenderHandler,
};