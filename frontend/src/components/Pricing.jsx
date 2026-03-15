import { Check } from 'lucide-react';
import { Link } from 'react-router-dom';
import useInView from '../hooks/useInView';

const plans = [
  {
    name: 'Free',
    price: '$0',
    period: '/month',
    desc: 'Perfect for getting started',
    features: ['Track up to 5 subscriptions', 'Basic dashboard', 'Email reminders', 'Monthly spending overview'],
    cta: 'Get Started Free',
    href: '/register',
    highlight: false,
  },
  {
    name: 'Pro',
    price: '₹199',
    period: '/month',
    desc: 'For power users who want more',
    features: ['Unlimited subscriptions', 'Advanced analytics', 'Custom categories', 'Priority email reminders', 'Export to CSV', 'API access'],
    cta: 'Upgrade to Pro',
    href: '/pricing',
    highlight: true,
    badge: 'Most Popular',
  },
  {
    name: 'Team',
    price: '₹499',
    period: '/month',
    desc: 'For teams managing shared costs',
    features: ['Everything in Pro', 'Up to 10 team members', 'Team collaboration', 'Shared dashboards', 'Priority support', 'Custom integrations'],
    cta: 'Upgrade to Team',
    href: '/pricing',
    highlight: false,
  },
];

const delays = ['', 'delay-200', 'delay-400'];

export default function Pricing() {
  const [headRef, headIn] = useInView();
  const [cardsRef, cardsIn] = useInView();

  return (
    <section id="pricing" className="py-20 sm:py-24 bg-gradient-to-br from-slate-50 to-violet-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div ref={headRef} className={`text-center mb-14 fade-up ${headIn ? 'visible' : ''}`}>
          <p className="text-sm font-semibold text-violet-600 uppercase tracking-widest mb-3">Pricing</p>
          <h2 className="text-3xl sm:text-4xl font-semibold text-gray-900 mb-4">Simple, transparent pricing</h2>
          <p className="text-base sm:text-lg text-gray-500 max-w-xl mx-auto">
            Start free, upgrade when you need more. No hidden fees.
          </p>
        </div>

        <div ref={cardsRef} className="grid md:grid-cols-3 gap-8 items-start">
          {plans.map((plan, i) => (
            <div
              key={plan.name}
              className={`relative rounded-2xl p-6 sm:p-8 border transition-all duration-300 fade-up ${delays[i]} ${cardsIn ? 'visible' : ''} ${
                plan.highlight
                  ? 'bg-gradient-to-br from-violet-600 to-blue-600 border-transparent text-white shadow-2xl shadow-violet-200 md:scale-105'
                  : 'bg-white border-gray-200 hover:border-violet-200 hover:shadow-lg'
              }`}
            >
              {plan.badge && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-orange-400 text-white text-xs font-semibold px-4 py-1 rounded-full">
                  {plan.badge}
                </div>
              )}

              <div className="mb-6">
                <h3 className={`text-lg font-semibold mb-1 ${plan.highlight ? 'text-white' : 'text-gray-900'}`}>
                  {plan.name}
                </h3>
                <p className={`text-sm mb-4 ${plan.highlight ? 'text-violet-200' : 'text-gray-500'}`}>{plan.desc}</p>
                <div className="flex items-end gap-1">
                  <span className={`text-4xl font-semibold ${plan.highlight ? 'text-white' : 'text-gray-900'}`}>
                    {plan.price}
                  </span>
                  <span className={`text-sm mb-1 ${plan.highlight ? 'text-violet-200' : 'text-gray-400'}`}>
                    {plan.period}
                  </span>
                </div>
              </div>

              <ul className="space-y-3 mb-8">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-center gap-3">
                    <div className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 ${
                      plan.highlight ? 'bg-white/20' : 'bg-violet-100'
                    }`}>
                      <Check className={`w-3 h-3 ${plan.highlight ? 'text-white' : 'text-violet-600'}`} />
                    </div>
                    <span className={`text-sm ${plan.highlight ? 'text-violet-100' : 'text-gray-600'}`}>{f}</span>
                  </li>
                ))}
              </ul>

              <Link
                to={plan.href}
                className={`block text-center py-3 px-6 rounded-xl font-semibold text-sm transition-all ${
                  plan.highlight
                    ? 'bg-white text-violet-600 hover:bg-violet-50'
                    : 'bg-gradient-to-r from-violet-600 to-blue-500 text-white hover:opacity-90'
                }`}
              >
                {plan.cta}
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
