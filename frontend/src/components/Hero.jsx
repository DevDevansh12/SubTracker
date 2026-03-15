import { Link } from 'react-router-dom';
import { ArrowRight, Play } from 'lucide-react';
import useInView from '../hooks/useInView';

const subscriptions = [
  { name: 'Netflix', price: '$15.99', color: 'bg-red-500', icon: '🎬' },
  { name: 'Spotify', price: '$9.99', color: 'bg-green-500', icon: '🎵' },
  { name: 'AWS', price: '$47.20', color: 'bg-orange-500', icon: '☁️' },
  { name: 'ChatGPT', price: '$20.00', color: 'bg-teal-500', icon: '🤖' },
  { name: 'GitHub', price: '$4.00', color: 'bg-gray-800', icon: '💻' },
];

export default function Hero() {
  const [leftRef, leftIn] = useInView();
  const [rightRef, rightIn] = useInView();

  return (
    <section className="pt-24 pb-16 bg-gradient-to-br from-slate-50 via-blue-50 to-violet-50 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left */}
          <div ref={leftRef} className={`slide-left ${leftIn ? 'visible' : ''}`}>
            <div className="inline-flex items-center gap-2 bg-violet-100 text-violet-700 text-xs font-semibold px-3 py-1.5 rounded-full mb-6">
              <span className="w-1.5 h-1.5 bg-violet-500 rounded-full animate-pulse"></span>
              Trusted by 10,000+ users
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-semibold text-gray-900 leading-tight mb-6">
              Take Control of{' '}
              <span className="bg-gradient-to-r from-violet-600 to-blue-500 bg-clip-text text-transparent">
                Your Subscriptions
              </span>
            </h1>
            <p className="text-base sm:text-lg text-gray-500 mb-8 leading-relaxed">
              Track all your subscriptions in one place and never miss a billing date again.
              Save money by knowing exactly what you're paying for.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                to="/register"
                className="flex items-center gap-2 bg-gradient-to-r from-violet-600 to-blue-500 text-white px-6 py-3 rounded-xl font-semibold hover:opacity-90 transition-opacity shadow-lg shadow-violet-200"
              >
                Get Started Free <ArrowRight className="w-4 h-4" />
              </Link>
              <a
                href="#dashboard-preview"
                className="flex items-center gap-2 bg-white text-gray-700 px-6 py-3 rounded-xl font-semibold border border-gray-200 hover:border-gray-300 transition-colors"
              >
                <Play className="w-4 h-4 text-violet-600" /> View Demo
              </a>
            </div>
            <div className="flex flex-wrap items-center gap-4 sm:gap-6 mt-8 text-sm text-gray-400">
              <span>✓ Free forever plan</span>
              <span>✓ No credit card required</span>
              <span>✓ Cancel anytime</span>
            </div>
          </div>

          {/* Right — Dashboard mockup */}
          <div ref={rightRef} className={`relative slide-right ${rightIn ? 'visible' : ''}`}>
            <div className="bg-white rounded-2xl shadow-2xl border border-gray-100 p-5 sm:p-6 relative z-10">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <p className="text-xs text-gray-400 font-medium uppercase tracking-wide">Monthly Spending</p>
                  <p className="text-2xl sm:text-3xl font-semibold text-gray-900">$97.18</p>
                </div>
                <div className="bg-green-100 text-green-700 text-xs font-semibold px-3 py-1 rounded-full">
                  5 Active
                </div>
              </div>

              <div className="space-y-3">
                {subscriptions.map((sub) => (
                  <div key={sub.name} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                    <div className="flex items-center gap-3">
                      <div className={`w-9 h-9 ${sub.color} rounded-lg flex items-center justify-center text-lg`}>
                        {sub.icon}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-800">{sub.name}</p>
                        <p className="text-xs text-gray-400">Monthly</p>
                      </div>
                    </div>
                    <span className="text-sm font-semibold text-gray-900">{sub.price}</span>
                  </div>
                ))}
              </div>

              <div className="mt-5 pt-4 border-t border-gray-100">
                <p className="text-xs text-gray-400 mb-3 font-medium">Spending by category</p>
                <div className="space-y-2">
                  {[
                    { label: 'Entertainment', pct: 70, color: 'bg-violet-500' },
                    { label: 'Cloud', pct: 48, color: 'bg-blue-500' },
                    { label: 'AI', pct: 20, color: 'bg-teal-500' },
                  ].map((b) => (
                    <div key={b.label} className="flex items-center gap-3">
                      <span className="text-xs text-gray-500 w-24">{b.label}</span>
                      <div className="flex-1 bg-gray-100 rounded-full h-2">
                        <div className={`${b.color} h-2 rounded-full`} style={{ width: `${b.pct}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="absolute -top-6 -right-6 w-48 h-48 bg-violet-200 rounded-full blur-3xl opacity-40 -z-0" />
            <div className="absolute -bottom-6 -left-6 w-40 h-40 bg-blue-200 rounded-full blur-3xl opacity-40 -z-0" />
          </div>
        </div>
      </div>
    </section>
  );
}
