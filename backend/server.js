require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const errorHandler = require('./middleware/errorHandler');
const startCronJobs = require('./utils/cronJobs');
const { webhook } = require('./controllers/paymentController');

const app = express();

connectDB();

app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }));

// Webhook MUST receive raw body — register before express.json()
app.post(
  '/api/payment/webhook',
  express.raw({ type: 'application/json' }),
  webhook
);

app.use(express.json());

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/payment', require('./routes/paymentRoutes'));
app.use('/api/subscriptions', require('./routes/subscriptionRoutes'));
app.use('/api/admin', require('./routes/adminRoutes'));

app.get('/api/health', (req, res) => res.json({ status: 'OK' }));

app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  startCronJobs();
});
