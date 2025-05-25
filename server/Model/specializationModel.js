const db=require('../db');

const getSpecializations=(callback)=>{
    const query="SELECT specialization_id,specialization_name FROM specialization";
    db.query(query,(err,results)=>{
        callback(err,results);
    });
};

module.exports={
    getSpecializations,
};