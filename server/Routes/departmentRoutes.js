const express = require('express');
const router = express.Router();
const { upload } = require('../middlewares');


const {
  getDepartmentsHandler,
  createDepartmentHandler,
  updateDepartmentHandler,
  deleteDepartmentHandler
} = require('../Controllers/departmentController');

router.get('/departments', getDepartmentsHandler);
router.post('/departments', upload.single('photo'), createDepartmentHandler);
router.put('/departments/:id', upload.single('photo'), updateDepartmentHandler);
router.delete('/departments/:id', deleteDepartmentHandler);

module.exports = router;