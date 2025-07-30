const {
  getDepartments,
  createDepartment,
  updateDepartment,
  deleteDepartment
} = require('../Model/departmentModel');

const getDepartmentsHandler = (req, res) => {
  getDepartments((err, results) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ error: 'Database error' });
    }
    res.json(results);
  });
};

const createDepartmentHandler = (req, res) => {
  const { department_name, description } = req.body;
  const image_path = req.file ? req.file.filename : null;

  createDepartment({ department_name, description, image_path }, (err, result) => {
    if (err) {
      console.error('Error creating department:', err);
      return res.status(500).json({ error: 'Error creating department' });
    }
    res.status(201).json({ message: 'Department created successfully' });
  });
};

const updateDepartmentHandler = (req, res) => {
  const { department_name, description } = req.body;
  const departmentId = req.params.id;
  const image_path = req.file ? req.file.filename : null;

  updateDepartment({ departmentId, department_name, description, image_path }, (err, result) => {
    if (err) {
      console.error('Error updating department:', err);
      return res.status(500).json({ error: 'Error updating department' });
    }
    res.json({ message: 'Department updated successfully' });
  });
};

const deleteDepartmentHandler = (req, res) => {
  const departmentId = req.params.id;

  deleteDepartment(departmentId, (err, result) => {
    if (err) {
      console.error('Error deleting department:', err);
      return res.status(500).json({ error: 'Error deleting department' });
    }
    res.json({ message: 'Department deleted successfully' });
  });
};

module.exports = {
  getDepartmentsHandler,
  createDepartmentHandler,
  updateDepartmentHandler,
  deleteDepartmentHandler
};