import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Check, Zap, Loader2, Crown, Users } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import { loadRazorpay } from '../utils/loadRazorpay';

const PLANS = [
  {
    id: 'free',
    name: 'Free',
    price: '₹0',
    period: '/month',
    desc: 'Get started at no cost',
    icon: Zap,
    features: ['Track up to 5 subscriptions', 'Basic dashboard', 'Email reminders', 'Monthly overview'],
    highlight: false,
    cta: 'Current Plan',
    free: true,
  },
  {
    id: 'pro',
    name: 'Pro',
    price: '₹199',
    period: '/month',
    desc: 'For power users',
    icon: Crown,
    features: ['Unlimited subscriptions', 'Advanced analytics', 'Custom categories', 'Priority reminders', 'Export to CSV', 'API access'],
    highlight: true,
    badge: 'Most Popular',
    cta: 'Upgrade to Pro',
  },
  {
    id: 'team',
    name: 'Team',
    price: '₹499',
    period: '/month',
    desc: 'For teams managing shared costs',
    icon: Users,
    features: ['Everything in Pro', 'Up to 10 members', 'Team collaboration', 'Shared dashboards', 'Priority support', 'Custom integrations'],
    highlight: false,
    cta: 'Upgrade to Team',
  },
];

export default function PricingPage() {
  const { user, updateUser } = useAuth();
  const navigate = useNavigate();
  const [loadingPlan, setLoadingPlan] = useState(null);
  const [error, setError] = useState('');

  const handleUpgrade = async (planId) => {
    if (!user) return navigate('/login');
    if (planId === 'free') return;
    if (user.plan === planId && user.subscriptionStatus === 'active') return;

    setError('');
    setLoadingPlan(planId);

    try {
      const loaded = await loadRazorpay();
      if (!loaded) throw new Error('Failed to load Razorpay SDK. Check your internet connection.');

      const { data: order } = await api.post('/payment/create-order', { planId });

      // Use key from order response, fallback to env var
      const keyId = order.keyId || import.meta.env.VITE_RAZORPAY_KEY_ID;

      const options = {
        key: keyId,
        amount: order.amount,
        currency: order.currency,
        name: 'SubTracker',
        description: order.planLabel,
        order_id: order.orderId,
        prefill: { name: user.name, email: user.email },
        theme: { color: '#7c3aed' },
        handler: async (response) => {
          try {
            const { data } = await api.post('/payment/verify', {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              planId,
            });
            updateUser(data.user);
            navigate('/dashboard');
          } catch (verifyErr) {
            setError(verifyErr.response?.data?.message || 'Payment verification failed. Contact support if amount was deducted.');
            setLoadingPlan(null);
          }
        },
        modal: {
          ondismiss: () => setLoadingPlan(null),
          escape: true,
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.on('payment.failed', (resp) => {
        setError(`Payment failed: ${resp.error.description}`);
        setLoadingPlan(null);
      });
      rzp.open();
    } catch (err) {
      // Show the actual backend error message
      const msg = err.response?.data?.message || err.message || 'Something went wrong. Please try again.';
      setError(msg);
      setLoadingPlan(null);
    }
  };

  const isCurrentPlan = (planId) => user?.plan === planId && user?.subscriptionStatus === 'active';

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-violet-50">
      {/* Nav */}
      <nav className="bg-white/80 backdrop-blur-md border-b border-gray-100 px-4 sm:px-6 py-4 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-to-br from-violet-600 to-blue-500 rounded-lg flex items-center justify-center">
            <Zap className="w-4 h-4 text-white" />
          </div>
          <span className="text-lg font-semibold text-gray-900">SubTracker</span>
        </Link>
        {user ? (
          <Link to="/dashboard" className="text-sm text-violet-600 font-medium hover:underline">Go to Dashboard →</Link>
        ) : (
          <Link to="/login" className="text-sm text-gray-600 font-medium hover:text-gray-900">Sign in</Link>
        )}
      </nav>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-16">
        <div className="text-center mb-12">
          <p className="text-sm font-semibold text-violet-600 uppercase tracking-widest mb-3">Pricing</p>
          <h1 className="text-3xl sm:text-4xl font-semibold text-gray-900 mb-4">Choose your plan</h1>
          <p className="text-gray-500 max-w-lg mx-auto">
            Unlock the full power of SubTracker. Upgrade anytime, cancel anytime.
          </p>
        </div>

        {error && (
          <div className="max-w-lg mx-auto mb-8 bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-xl text-center">
            {error}
          </div>
        )}

        {user?.plan && user.plan !== 'free' && user.subscriptionStatus === 'active' && (
          <div className="max-w-lg mx-auto mb-8 bg-green-50 border border-green-200 text-green-700 text-sm px-4 py-3 rounded-xl text-center">
            You're on the <span className="font-semibold capitalize">{user.plan}</span> plan.
            {user.planExpiry && ` Renews on ${new Date(user.planExpiry).toLocaleDateString()}.`}
          </div>
        )}

        <div className="grid md:grid-cols-3 gap-8 items-start">
          {PLANS.map((plan) => {
            const Icon = plan.icon;
            const current = isCurrentPlan(plan.id);
            const isLoading = loadingPlan === plan.id;

            return (
              <div
                key={plan.id}
                className={`relative rounded-2xl p-6 sm:p-8 border transition-all duration-300 ${
                  plan.highlight
                    ? 'bg-gradient-to-br from-violet-600 to-blue-600 border-transparent text-white shadow-2xl shadow-violet-200 md:scale-105'
                    : 'bg-white border-gray-200 hover:border-violet-200 hover:shadow-lg'
                }`}
              >
                {plan.badge && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-orange-400 text-white text-xs font-semibold px-4 py-1 rounded-full whitespace-nowrap">
                    {plan.badge}
                  </div>
                )}

                <div className="mb-6">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${plan.highlight ? 'bg-white/20' : 'bg-violet-100'}`}>
                    <Icon className={`w-5 h-5 ${plan.highlight ? 'text-white' : 'text-violet-600'}`} />
                  </div>
                  <h3 className={`text-lg font-semibold mb-1 ${plan.highlight ? 'text-white' : 'text-gray-900'}`}>{plan.name}</h3>
                  <p className={`text-sm mb-4 ${plan.highlight ? 'text-violet-200' : 'text-gray-500'}`}>{plan.desc}</p>
                  <div className="flex items-end gap-1">
                    <span className={`text-4xl font-semibold ${plan.highlight ? 'text-white' : 'text-gray-900'}`}>{plan.price}</span>
                    <span className={`text-sm mb-1 ${plan.highlight ? 'text-violet-200' : 'text-gray-400'}`}>{plan.period}</span>
                  </div>
                </div>

                <ul className="space-y-3 mb-8">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-center gap-3">
                      <div className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 ${plan.highlight ? 'bg-white/20' : 'bg-violet-100'}`}>
                        <Check className={`w-3 h-3 ${plan.highlight ? 'text-white' : 'text-violet-600'}`} />
                      </div>
                      <span className={`text-sm ${plan.highlight ? 'text-violet-100' : 'text-gray-600'}`}>{f}</span>
                    </li>
                  ))}
                </ul>

                <button
                  onClick={() => handleUpgrade(plan.id)}
                  disabled={plan.free || current || isLoading}
                  className={`w-full py-3 px-6 rounded-xl font-semibold text-sm transition-all flex items-center justify-center gap-2 disabled:cursor-not-allowed ${
                    plan.highlight
                      ? 'bg-white text-violet-600 hover:bg-violet-50 disabled:opacity-60'
                      : 'bg-gradient-to-r from-violet-600 to-blue-500 text-white hover:opacity-90 disabled:opacity-50'
                  }`}
                >
                  {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
                  {current ? '✓ Current Plan' : isLoading ? 'Processing...' : plan.cta}
                </button>
              </div>
            );
          })}
        </div>

        <p className="text-center text-xs text-gray-400 mt-10">
          Payments are processed securely via Razorpay. All prices include GST.
        </p>
      </div>
    </div>
  );
}
