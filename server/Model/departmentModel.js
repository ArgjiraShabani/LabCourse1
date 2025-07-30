const db = require('../db');

const getDepartments = (callback) => {
  const query = "SELECT department_Id, department_name, description, image_path FROM departments";
  db.query(query, (err, results) => {
    callback(err, results);
  });
};

const createDepartment = ({ department_name, description, image_path }, callback) => {
  const query = "INSERT INTO departments (department_name, description, image_path) VALUES (?, ?, ?)";
  db.query(query, [department_name, description, image_path], (err, result) => {
    callback(err, result);
  });
};

const updateDepartment = ({ departmentId, department_name, description, image_path }, callback) => {
  let query, values;

  if (image_path) {
    query = "UPDATE departments SET department_name = ?, description = ?, image_path = ? WHERE department_Id = ?";
    values = [department_name, description, image_path, departmentId];
  } else {
    query = "UPDATE departments SET department_name = ?, description = ? WHERE department_Id = ?";
    values = [department_name, description, departmentId];
  }

  db.query(query, values, (err, result) => {
    callback(err, result);
  });
};

const deleteDepartment = (departmentId, callback) => {
  const query = "DELETE FROM departments WHERE department_Id = ?";
  db.query(query, [departmentId], (err, result) => {
    callback(err, result);
  });
};

module.exports = {
  getDepartments,
  createDepartment,
  updateDepartment,
  deleteDepartment
};