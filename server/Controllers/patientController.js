const dayjs=require('dayjs');
const bcrypt=require("bcrypt");


const {getPatientAppointments,
      getPatientById,
      getAllPatients,
      deletePatientById,
      removePhoto,
      getOldPassword,
      changePassword,
      getImagePath,
      getGender,
      getBlood,
      updatePatient,
      getPatient,
      getEmail,
      getStatus,
      getRole,
      registerPatient,
      setFeedbacks,
      getFeedbacksPatient,
      deleteFeedback,
      getPatientForUpdation,
      updatePatientAdmin,
      getPatientsForDropdown,
      updateFeedback,
    updatePatientAdminWithoutImage} =require('../Model/patientModel');


const getPatientByIdHandler=(req,res)=>{
      const patientId=req.params.id;

    getPatientById(patientId,(err,results)=>{
        if(err){
      res.json(err)
  }else{
       const data = results[0];

        if (data.date_of_birth instanceof Date) {
          data.date_of_birth = dayjs(data.date_of_birth).format('YYYY-MM-DD');
        }
          res.send(data);
  };
    });
};

const getAllPatientsHandler=(req,res)=>{
    getAllPatients((err,result)=>{
    if(err){
      console.log(err);
    }else{
       const data = result.map(patient => {
        if (patient.date_of_birth) {
          patient.date_of_birth = dayjs(patient.date_of_birth).format('YYYY-MM-DD');
        }
        return patient;
      });
         res.send(data);
  }
  });
};

const deletePatientByIdHandler=(req,res)=>{
  const id=req.params.id;
  deletePatientById(id,(err,result)=>{
     if(err){
      return res.status(500).json({ error: "Error deleting patient" });
    }else{
      res.send(result)
    };
  });
};

const removePhotoHandler=(req,res)=>{
  const id=req.params.id;
  removePhoto(id,(err,result)=>{
     if(err){
        return res.status(500).json({ error: "Database error" })
    }else{
      res.send(result);
    };
  });
};
/*
const changePasswordHandler=(req,res)=>{
  const oldPassword=req.body.oldPassword;
  const newPassword=req.body.password;
  const id=req.body.id;
  getOldPassword([id],(err,result)=>{
    if(err){
      console.log(err);
    }
      if(result.length>0){
        const storedPassword=result[0].password;
         bcrypt.compare(oldPassword, storedHashedPassword)
          .then(isMatch => {
            if (!isMatch) {
              return res.status(401).json("Old password is wrong!");
            }
        bcrypt.hash(newPassword, 10).then((hashedPassword) => {
        changePassword([hashedPassword,id],(err,result)=>{
          if(err){
            console.log(err);
            return res.status(500).json("Failed to update password");
          }
            res.json("Changed");
          
        });
        })
      .catch(hashErr => {
            console.error(hashErr);
            res.status(500).json("Error hashing new password");
          });
        })
        .catch(compareErr => {
        console.error(compareErr);
        res.status(500).json("Error comparing passwords");
    });
  });
};
*/
const changePasswordHandler = (req, res) => {
  const oldPassword = req.body.oldPassword;
  const newPassword = req.body.password;
  const id = req.body.id;

  getOldPassword([id], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json("Internal server error");
    }

    if (result.length > 0) {
      const storedPassword = result[0].password;

      bcrypt.compare(oldPassword, storedPassword)
        .then(isMatch => {
          if (!isMatch) {
            return res.status(401).json("Old password is wrong!");
          }

          bcrypt.hash(newPassword, 10)
            .then(hashedPassword => {
              changePassword([hashedPassword, id], (err, result) => {
                if (err) {
                  console.error(err);
                  return res.status(500).json("Failed to update password");
                }
                res.json("Changed");
              });
            })
            .catch(hashErr => {
              console.error(hashErr);
              res.status(500).json("Error hashing new password");
            });
        })
        .catch(compareErr => {
          console.error(compareErr);
          res.status(500).json("Error comparing passwords");
        });
    } else {
      res.status(404).json("User not found");
    }
  });
};

