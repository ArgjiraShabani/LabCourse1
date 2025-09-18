const db = require('../db');

const getServices = (callback) => {
  const query = "SELECT * FROM services WHERE status_id = 1";
  db.query(query, (err, results) => {
    callback(err, results);
  });
};

const createService = ({ service_name, department_Id, price }, callback) => {
  const checkQuery = "SELECT * FROM services WHERE service_name = ?";
  db.query(checkQuery, [service_name], (err, results) => {
    if (err) return callback(err);

    if (results.length > 0) {
      const existingService = results[0];
      if (existingService.status_id === 2) {
        const reactivateQuery = `
          UPDATE services 
          SET status_id = 1, department_Id = ?, price = ?
          WHERE service_id = ?`;
        db.query(
          reactivateQuery,
          [department_Id, price, existingService.service_id],
          (err, res) => {
            if (err) return callback(err);
            callback(null, { ...existingService, status_id: 1, price });
          }
        );
      } else {
        return callback(new Error("Service with this name already exists"), null);
      }
    } else {
      const query = `
        INSERT INTO services (service_name, department_Id, price, status_id) 
        VALUES (?, ?, ?, 1)`;
      db.query(query, [service_name, department_Id, price], callback);
    }
  });
};

const updateService = (id, { service_name, department_Id, price }, callback) => {
  const query = "UPDATE services SET service_name = ?, department_Id = ?, price = ? WHERE service_id = ?";
  db.query(query, [service_name, department_Id, price, id], callback);
};

const deleteService = (id, callback) => {
  const query = "UPDATE services SET status_id = 2 WHERE service_id = ?";
  db.query(query, [id], callback);
};

module.exports = {
  getServices,
  createService,
  updateService,
  deleteService
};