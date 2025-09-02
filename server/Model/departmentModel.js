const db = require('../db');

const getDepartments = (callback) => {
  const query = "SELECT department_Id, department_name, description, image_path, status_id FROM departments WHERE status_id = 1";
  db.query(query, (err, results) => {
    callback(err, results);
  });
};


const createDepartment = ({ department_name, description, image_path, status_id = 1 }, callback) => {
  const checkQuery = "SELECT * FROM departments WHERE department_name = ?";
  
  db.query(checkQuery, [department_name], (err, results) => {
    if (err) return callback(err, null);

    if (results.length > 0) {
      const department = results[0];

      if (department.status_id === 2) {
        const updateQuery = "UPDATE departments SET description = ?, image_path = ?, status_id = 1 WHERE department_Id = ?";
        db.query(updateQuery, [description, image_path, department.department_Id], (err2, result) => {
          if (err2) return callback(err2, null);
          return callback(null, { message: "Department reactivated successfully", result });
        });
      } else {
        return callback(new Error("A department with this name already exists"), null);
      }
    } else {
      const insertQuery = "INSERT INTO departments (department_name, description, image_path, status_id) VALUES (?, ?, ?, ?)";
      db.query(insertQuery, [department_name, description, image_path, status_id], (err3, result) => {
        if (err3) return callback(err3, null);
        return callback(null, { message: "Department created successfully", result });
      });
    }
  });
};


const updateDepartment = ({ departmentId, department_name, description, image_path, status_id }, callback) => {
  const checkQuery = "SELECT * FROM departments WHERE department_name = ? AND department_Id != ?";
  
  db.query(checkQuery, [department_name, departmentId], (err, results) => {
    if (err) return callback(err, null);

    if (results.length > 0) {
      return callback(new Error("A department with this name already exists"), null);
    }

    let query, values;
    if (image_path) {
      query = "UPDATE departments SET department_name = ?, description = ?, image_path = ?, status_id = ? WHERE department_Id = ?";
      values = [department_name, description, image_path, status_id, departmentId];
    } else {
      query = "UPDATE departments SET department_name = ?, description = ?, status_id = ? WHERE department_Id = ?";
      values = [department_name, description, status_id, departmentId];
    }

    db.query(query, values, (err, result) => {
      callback(err, result);
    });
  });
};

const deleteDepartment = (departmentId, callback) => {
  const updateDept = "UPDATE departments SET status_id = 2 WHERE department_Id = ?";
  const updateServices = "UPDATE services SET status_id = 2 WHERE department_Id = ?";

  db.query(updateDept, [departmentId], (err, res) => {
    if (err) return callback(err);

    db.query(updateServices, [departmentId], (err2, res2) => {
      if (err2) return callback(err2);

      callback(null, { department: res, services: res2 });
    });
  });
};

module.exports = {
  getDepartments,
  createDepartment,
  updateDepartment,
  deleteDepartment
};