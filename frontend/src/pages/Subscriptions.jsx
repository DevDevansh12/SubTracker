import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Search, Pencil, Trash2, Loader2 } from 'lucide-react';
import DashboardLayout from '../components/DashboardLayout';
import api from '../utils/api';

const STATUS_COLORS = {
  active: 'bg-green-100 text-green-700',
  cancelled: 'bg-red-100 text-red-700',
  paused: 'bg-yellow-100 text-yellow-700',
};

export default function Subscriptions() {
  const [subs, setSubs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [deleting, setDeleting] = useState(null);

  const fetchSubs = () => {
    setLoading(true);
    api.get('/subscriptions')
      .then(({ data }) => setSubs(data))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchSubs(); }, []);

  const handleDelete = async (id) => {
    if (!confirm('Delete this subscription?')) return;
    setDeleting(id);
    try {
      await api.delete(`/subscriptions/${id}`);
      setSubs((prev) => prev.filter((s) => s._id !== id));
    } finally {
      setDeleting(null);
    }
  };

  const filtered = subs.filter((s) =>
    s.name.toLowerCase().includes(search.toLowerCase()) ||
    s.category.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <DashboardLayout>
      <div className="max-w-5xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-xl font-semibold text-gray-900">Subscriptions</h1>
            <p className="text-sm text-gray-500 mt-0.5">{subs.length} total subscription{subs.length !== 1 ? 's' : ''}</p>
          </div>
          <Link
            to="/dashboard/subscriptions/new"
            className="flex items-center gap-2 bg-gradient-to-r from-violet-600 to-blue-500 text-white px-4 py-2 rounded-xl text-sm font-semibold hover:opacity-90 transition self-start sm:self-auto"
          >
            <Plus className="w-4 h-4" /> Add New
          </Link>
        </div>

        {/* Search */}
        <div className="relative mb-5">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search subscriptions..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent"
          />
        </div>

        {loading ? (
          <div className="space-y-3">
            {[...Array(4)].map((_, i) => <div key={i} className="h-16 bg-white rounded-2xl border border-gray-100 animate-pulse" />)}
          </div>
        ) : filtered.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center">
            <p className="text-gray-400 text-sm mb-4">{search ? 'No results found' : 'No subscriptions yet'}</p>
            {!search && (
              <Link to="/dashboard/subscriptions/new" className="inline-flex items-center gap-2 bg-violet-600 text-white px-4 py-2 rounded-xl text-sm font-semibold hover:opacity-90 transition">
                <Plus className="w-4 h-4" /> Add your first subscription
              </Link>
            )}
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
            <div className="hidden sm:grid grid-cols-12 gap-4 px-5 py-3 border-b border-gray-50 text-xs font-medium text-gray-400 uppercase tracking-wide">
              <div className="col-span-4">Name</div>
              <div className="col-span-2">Category</div>
              <div className="col-span-2">Billing</div>
              <div className="col-span-2">Next Date</div>
              <div className="col-span-1">Status</div>
              <div className="col-span-1 text-right">Price</div>
            </div>
            <div className="divide-y divide-gray-50">
              {filtered.map((s) => (
                <div key={s._id} className="grid grid-cols-2 sm:grid-cols-12 gap-4 px-5 py-4 items-center hover:bg-gray-50/50 transition group">
                  <div className="col-span-1 sm:col-span-4 font-medium text-sm text-gray-900">{s.name}</div>
                  <div className="col-span-1 sm:col-span-2 text-xs text-gray-500">{s.category}</div>
                  <div className="col-span-1 sm:col-span-2 text-xs text-gray-500 capitalize">{s.billingCycle}</div>
                  <div className="col-span-1 sm:col-span-2 text-xs text-gray-500">{new Date(s.nextBillingDate).toLocaleDateString()}</div>
                  <div className="col-span-1 sm:col-span-1">
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium capitalize ${STATUS_COLORS[s.status]}`}>{s.status}</span>
                  </div>
                  <div className="col-span-1 sm:col-span-1 flex items-center justify-end gap-2">
                    <span className="text-sm font-semibold text-gray-900">${s.price}</span>
                    <div className="hidden group-hover:flex items-center gap-1">
                      <Link to={`/dashboard/subscriptions/${s._id}/edit`} className="p-1.5 text-gray-400 hover:text-violet-600 hover:bg-violet-50 rounded-lg transition">
                        <Pencil className="w-3.5 h-3.5" />
                      </Link>
                      <button
                        onClick={() => handleDelete(s._id)}
                        disabled={deleting === s._id}
                        className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                      >
                        {deleting === s._id ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Trash2 className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
