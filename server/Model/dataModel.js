const { query } = require('express-validator');
const db=require('../db');

const getRoles=(callback)=>{
    db.query("SELECT role_id,role_name FROM  roles",callback);
};

const getGender=(callback)=>{
    db.query("SELECT * FROM gender",callback);
};

const setGender=(gender,callback)=>{
    const sql='INSERT INTO gender(gender_name) values(?)';
    db.query(sql,[gender],callback);
};

const setBlood=(blood,callback)=>{
    const sql='INSERT INTO blood(blood_type) values(?)';
    db.query(sql,[blood],callback);
};

const getStatus=(callback)=>{
    const sql='Select * from status';
    db.query(sql,callback);
};

const updateStatus=(params,callback)=>{
    const sql='update patients set status_id=2 where patient_id=?';
    db.query(sql,params,callback);
};

const getBlood=(callback)=>{
    const sql='Select * from blood';
    db.query(sql,callback);
};

const deleteGender=(params,callback)=>{
    const sql='DELETE FROM gender WHERE gender_id=? AND gender_name=?';
    db.query(sql,params,callback);
};

const deleteBlood=(params,callback)=>{
    const sql='DELETE FROM blood WHERE blood_id=? AND blood_type=?';
    db.query(sql,params,callback);
};

const updateBlood=(params,callback)=>{
    const sql="UPDATE blood SET blood_type=? WHERE blood_id=?";
    db.query(sql,params,callback);
};

const updateGender=(params,callback)=>{
    const sql="UPDATE gender SET gender_name=? WHERE gender_id=?";
    db.query(sql,params,callback);
};

const setRole=(role,callback)=>{
    const sql='INSERT INTO roles(role_name) values(?)';
    db.query(sql,role,callback);
};

const getFeedbacksAdmin=(callback)=>{
    const sql='Select * from feedbacks inner join patients on patients.patient_id=feedbacks.patient_id where feedbacks.is_deleted=FALSE';
    db.query(sql,callback);
};

const updateFeedbacksAdmin=(id,callback)=>{
    const sql='update feedbacks set is_deleted=TRUE where feedback_id=?';
    db.query(sql,id,callback);
};



module.exports={
    getRoles,
    getGender,
    setGender,
    setBlood,
    getStatus,
    updateStatus,
    getBlood,
    deleteGender,
    deleteBlood,
    updateBlood,
    updateGender,
    setRole,
    getFeedbacksAdmin,
    updateFeedbacksAdmin,

};