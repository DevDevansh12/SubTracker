const mongoose = require('mongoose');

const subscriptionSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    name: { type: String, required: true, trim: true },
    price: { type: Number, required: true, min: 0 },
    currency: { type: String, default: 'USD', uppercase: true },
    category: {
      type: String,
      enum: ['Entertainment', 'Productivity', 'Cloud', 'AI', 'Finance', 'Health', 'Education', 'Other'],
      default: 'Other',
    },
    billingCycle: { type: String, enum: ['monthly', 'yearly'], default: 'monthly' },
    nextBillingDate: { type: Date, required: true },
    status: { type: String, enum: ['active', 'cancelled', 'paused'], default: 'active' },
    logo: { type: String, default: '' },
    notes: { type: String, default: '' },
    reminderSent: { type: Boolean, default: false },
  },
  { timestamps: true }
);

// Virtual: monthly cost normalized
subscriptionSchema.virtual('monthlyPrice').get(function () {
  return this.billingCycle === 'yearly' ? +(this.price / 12).toFixed(2) : this.price;
});

subscriptionSchema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('Subscription', subscriptionSchema);
