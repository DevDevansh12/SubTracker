import { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import DashboardLayout from '../components/DashboardLayout';
import api from '../utils/api';

const COLORS = ['#7c3aed', '#3b82f6', '#14b8a6', '#f97316', '#ec4899', '#84cc16', '#f59e0b', '#6366f1'];

export default function Analytics() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/subscriptions/analytics')
      .then(({ data }) => setData(data))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <DashboardLayout>
      <div className="max-w-5xl mx-auto space-y-4">
        {[...Array(3)].map((_, i) => <div key={i} className="h-64 bg-white rounded-2xl border border-gray-100 animate-pulse" />)}
      </div>
    </DashboardLayout>
  );

  return (
    <DashboardLayout>
      <div className="max-w-5xl mx-auto">
        <div className="mb-6">
          <h1 className="text-xl font-semibold text-gray-900">Analytics</h1>
          <p className="text-sm text-gray-500 mt-0.5">Insights into your subscription spending</p>
        </div>

        {!data || (!data.byCategory?.length && !data.monthlyTrend?.length) ? (
          <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center">
            <p className="text-gray-400 text-sm">No data yet. Add some subscriptions to see analytics.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Monthly trend */}
            <div className="bg-white rounded-2xl border border-gray-100 p-6">
              <h2 className="text-sm font-semibold text-gray-900 mb-5">Monthly Spending Trend</h2>
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={data.monthlyTrend} barSize={32}>
                  <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 12, fill: '#9ca3af' }} axisLine={false} tickLine={false} tickFormatter={(v) => `$${v}`} />
                  <Tooltip formatter={(v) => [`$${v}`, 'Spending']} contentStyle={{ borderRadius: 12, border: '1px solid #f3f4f6', fontSize: 12 }} />
                  <Bar dataKey="amount" fill="url(#barGrad)" radius={[6, 6, 0, 0]} />
                  <defs>
                    <linearGradient id="barGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#7c3aed" />
                      <stop offset="100%" stopColor="#3b82f6" />
                    </linearGradient>
                  </defs>
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {/* Category breakdown */}
              {data.byCategory?.length > 0 && (
                <div className="bg-white rounded-2xl border border-gray-100 p-6">
                  <h2 className="text-sm font-semibold text-gray-900 mb-5">Spending by Category</h2>
                  <ResponsiveContainer width="100%" height={220}>
                    <PieChart>
                      <Pie data={data.byCategory} dataKey="amount" nameKey="category" cx="50%" cy="50%" outerRadius={80} label={({ category, percent }) => `${category} ${(percent * 100).toFixed(0)}%`} labelLine={false}>
                        {data.byCategory.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                      </Pie>
                      <Tooltip formatter={(v) => [`$${v}`, 'Amount']} contentStyle={{ borderRadius: 12, border: '1px solid #f3f4f6', fontSize: 12 }} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              )}

              {/* Top expensive */}
              {data.topExpensive?.length > 0 && (
                <div className="bg-white rounded-2xl border border-gray-100 p-6">
                  <h2 className="text-sm font-semibold text-gray-900 mb-4">Top Subscriptions</h2>
                  <div className="space-y-3">
                    {data.topExpensive.map((s, i) => (
                      <div key={i} className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-7 h-7 rounded-lg flex items-center justify-center text-white text-xs font-semibold" style={{ background: COLORS[i % COLORS.length] }}>
                            {i + 1}
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-800">{s.name}</p>
                            <p className="text-xs text-gray-400">{s.category}</p>
                          </div>
                        </div>
                        <span className="text-sm font-semibold text-gray-900">${s.monthlyPrice}/mo</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
