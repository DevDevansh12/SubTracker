import { PlusCircle, TrendingUp, BellRing } from 'lucide-react';
import useInView from '../hooks/useInView';

const steps = [
  {
    icon: <PlusCircle className="w-7 h-7" />,
    title: 'Add your subscriptions',
    desc: 'Import or manually add all your subscriptions with billing details in seconds.',
    color: 'text-violet-600 bg-violet-100',
  },
  {
    icon: <TrendingUp className="w-7 h-7" />,
    title: 'Track your monthly spending',
    desc: 'See a real-time overview of your total monthly and yearly subscription costs.',
    color: 'text-blue-600 bg-blue-100',
  },
  {
    icon: <BellRing className="w-7 h-7" />,
    title: 'Get automated reminders',
    desc: "Receive email reminders 3 days before any billing date so you're always prepared.",
    color: 'text-teal-600 bg-teal-100',
  },
];

const delays = ['', 'delay-200', 'delay-400'];

export default function HowItWorks() {
  const [headRef, headIn] = useInView();
  const [stepsRef, stepsIn] = useInView();

  return (
    <section id="how-it-works" className="py-20 sm:py-24 bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div ref={headRef} className={`text-center mb-14 fade-up ${headIn ? 'visible' : ''}`}>
          <p className="text-sm font-semibold text-violet-600 uppercase tracking-widest mb-3">How it works</p>
          <h2 className="text-3xl sm:text-4xl font-semibold text-gray-900 mb-4">Up and running in 3 steps</h2>
          <p className="text-base sm:text-lg text-gray-500 max-w-xl mx-auto">
            No complicated setup. Start tracking in under 2 minutes.
          </p>
        </div>

        <div ref={stepsRef} className="grid md:grid-cols-3 gap-8 relative">
          <div className="hidden md:block absolute top-12 left-1/4 right-1/4 h-0.5 bg-gradient-to-r from-violet-200 via-blue-200 to-teal-200" />

          {steps.map((s, i) => (
            <div key={i} className={`relative flex flex-col items-center text-center fade-up ${delays[i]} ${stepsIn ? 'visible' : ''}`}>
              <div className={`w-16 h-16 ${s.color} rounded-2xl flex items-center justify-center mb-5 relative z-10 shadow-sm`}>
                {s.icon}
              </div>
              <div className="absolute -top-2 right-1/2 translate-x-8 w-6 h-6 bg-white border-2 border-gray-200 rounded-full flex items-center justify-center">
                <span className="text-xs font-semibold text-gray-500">{i + 1}</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">{s.title}</h3>
              <p className="text-gray-500 text-sm leading-relaxed max-w-xs">{s.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