const updatePatientHandler=(req,res)=>{
  const id=req.params.id;
  const first_name=req.body.first_name;
  const last_name=req.body.last_name;
  const phone=req.body.phone;
  const birth=req.body.date_of_birth;
  const gender_name=req.body.gender_name==='null' ? null:req.body.gender_name;
  const blood=req.body.blood_type==='null' ? null:req.body.blood_type;
  let genderId=null;
  let bloodId=null;

  getImagePath(id, (err, data) => {
  if (err) {
    return res.json("Didnt fetch image!");
  }
  if (data.length > 0) {
    const imageFetch = data[0].image_path;
    const image = req.file ? req.file.filename : imageFetch;

    // First get genderId
    if (gender_name === "null" || !gender_name) {
      genderId = null;
      // Then get bloodId inside this block
      if (blood === "null" || !blood) {
        bloodId = null;
        // Now call updatePatient here
        updatePatient([first_name, last_name, phone, birth, genderId, bloodId, image, id], (err, data) => {
          if (err) {
            return res.json("Error");
          }
          getPatient(id, (err, results) => {
            if (err) {
              console.log(err);
            } else {
              const data = results[0];
              if (data.date_of_birth instanceof Date) {
                data.date_of_birth = dayjs(data.date_of_birth).format('YYYY-MM-DD');
              }
              res.send(data);
            }
          });
        });
      } else {
        getBlood(blood, (err, data) => {
          if (err) {
            return res.json("Error");
          }
          if (data.length > 0) {
            bloodId = data[0].blood_id;
          }
          // Now call updatePatient here
          updatePatient([first_name, last_name, phone, birth, genderId, bloodId, image, id], (err, data) => {
            if (err) {
              return res.json("Error");
            }
            getPatient(id, (err, results) => {
              if (err) {
                console.log(err);
              } else {
                const data = results[0];
                if (data.date_of_birth instanceof Date) {
                  data.date_of_birth = dayjs(data.date_of_birth).format('YYYY-MM-DD');
                }
                res.send(data);
              }
            });
          });
        });
      }
    } else {
      getGender(gender_name, (err, data) => {
        if (err) {
          return res.json("Didnt fetch gender id!!");
        }
        if (data.length > 0) {
          genderId = data[0].gender_id;
        }
        // Now handle blood inside here
        if (blood === "null" || !blood) {
          bloodId = null;
          updatePatient([first_name, last_name, phone, birth, genderId, bloodId, image, id], (err, data) => {
            if (err) {
              return res.json("Error");
            }
            getPatient(id, (err, results) => {
              if (err) {
                console.log(err);
              } else {
                const data = results[0];
                if (data.date_of_birth instanceof Date) {
                  data.date_of_birth = dayjs(data.date_of_birth).format('YYYY-MM-DD');
                }
                res.send(data);
              }
            });
          });
        } else {
          getBlood(blood, (err, data) => {
            if (err) {
              return res.json("Error");
            }
            if (data.length > 0) {
              bloodId = data[0].blood_id;
            }
            updatePatient([first_name, last_name, phone, birth, genderId, bloodId, image, id], (err, data) => {
              if (err) {
                return res.json("Error");
              }
              getPatient(id, (err, results) => {
                if (err) {
                  console.log(err);
                } else {
                  const data = results[0];
                  if (data.date_of_birth instanceof Date) {
                    data.date_of_birth = dayjs(data.date_of_birth).format('YYYY-MM-DD');
                  }
                  res.send(data);
                }
              });
            });
          });
        }
      });
    }
  }
});

           }
 


const registerPatientHandler=(req,res)=>{
  const name=req.body.first_name;
  const lastname=req.body.last_name;
  const email=req.body.email;
  const password=req.body.password;
  const number=req.body.number;
  const birth=req.body.birth;
  const gender=req.body.gender;
  const blood=req.body.blood;
  const status=req.body.status;
  const image = req.file ? req.file.filename : null;
  bcrypt.hash(password, 10, (err, hashedPassword) => {
  if (err) {
    console.error('Error hashing password:', err);

  }
   getEmail([email,email,email],(err,data)=>{   
      if(err){
           return res.json("Error 1");
        }
                    

          if(data.length>0){
            return res.json("This email exists.Please choose another one!")
          }else{
          getGender([gender],(err,data)=>{
            if(err){
              return res.json("Didnt fetch gender id!!");
            }
            
              if(data.length>0){
                const genderId=data[0].gender_id;
            
          
            getBlood([blood],(err,data)=>{
              if(err){
                return res.json("Error");
              }
                if(data.length>0){
                  const bloodId=data[0].blood_id;


                getStatus([status],(err,data)=>{
                  if(err){
                    return res.json("Error");
                  }
                    if(data.length>0){
                      const statusId=data[0].status_id;

                              getRole(['patient'],(err,data)=>{
                                if(err){
                                  return res.json("Error");
                                }
                                  if(data.length>0){
                                    const roleId=data[0].role_id;

                    registerPatient([name, lastname, email, hashedPassword, number,roleId, birth, genderId, bloodId, statusId,image],(err,data)=>{
                    if(err){
                      return res.json("Error");
                    }                       
                       return res.json("");
                        
                  });
                  }else{
                          return res.json("No matching role found");
                        };
                        });
                      }else{
                          return res.json("No matching status found");
                        };
                        });
                  }else{
                    return res.json("No matching blood found");
                  };
                  });
            }else{
              return res.json("No matching gender found");
            }
              });
            }});
            });
};

