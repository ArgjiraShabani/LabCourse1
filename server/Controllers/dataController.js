const {getRoles,
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
    }=require('../Model/dataModel');

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

const setGenderHandler=(req,res)=>{
    try{
    const gender=req.body.gender;
    setGender(gender,(err,data)=>{
         if(err){
        console.error("Db inserton error",err);
        return res.status(500).json({error: err.message});
    }
    console.log("Insertion successful:",data);
    return res.json("Gender has been successfully created");
    });
    }catch(error){
  console.error("Server error:", error);
  return res.status(500).json({error: "Internal server error"});
 };

};

const setBloodHandler=(req,res)=>{
        try{
    const blood=req.body.blood;
    setBlood(blood,(err,data)=>{
         if(err){
        console.error("Db inserton error",err);
        return res.status(500).json({error: err.message});
    }
    console.log("Insertion successful:",data);
    return res.json("Blood has been successfully created");
    });
    }catch(error){
  console.error("Server error:", error);
  return res.status(500).json({error: "Internal server error"});
 };
};

const getStatusHandler=(req,res)=>{
     getStatus((err,results)=>{
        if(err){
            return res.json("You did not fetch Status!");
         }else{
            res.send(results);
            }
        });
};

const updateStatusHandler=(req,res)=>{
    const status=req.body.status;
    const patientId=req.body.id;
    updateStatus([status,patientId],(err,results)=>{
         if(err){
              return res.json("Didnt Update Patient!");
        }else{
            return res.json(results);
    }
    });
};

const getBloodHandler=(req,res)=>{
    getBlood((err,results)=>{
         if(err){
            return res.json("You did not fetch Blood!");
         }else{
            res.send(results);
            };
        });
};

const deleteGenderHandler=(req,res)=>{
    const id=req.body.id;
    const name=req.body.nameData;
    deleteGender([id,name],(err,results)=>{
         if (err) return res.status(500).json({ error: 'Database update failed' });
       if(results.affectedRows===0){
               res.json("This gender does not exist!")
              }else{
                   res.json(results);
        }
          
    });
};

const deleteBloodHandler=(req,res)=>{
    const id=req.body.id;
    const name=req.body.nameData;
    deleteBlood([id,name],(err,results)=>{
         if (err) return res.status(500).json({ error: 'Database update failed' });
       if(results.affectedRows===0){
               res.json("This blood does not exist!")
              }else{
                   res.json(results);
        }
          
    });
};

const updateBloodHandler=(req,res)=>{
    const id=req.body.id;
    const newValue=req.body.newValue;
    updateBlood([newValue,id],(err,results)=>{
        if(err){
              return res.status(500).json({error: "Database error"});
            }
        if(results.affectedRows===0){
               res.json("This blood does not exist!")
          }else{
                   res.json(results);
              };
    });
};

const updateGenderHandler=(req,res)=>{
    const id=req.body.id;
    const newValue=req.body.newValue;
    updateGender([newValue,id],(err,results)=>{
        if(err){
              return res.status(500).json({error: "Database error"});
            }
        if(results.affectedRows===0){
               res.json("This gender does not exist!")
          }else{
                   res.json(results);
              };
    });
};

const setRoleHandler=(req,res)=>{
    const role=req.body.role;
    setRole(role,(err,results)=>{
            if(err){
            return res.json("You did not add Role!");
            }else{
            res.send(results);
            }
     });
};

const getFeedbacksAdminHandler=(req,res)=>{
    getFeedbacksAdmin((err,result)=>{
        if (err) {
            console.error('Error getting feedback:', err);
            return res.status(500).json({ error: 'Database error' });
         };
            res.status(200).json(result);

    });
};

const updateFeedbacksAdminHandler=(req,res)=>{
    const id=req.params.id;
    updateFeedbacksAdmin(id,(err,result)=>{
      if(err){
        return res.json("Error");
      }else{
        res.send(result)
      };
    });
};





module.exports={
    getRolesHandler,
    getGenderHandler,
    setGenderHandler,
    setBloodHandler,
    getStatusHandler,
    updateStatusHandler,
    getBloodHandler,
    deleteGenderHandler,
    deleteBloodHandler,
    updateBloodHandler,
    updateGenderHandler,
    setRoleHandler,
    getFeedbacksAdminHandler,
    updateFeedbacksAdminHandler,
    
};