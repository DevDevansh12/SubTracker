const Razorpay = require('razorpay');
const crypto = require('crypto');
const User = require('../models/User');

// Lazy init — avoids crash on startup if keys are missing
let _razorpay = null;
const getRazorpay = () => {
  if (!_razorpay) {
    const keyId = process.env.RAZORPAY_KEY_ID;
    const keySecret = process.env.RAZORPAY_KEY_SECRET;
    if (!keyId || keyId.includes('XXXX') || !keySecret || keySecret.includes('XXXX')) {
      throw new Error('Razorpay keys are not configured. Add RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET to backend/.env');
    }
    _razorpay = new Razorpay({ key_id: keyId, key_secret: keySecret });
  }
  return _razorpay;
};

// Plan config — amounts in paise (INR smallest unit: 100 paise = ₹1)
const PLANS = {
  pro:  { amount: 19900, currency: 'INR', label: 'Pro Plan',  days: 30 },
  team: { amount: 49900, currency: 'INR', label: 'Team Plan', days: 30 },
};

// POST /api/payment/create-order
exports.createOrder = async (req, res, next) => {
  try {
    const razorpay = getRazorpay();
    const { planId } = req.body;
    const plan = PLANS[planId];
    if (!plan) return res.status(400).json({ message: 'Invalid plan. Must be "pro" or "team".' });

    const order = await razorpay.orders.create({
      amount: plan.amount,
      currency: plan.currency,
      receipt: `rcpt_${req.user._id}_${Date.now()}`,
      notes: { userId: req.user._id.toString(), planId },
    });

    res.json({
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      planId,
      planLabel: plan.label,
      keyId: process.env.RAZORPAY_KEY_ID,
    });
  } catch (err) {
    // Surface Razorpay API errors clearly
    if (err.error) {
      return res.status(502).json({ message: `Razorpay error: ${err.error.description || JSON.stringify(err.error)}` });
    }
    next(err);
  }
};

// POST /api/payment/verify
exports.verifyPayment = async (req, res, next) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, planId } = req.body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({ message: 'Missing payment fields' });
    }

    const keySecret = process.env.RAZORPAY_KEY_SECRET;
    if (!keySecret || keySecret.includes('XXXX')) {
      return res.status(500).json({ message: 'Razorpay secret not configured on server' });
    }

    const expectedSig = crypto
      .createHmac('sha256', keySecret)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest('hex');

    if (expectedSig !== razorpay_signature) {
      return res.status(400).json({ message: 'Payment verification failed — signature mismatch' });
    }

    const plan = PLANS[planId];
    if (!plan) return res.status(400).json({ message: 'Invalid plan' });

    const expiry = new Date();
    expiry.setDate(expiry.getDate() + plan.days);

    const user = await User.findByIdAndUpdate(
      req.user._id,
      { plan: planId, subscriptionStatus: 'active', planExpiry: expiry },
      { new: true }
    ).select('-password');

    res.json({ message: 'Payment verified successfully', user });
  } catch (err) {
    next(err);
  }
};

// POST /api/payment/webhook  (raw body — registered before express.json())
exports.webhook = async (req, res) => {
  try {
    const sig = req.headers['x-razorpay-signature'];
    const secret = process.env.RAZORPAY_WEBHOOK_SECRET;

    if (!secret || secret === 'your_webhook_secret') {
      console.warn('Webhook secret not configured — skipping signature check in dev');
    } else {
      const expectedSig = crypto
        .createHmac('sha256', secret)
        .update(req.body)
        .digest('hex');
      if (sig !== expectedSig) return res.status(400).json({ message: 'Invalid webhook signature' });
    }

    const event = JSON.parse(req.body.toString());

    if (event.event === 'payment.captured') {
      const { notes } = event.payload.payment.entity;
      const { userId, planId } = notes || {};
      const plan = PLANS[planId];
      if (userId && plan) {
        const expiry = new Date();
        expiry.setDate(expiry.getDate() + plan.days);
        await User.findByIdAndUpdate(userId, {
          plan: planId,
          subscriptionStatus: 'active',
          planExpiry: expiry,
        });
        console.log(`✅ Webhook: upgraded user ${userId} to ${planId}`);
      }
    }

    res.json({ received: true });
  } catch (err) {
    console.error('Webhook error:', err.message);
    res.status(500).json({ message: 'Webhook processing failed' });
  }
};

// GET /api/payment/plans
exports.getPlans = (req, res) => {
  res.json({
    pro:  { planId: 'pro',  amount: 19900, currency: 'INR', label: 'Pro Plan',  amountDisplay: '₹199' },
    team: { planId: 'team', amount: 49900, currency: 'INR', label: 'Team Plan', amountDisplay: '₹499' },
  });
};
