const cron = require('node-cron');
const Subscription = require('../models/Subscription');
const User = require('../models/User');
const sendEmail = require('./sendEmail');

const startCronJobs = () => {
  // Run every day at 8:00 AM
  cron.schedule('0 8 * * *', async () => {
    console.log('Running billing reminder cron job...');
    try {
      const today = new Date();
      const reminderDate = new Date();
      reminderDate.setDate(today.getDate() + 3); // 3 days before billing

      const subscriptions = await Subscription.find({
        status: 'active',
        nextBillingDate: {
          $gte: today,
          $lte: reminderDate,
        },
        reminderSent: false,
      }).populate('user', 'name email');

      for (const sub of subscriptions) {
        if (!sub.user?.email) continue;
        const billingDate = new Date(sub.nextBillingDate).toDateString();
        await sendEmail({
          to: sub.user.email,
          subject: `Reminder: ${sub.name} billing on ${billingDate}`,
          html: `
            <div style="font-family:sans-serif;max-width:500px;margin:auto">
              <h2>Upcoming Billing Reminder</h2>
              <p>Hi ${sub.user.name},</p>
              <p>Your <strong>${sub.name}</strong> subscription will be billed on <strong>${billingDate}</strong>.</p>
              <p>Amount: <strong>${sub.currency} ${sub.price}</strong> (${sub.billingCycle})</p>
              <p>Log in to manage your subscriptions.</p>
            </div>
          `,
        });
        sub.reminderSent = true;
        await sub.save();
      }
      console.log(`Sent ${subscriptions.length} reminder(s).`);
    } catch (err) {
      console.error('Cron job error:', err.message);
    }
  });
};

module.exports = startCronJobs;
