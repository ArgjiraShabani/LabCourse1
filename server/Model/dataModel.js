const db=require('../db');

const getRoles=(callback)=>{
    db.query("SELECT role_id,role_name FROM  roles",callback);
};

const getGender=(callback)=>{
    db.query("SELECT * FROM gender",callback);
};

module.exports={
    getRoles,
    getGender,
};