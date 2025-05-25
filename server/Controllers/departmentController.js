const {getDepartments}=require('../Model/departmentModel');
const getDepartmentsHandler=(req,res)=>{
    getDepartments((err,results)=>{
        if(err){
            console.error('Database error:',err);
            return res.status(500).json({error: 'Database error'});
        }
        res.json(results);
    });
};  



module.exports={
    getDepartmentsHandler,
};