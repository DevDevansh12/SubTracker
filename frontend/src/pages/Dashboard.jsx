import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { DollarSign, CreditCard, Calendar, TrendingUp, Plus, ArrowRight } from 'lucide-react';
import DashboardLayout from '../components/DashboardLayout';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';

export default function Dashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/subscriptions/dashboard')
      .then(({ data }) => setStats(data))
      .catch(() => setStats(null))
      .finally(() => setLoading(false));
  }, []);

  const statCards = stats ? [
    { label: 'Monthly Spending', value: `$${stats.totalMonthly}`, sub: `$${stats.totalYearly}/yr`, icon: DollarSign, color: 'bg-violet-500', light: 'bg-violet-50 text-violet-600' },
    { label: 'Active Subscriptions', value: stats.activeCount, sub: 'Currently active', icon: CreditCard, color: 'bg-blue-500', light: 'bg-blue-50 text-blue-600' },
    { label: 'Upcoming Payments', value: stats.upcomingBillings?.length ?? 0, sub: 'Next 30 days', icon: Calendar, color: 'bg-orange-500', light: 'bg-orange-50 text-orange-600' },
    { label: 'Yearly Total', value: `$${stats.totalYearly}`, sub: 'Projected spend', icon: TrendingUp, color: 'bg-teal-500', light: 'bg-teal-50 text-teal-600' },
  ] : [];

  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-xl font-semibold text-gray-900">Good morning, {user?.name?.split(' ')[0]} 👋</h1>
            <p className="text-sm text-gray-500 mt-0.5">Here's your subscription overview</p>
          </div>
          <Link
            to="/dashboard/subscriptions/new"
            className="flex items-center gap-2 bg-gradient-to-r from-violet-600 to-blue-500 text-white px-4 py-2 rounded-xl text-sm font-semibold hover:opacity-90 transition"
          >
            <Plus className="w-4 h-4" /> Add Subscription
          </Link>
        </div>

        {/* Stat cards */}
        {loading ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-white rounded-2xl p-5 border border-gray-100 animate-pulse h-28" />
            ))}
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {statCards.map((c) => (
              <div key={c.label} className="bg-white rounded-2xl p-5 border border-gray-100 hover:shadow-md transition">
                <div className="flex items-center justify-between mb-3">
                  <p className="text-xs font-medium text-gray-500">{c.label}</p>
                  <div className={`w-8 h-8 ${c.light} rounded-lg flex items-center justify-center`}>
                    <c.icon className="w-4 h-4" />
                  </div>
                </div>
                <p className="text-2xl font-semibold text-gray-900">{c.value}</p>
                <p className="text-xs text-gray-400 mt-1">{c.sub}</p>
              </div>
            ))}
          </div>
        )}

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Upcoming billings */}
          <div className="bg-white rounded-2xl border border-gray-100 p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-semibold text-gray-900">Upcoming Payments</h2>
              <Link to="/dashboard/subscriptions" className="text-xs text-violet-600 hover:underline flex items-center gap-1">
                View all <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
            {loading ? (
              <div className="space-y-3">{[...Array(3)].map((_, i) => <div key={i} className="h-12 bg-gray-50 rounded-xl animate-pulse" />)}</div>
            ) : stats?.upcomingBillings?.length ? (
              <div className="space-y-3">
                {stats.upcomingBillings.slice(0, 5).map((s) => (
                  <div key={s._id} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                    <div>
                      <p className="text-sm font-medium text-gray-800">{s.name}</p>
                      <p className="text-xs text-gray-400">{new Date(s.nextBillingDate).toLocaleDateString()}</p>
                    </div>
                    <span className="text-sm font-semibold text-gray-900">${s.price}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-400 text-center py-6">No upcoming payments in the next 30 days</p>
            )}
          </div>

          {/* Spending by category */}
          <div className="bg-white rounded-2xl border border-gray-100 p-5">
            <h2 className="text-sm font-semibold text-gray-900 mb-4">Spending by Category</h2>
            {loading ? (
              <div className="space-y-3">{[...Array(4)].map((_, i) => <div key={i} className="h-8 bg-gray-50 rounded-xl animate-pulse" />)}</div>
            ) : stats?.byCategory && Object.keys(stats.byCategory).length ? (
              <div className="space-y-3">
                {Object.entries(stats.byCategory).map(([cat, amt]) => {
                  const max = Math.max(...Object.values(stats.byCategory));
                  const pct = Math.round((amt / max) * 100);
                  return (
                    <div key={cat} className="flex items-center gap-3">
                      <span className="text-xs text-gray-500 w-28 truncate">{cat}</span>
                      <div className="flex-1 bg-gray-100 rounded-full h-2">
                        <div className="bg-gradient-to-r from-violet-500 to-blue-400 h-2 rounded-full transition-all" style={{ width: `${pct}%` }} />
                      </div>
                      <span className="text-xs font-medium text-gray-700 w-12 text-right">${amt}</span>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-sm text-gray-400 text-center py-6">No subscription data yet</p>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
