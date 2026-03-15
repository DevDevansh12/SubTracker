const User = require('../models/User');
const Subscription = require('../models/Subscription');

exports.getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    res.json(users);
  } catch (err) {
    next(err);
  }
};

exports.deleteUser = async (req, res, next) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    await Subscription.deleteMany({ user: req.params.id });
    res.json({ message: 'User and their subscriptions deleted' });
  } catch (err) {
    next(err);
  }
};

exports.getPlatformStats = async (req, res, next) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalSubscriptions = await Subscription.countDocuments();
    const activeSubscriptions = await Subscription.countDocuments({ status: 'active' });

    const revenueAgg = await Subscription.aggregate([
      { $match: { status: 'active' } },
      {
        $group: {
          _id: null,
          totalMonthly: {
            $sum: {
              $cond: [
                { $eq: ['$billingCycle', 'monthly'] },
                '$price',
                { $divide: ['$price', 12] },
              ],
            },
          },
        },
      },
    ]);

    const totalMonthlyRevenue = revenueAgg[0]?.totalMonthly?.toFixed(2) || 0;

    const categoryBreakdown = await Subscription.aggregate([
      { $match: { status: 'active' } },
      { $group: { _id: '$category', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]);

    res.json({
      totalUsers,
      totalSubscriptions,
      activeSubscriptions,
      totalMonthlyRevenue: +totalMonthlyRevenue,
      categoryBreakdown,
    });
  } catch (err) {
    next(err);
  }
};
