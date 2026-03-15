// Middleware: blocks access if user has no active paid plan or plan is expired
const requirePlan = (req, res, next) => {
  const user = req.user;

  if (!user) return res.status(401).json({ message: 'Not authorized' });

  // Free plan — no dashboard access
  if (user.plan === 'free' || !user.plan) {
    return res.status(403).json({ message: 'Upgrade required', code: 'UPGRADE_REQUIRED' });
  }

  // Check expiry
  if (user.planExpiry && new Date(user.planExpiry) < new Date()) {
    return res.status(403).json({ message: 'Your plan has expired. Please renew.', code: 'PLAN_EXPIRED' });
  }

  if (user.subscriptionStatus !== 'active') {
    return res.status(403).json({ message: 'No active subscription', code: 'UPGRADE_REQUIRED' });
  }

  next();
};

module.exports = requirePlan;
