const express = require('express');
const router = express.Router();
const { getAllUsers, deleteUser, getPlatformStats } = require('../controllers/adminController');
const { protect, adminOnly } = require('../middleware/auth');

router.use(protect, adminOnly);

router.get('/users', getAllUsers);
router.delete('/users/:id', deleteUser);
router.get('/stats', getPlatformStats);

module.exports = router;
