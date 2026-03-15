import { DollarSign, Layers, Calendar, TrendingUp } from 'lucide-react';
import useInView from '../hooks/useInView';

const statCards = [
  { label: 'Monthly Spending', value: '$97.18', change: '+2.4%', icon: <DollarSign className="w-5 h-5" />, color: 'bg-violet-500' },
  { label: 'Active Subscriptions', value: '12', change: '+1 this month', icon: <Layers className="w-5 h-5" />, color: 'bg-blue-500' },
  { label: 'Upcoming Payments', value: '3', change: 'Next 7 days', icon: <Calendar className="w-5 h-5" />, color: 'bg-orange-500' },
];

const upcomingPayments = [
  { name: 'Netflix', date: 'Mar 18', amount: '$15.99', icon: '🎬' },
  { name: 'Spotify', date: 'Mar 20', amount: '$9.99', icon: '🎵' },
  { name: 'AWS', date: 'Mar 25', amount: '$47.20', icon: '☁️' },
];

const chartBars = [
  { month: 'Oct', height: 60 },
  { month: 'Nov', height: 75 },
  { month: 'Dec', height: 65 },
  { month: 'Jan', height: 85 },
  { month: 'Feb', height: 70 },
  { month: 'Mar', height: 97 },
];

export default function DashboardPreview() {
  const [headRef, headIn] = useInView();
  const [mockRef, mockIn] = useInView();

  return (
    <section id="dashboard-preview" className="py-20 sm:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div ref={headRef} className={`text-center mb-14 fade-up ${headIn ? 'visible' : ''}`}>
          <p className="text-sm font-semibold text-violet-600 uppercase tracking-widest mb-3">Dashboard</p>
          <h2 className="text-3xl sm:text-4xl font-semibold text-gray-900 mb-4">
            Your financial overview at a glance
          </h2>
          <p className="text-base sm:text-lg text-gray-500 max-w-xl mx-auto">
            A powerful dashboard that gives you complete visibility into your subscription spending.
          </p>
        </div>

        <div ref={mockRef} className={`bg-gray-950 rounded-3xl p-4 sm:p-6 lg:p-8 shadow-2xl border border-gray-800 fade-up ${mockIn ? 'visible' : ''}`}>
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-red-500 rounded-full" />
              <div className="w-3 h-3 bg-yellow-500 rounded-full" />
              <div className="w-3 h-3 bg-green-500 rounded-full" />
            </div>
            <div className="text-gray-400 text-sm font-medium">SubTracker Dashboard</div>
            <div className="w-20" />
          </div>

          <div className="grid sm:grid-cols-3 gap-4 mb-6">
            {statCards.map((card) => (
              <div key={card.label} className="bg-gray-900 rounded-2xl p-4 border border-gray-800">
                <div className="flex items-center justify-between mb-3">
                  <p className="text-gray-400 text-xs font-medium">{card.label}</p>
                  <div className={`w-8 h-8 ${card.color} rounded-lg flex items-center justify-center text-white`}>
                    {card.icon}
                  </div>
                </div>
                <p className="text-xl sm:text-2xl font-semibold text-white mb-1">{card.value}</p>
                <p className="text-xs text-green-400">{card.change}</p>
              </div>
            ))}
          </div>

          <div className="grid lg:grid-cols-2 gap-4">
            <div className="bg-gray-900 rounded-2xl p-5 border border-gray-800">
              <div className="flex items-center gap-2 mb-5">
                <TrendingUp className="w-4 h-4 text-violet-400" />
                <p className="text-gray-300 text-sm font-semibold">Monthly Spending Trend</p>
              </div>
              <div className="flex items-end gap-2 h-24">
                {chartBars.map((b) => (
                  <div key={b.month} className="flex-1 flex flex-col items-center gap-1">
                    <div
                      className="w-full bg-gradient-to-t from-violet-600 to-blue-400 rounded-t-md opacity-80"
                      style={{ height: `${b.height}%` }}
                    />
                    <span className="text-gray-500 text-xs">{b.month}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-gray-900 rounded-2xl p-5 border border-gray-800">
              <div className="flex items-center gap-2 mb-5">
                <Calendar className="w-4 h-4 text-orange-400" />
                <p className="text-gray-300 text-sm font-semibold">Upcoming Payments</p>
              </div>
              <div className="space-y-3">
                {upcomingPayments.map((p) => (
                  <div key={p.name} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-xl">{p.icon}</span>
                      <div>
                        <p className="text-white text-sm font-medium">{p.name}</p>
                        <p className="text-gray-500 text-xs">{p.date}</p>
                      </div>
                    </div>
                    <span className="text-white text-sm font-semibold">{p.amount}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
