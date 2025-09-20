const express = require('express');
const router = express.Router();
const { authenticateToken, authorizeRoles, upload } = require('../middlewares');


const {
  getDepartmentsHandler,
  createDepartmentHandler,
  updateDepartmentHandler,
  deleteDepartmentHandler
} = require('../Controllers/departmentController');

router.get('/departments', getDepartmentsHandler);
router.post('/departments',authenticateToken,upload.single('photo'),createDepartmentHandler);
router.put('/departments/:id', authenticateToken, upload.single('photo'), updateDepartmentHandler);
router.delete('/departments/:id', authenticateToken, deleteDepartmentHandler);

module.exports = router;