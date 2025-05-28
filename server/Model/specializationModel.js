const db=require('../db');

const createSpecialization=(specialization_name,callback)=>{
    const query="INSERT INTO specialization(specialization_name) VALUES (?)";
    db.query(query,[specialization_name],(err,results)=>{
        callback(err,results);
    })
}
const getSpecializations=(callback)=>{
    const query="SELECT specialization_id,specialization_name FROM specialization";
    db.query(query,(err,results)=>{
        callback(err,results);
    });
};

module.exports={
    createSpecialization,
    getSpecializations,
};