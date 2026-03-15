import { Bell, BarChart3, CreditCard, Layers } from 'lucide-react';
import useInView from '../hooks/useInView';

const features = [
  {
    icon: <Layers className="w-6 h-6" />,
    title: 'Subscription Tracking',
    desc: 'Track Netflix, AWS, Spotify, ChatGPT and more — all in one clean dashboard.',
    color: 'bg-violet-100 text-violet-600',
    border: 'hover:border-violet-200',
  },
  {
    icon: <Bell className="w-6 h-6" />,
    title: 'Billing Reminders',
    desc: "Get notified before billing dates so you're never caught off guard.",
    color: 'bg-blue-100 text-blue-600',
    border: 'hover:border-blue-200',
  },
  {
    icon: <BarChart3 className="w-6 h-6" />,
    title: 'Analytics Dashboard',
    desc: 'View monthly spending insights with beautiful charts and breakdowns.',
    color: 'bg-teal-100 text-teal-600',
    border: 'hover:border-teal-200',
  },
  {
    icon: <CreditCard className="w-6 h-6" />,
    title: 'Expense Management',
    desc: 'Understand exactly where your money goes and cut unnecessary costs.',
    color: 'bg-orange-100 text-orange-600',
    border: 'hover:border-orange-200',
  },
];

const delays = ['', 'delay-100', 'delay-200', 'delay-300'];

export default function Features() {
  const [headRef, headIn] = useInView();
  const [gridRef, gridIn] = useInView();

  return (
    <section id="features" className="py-20 sm:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div ref={headRef} className={`text-center mb-14 fade-up ${headIn ? 'visible' : ''}`}>
          <p className="text-sm font-semibold text-violet-600 uppercase tracking-widest mb-3">Features</p>
          <h2 className="text-3xl sm:text-4xl font-semibold text-gray-900 mb-4">
            Everything you need to manage subscriptions
          </h2>
          <p className="text-base sm:text-lg text-gray-500 max-w-2xl mx-auto">
            Stop losing track of what you're paying for. SubTracker gives you full visibility and control.
          </p>
        </div>

        <div ref={gridRef} className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((f, i) => (
            <div
              key={f.title}
              className={`p-6 rounded-2xl border border-gray-100 ${f.border} hover:shadow-lg transition-all duration-300 group fade-up ${delays[i]} ${gridIn ? 'visible' : ''}`}
            >
              <div className={`w-12 h-12 ${f.color} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                {f.icon}
              </div>
              <h3 className="text-base font-semibold text-gray-900 mb-2">{f.title}</h3>
              <p className="text-sm text-gray-500 leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
