const db = require('../db');

const getServices = (callback) => {
  const query = "SELECT * FROM services";
  db.query(query, (err, results) => {
    callback(err, results);
  });
};

const createService = ({ service_name, department_Id }, callback) => {
  const query = "INSERT INTO services (service_name, department_Id) VALUES (?, ?)";
  db.query(query, [service_name, department_Id], callback);
};

const updateService = (id, { service_name, department_Id }, callback) => {
  const query = "UPDATE services SET service_name = ?, department_Id = ? WHERE service_id = ?";
  db.query(query, [service_name, department_Id, id], callback);
};

const deleteService = (id, callback) => {
  const query = "DELETE FROM services WHERE service_id = ?";
  db.query(query, [id], callback);
};

module.exports = {
  getServices,
  createService,
  updateService,
  deleteService
};