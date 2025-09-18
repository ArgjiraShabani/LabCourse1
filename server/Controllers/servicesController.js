const {
  getServices,
  createService,
  updateService,
  deleteService
} = require('../Model/servicesModel');

const getServicesHandler = (req, res) => {
  getServices((err, results) => {
    if (err) {
      console.error('Error fetching services:', err);
      return res.status(500).json({ error: 'Error fetching services' });
    }
    res.json(results);
  });
};

const createServiceHandler = (req, res) => {
  const { service_name, department_Id, price } = req.body;
  createService({ service_name, department_Id, price }, (err, result) => {
    if (err) {
      console.error('Error creating service:', err);
      return res.status(500).json({ error: err.message || 'Error creating service' });
    }
    res.status(201).json({ message: 'Service created successfully', service: { service_name, department_Id, price } });
  });
};

const updateServiceHandler = (req, res) => {
  const { service_name, department_Id, price } = req.body;
  const id = req.params.id;
  updateService(id, { service_name, department_Id, price }, (err, result) => {
    if (err) {
      console.error('Error updating service:', err);
      return res.status(500).json({ error: err.message || 'Error updating service' });
    }
    res.status(200).json({ message: 'Service updated successfully', service: { service_name, department_Id, price } });
  });
};

const deleteServiceHandler = (req, res) => {
  const id = req.params.id;
  deleteService(id, (err, result) => {
    if (err) {
      console.error('Error deleting service:', err);
      return res.status(500).json({ error: 'Error deleting service' });
    }
    res.status(200).json({ message: 'Service deleted successfully' });
  });
};

module.exports = {
  getServicesHandler,
  createServiceHandler,
  updateServiceHandler,
  deleteServiceHandler
};