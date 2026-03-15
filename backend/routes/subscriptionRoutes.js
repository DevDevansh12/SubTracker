const express = require('express');
const router = express.Router();
const {
  getSubscriptions,
  getSubscription,
  createSubscription,
  updateSubscription,
  deleteSubscription,
  getDashboardStats,
  getAnalytics,
} = require('../controllers/subscriptionController');
const { protect } = require('../middleware/auth');
const requirePlan = require('../middleware/requirePlan');

router.use(protect, requirePlan);

router.get('/dashboard', getDashboardStats);
router.get('/analytics', getAnalytics);
router.route('/').get(getSubscriptions).post(createSubscription);
router.route('/:id').get(getSubscription).put(updateSubscription).delete(deleteSubscription);

module.exports = router;
