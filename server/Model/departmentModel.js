const db=require('../db');

const getDepartments=(callback)=>{
    const query="SELECT department_Id,department_name FROM departments";
    db.query(query,(err,results)=>{
        callback(err,results);
    });
};

module.exports={
    getDepartments,
};