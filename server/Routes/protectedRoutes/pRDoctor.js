const express = require('express');
const router = express.Router();
const { authenticateToken, authorizeRoles } = require('../../middlewares');

router.use(authenticateToken);
router.use(authorizeRoles('doctor'));
router.get('/dashboard', (req, res) => {
  res.json({ message: "Welcome Doctor", user: req.user });
});

module.exports = router;