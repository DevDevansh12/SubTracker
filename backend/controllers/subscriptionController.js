const Subscription = require('../models/Subscription');

exports.getSubscriptions = async (req, res, next) => {
  try {
    const { status, category } = req.query;
    const filter = { user: req.user._id };
    if (status) filter.status = status;
    if (category) filter.category = category;

    const subscriptions = await Subscription.find(filter).sort({ nextBillingDate: 1 });
    res.json(subscriptions);
  } catch (err) {
    next(err);
  }
};

exports.getSubscription = async (req, res, next) => {
  try {
    const sub = await Subscription.findOne({ _id: req.params.id, user: req.user._id });
    if (!sub) return res.status(404).json({ message: 'Subscription not found' });
    res.json(sub);
  } catch (err) {
    next(err);
  }
};

exports.createSubscription = async (req, res, next) => {
  try {
    const sub = await Subscription.create({ ...req.body, user: req.user._id });
    res.status(201).json(sub);
  } catch (err) {
    next(err);
  }
};

exports.updateSubscription = async (req, res, next) => {
  try {
    const sub = await Subscription.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      { ...req.body, reminderSent: false },
      { new: true, runValidators: true }
    );
    if (!sub) return res.status(404).json({ message: 'Subscription not found' });
    res.json(sub);
  } catch (err) {
    next(err);
  }
};

exports.deleteSubscription = async (req, res, next) => {
  try {
    const sub = await Subscription.findOneAndDelete({ _id: req.params.id, user: req.user._id });
    if (!sub) return res.status(404).json({ message: 'Subscription not found' });
    res.json({ message: 'Subscription deleted' });
  } catch (err) {
    next(err);
  }
};

exports.getDashboardStats = async (req, res, next) => {
  try {
    const subs = await Subscription.find({ user: req.user._id, status: 'active' });

    const totalMonthly = subs.reduce((acc, s) => acc + s.monthlyPrice, 0);
    const totalYearly = +(totalMonthly * 12).toFixed(2);

    const today = new Date();
    const in30Days = new Date();
    in30Days.setDate(today.getDate() + 30);

    const upcoming = subs
      .filter((s) => s.nextBillingDate >= today && s.nextBillingDate <= in30Days)
      .sort((a, b) => a.nextBillingDate - b.nextBillingDate);

    const byCategory = subs.reduce((acc, s) => {
      acc[s.category] = (acc[s.category] || 0) + s.monthlyPrice;
      return acc;
    }, {});

    res.json({
      totalMonthly: +totalMonthly.toFixed(2),
      totalYearly,
      activeCount: subs.length,
      upcomingBillings: upcoming,
      byCategory,
    });
  } catch (err) {
    next(err);
  }
};

exports.getAnalytics = async (req, res, next) => {
  try {
    const subs = await Subscription.find({ user: req.user._id, status: 'active' });

    const byCategory = subs.reduce((acc, s) => {
      const existing = acc.find((x) => x.category === s.category);
      if (existing) existing.amount += s.monthlyPrice;
      else acc.push({ category: s.category, amount: +s.monthlyPrice });
      return acc;
    }, []);

    byCategory.forEach((c) => (c.amount = +c.amount.toFixed(2)));

    const topExpensive = [...subs]
      .sort((a, b) => b.monthlyPrice - a.monthlyPrice)
      .slice(0, 5)
      .map((s) => ({ name: s.name, monthlyPrice: s.monthlyPrice, category: s.category }));

    // Monthly spending for last 6 months (simulated from nextBillingDate)
    const monthlyTrend = Array.from({ length: 6 }, (_, i) => {
      const d = new Date();
      d.setMonth(d.getMonth() - (5 - i));
      return {
        month: d.toLocaleString('default', { month: 'short', year: '2-digit' }),
        amount: +subs.reduce((acc, s) => acc + s.monthlyPrice, 0).toFixed(2),
      };
    });

    res.json({ byCategory, topExpensive, monthlyTrend });
  } catch (err) {
    next(err);
  }
};
