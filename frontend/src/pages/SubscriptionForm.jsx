import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Loader2, ArrowLeft } from 'lucide-react';
import DashboardLayout from '../components/DashboardLayout';
import api from '../utils/api';

const CATEGORIES = ['Entertainment', 'Productivity', 'Cloud', 'AI', 'Finance', 'Health', 'Education', 'Other'];
const EMPTY = { name: '', price: '', currency: 'USD', category: 'Other', billingCycle: 'monthly', nextBillingDate: '', status: 'active', notes: '' };

export default function SubscriptionForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);
  const [form, setForm] = useState(EMPTY);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(isEdit);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isEdit) return;
    api.get(`/subscriptions/${id}`)
      .then(({ data }) => setForm({
        name: data.name, price: data.price, currency: data.currency,
        category: data.category, billingCycle: data.billingCycle,
        nextBillingDate: data.nextBillingDate?.split('T')[0] || '',
        status: data.status, notes: data.notes || '',
      }))
      .catch(() => navigate('/dashboard/subscriptions'))
      .finally(() => setFetching(false));
  }, [id]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      if (isEdit) await api.put(`/subscriptions/${id}`, form);
      else await api.post('/subscriptions', form);
      navigate('/dashboard/subscriptions');
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong.');
    } finally {
      setLoading(false);
    }
  };

  if (fetching) return (
    <DashboardLayout>
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-6 h-6 animate-spin text-violet-500" />
      </div>
    </DashboardLayout>
  );

  return (
    <DashboardLayout>
      <div className="max-w-xl mx-auto">
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-800 mb-6 transition">
          <ArrowLeft className="w-4 h-4" /> Back
        </button>

        <div className="bg-white rounded-2xl border border-gray-100 p-6 sm:p-8">
          <h1 className="text-xl font-semibold text-gray-900 mb-6">{isEdit ? 'Edit Subscription' : 'Add Subscription'}</h1>

          {error && <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-xl mb-5">{error}</div>}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Service name</label>
                <input name="name" value={form.name} onChange={handleChange} required placeholder="e.g. Netflix" className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent" />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Price</label>
                <input name="price" type="number" min="0" step="0.01" value={form.price} onChange={handleChange} required placeholder="9.99" className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent" />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Currency</label>
                <select name="currency" value={form.currency} onChange={handleChange} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent bg-white">
                  {['USD', 'EUR', 'GBP', 'INR', 'CAD', 'AUD'].map((c) => <option key={c}>{c}</option>)}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Category</label>
                <select name="category" value={form.category} onChange={handleChange} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent bg-white">
                  {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Billing cycle</label>
                <select name="billingCycle" value={form.billingCycle} onChange={handleChange} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent bg-white">
                  <option value="monthly">Monthly</option>
                  <option value="yearly">Yearly</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Next billing date</label>
                <input name="nextBillingDate" type="date" value={form.nextBillingDate} onChange={handleChange} required className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent" />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Status</label>
                <select name="status" value={form.status} onChange={handleChange} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent bg-white">
                  <option value="active">Active</option>
                  <option value="paused">Paused</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>

              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Notes (optional)</label>
                <textarea name="notes" value={form.notes} onChange={handleChange} rows={3} placeholder="Any notes about this subscription..." className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent resize-none" />
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <button type="button" onClick={() => navigate(-1)} className="flex-1 py-2.5 rounded-xl border border-gray-200 text-sm font-semibold text-gray-600 hover:bg-gray-50 transition">
                Cancel
              </button>
              <button type="submit" disabled={loading} className="flex-1 bg-gradient-to-r from-violet-600 to-blue-500 text-white py-2.5 rounded-xl text-sm font-semibold hover:opacity-90 transition disabled:opacity-60 flex items-center justify-center gap-2">
                {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                {loading ? 'Saving...' : isEdit ? 'Save Changes' : 'Add Subscription'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </DashboardLayout>
  );
}