const setFeedbacksHandler=(req,res)=>{
     const text=req.body.text;
     const id=req.body.id;
    setFeedbacks([text,id],(err,result)=>{
    if (err) {
      console.error('Error inserting feedback:', err);
      return res.status(500).json({ error: 'Database insert error' });
    };
    res.status(201).json({ message: 'Feedback inserted successfully' });
    });
};

const getFeedbacksPatientHandler=(req,res)=>{
    const id=req.params.id;
    getFeedbacksPatient(id,(err,result)=>{
        if (err) {
      console.error('Error getting feedback:', err);
      return res.status(500).json({ error: 'Database error' });
    };
      res.status(200).json(result);
    });
};

const deleteFeedbackHandler=(req,res)=>{
  const id=req.params.id;
  deleteFeedback(id,(err,result)=>{
     if(err){
      return res.json("Error");
    }else{
      res.send(result)
    }
  });
};

const updateFeedbackHandler=(req,res)=>{

  const id=req.params.id;
  const newFeedback=req.body.feedback_text;
  updateFeedback([newFeedback,id],(err,result)=>{
    if(err){
      return res.json("Error");
    }else{
      res.send(result)
    };
  });
}

const getPatientForUpdationHandler=(req,res)=>{
  const id=req.params.id;
  getPatientForUpdation(id,(err,result)=>{
     if (err) {
      console.error('Error getting feedback:', err);
      return res.status(500).json({ error: 'Database error' });
    }else{
      if (result && result[0].date_of_birth) {
          result[0].date_of_birth = dayjs(result[0].date_of_birth).format('YYYY-MM-DD');
        }
          res.send(result);
    }
      
    });
  };

const updatePatientAdminHandler=(req,res)=>{
  const id=req.params.id;
  const name = req.body.first_name;
  const lastname = req.body.last_name;
  const email=req.body.email;
  const number = req.body.phone;
  const birth = req.body.date_of_birth;
  const gender = req.body.gender_name==='null' ? null:req.body.gender_name;
  console.log(gender)
  const image=req.file ? req.file.filename :null;
  if(image){
  updatePatientAdmin([name,lastname,email,number,birth,gender,image,id],(err,data)=>{
      if (err) {
      console.error('Error getting feedback:', err);
      return res.status(500).json({ error: 'Database error' });
    }else{
      if (data && data.date_of_birth) {
          data.date_of_birth = dayjs(data.date_of_birth).format('YYYY-MM-DD');
        }
          res.send(data);
    };
     
  });
}else{
  updatePatientAdminWithoutImage([name,lastname,email,number,birth,gender,id],(err,data)=>{
      if (err) {
      console.error('Error getting feedback:', err);
      return res.status(500).json({ error: 'Database error' });
    }else{
      if (data && data.date_of_birth) {
          data.date_of_birth = dayjs(data.date_of_birth).format('YYYY-MM-DD');
        }
          res.send(data);
    };
     
  });
}
};

const getPatientsForDropdownHandler = (req, res) => {
  getPatientsForDropdown((err, results) => {
    if (err) {
      console.error('Error fetching patients for dropdown:', err);
      return res.status(500).json({ error: 'Database error' });
    }
    res.json(results);
  });
};

module.exports={
    getPatientByIdHandler,
    getAllPatientsHandler,
    deletePatientByIdHandler,
    removePhotoHandler,
    changePasswordHandler,
    updatePatientHandler,
    registerPatientHandler,
    setFeedbacksHandler,
    getFeedbacksPatientHandler,
    deleteFeedbackHandler,
    getPatientForUpdationHandler,
    updatePatientAdminHandler,
    getPatientsForDropdownHandler,
    updateFeedbackHandler,
    
}