import { useState } from 'react';
import { Loader2, Check } from 'lucide-react';
import DashboardLayout from '../components/DashboardLayout';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';

export default function Settings() {
  const { user, updateUser } = useAuth();
  const [profile, setProfile] = useState({ name: user?.name || '', email: user?.email || '' });
  const [passwords, setPasswords] = useState({ currentPassword: '', newPassword: '', confirm: '' });
  const [profileLoading, setProfileLoading] = useState(false);
  const [passLoading, setPassLoading] = useState(false);
  const [profileMsg, setProfileMsg] = useState(null);
  const [passMsg, setPassMsg] = useState(null);

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setProfileMsg(null);
    setProfileLoading(true);
    try {
      const { data } = await api.put('/auth/profile', profile);
      updateUser(data);
      setProfileMsg({ type: 'success', text: 'Profile updated successfully.' });
    } catch (err) {
      setProfileMsg({ type: 'error', text: err.response?.data?.message || 'Update failed.' });
    } finally {
      setProfileLoading(false);
    }
  };

  const handlePassSubmit = async (e) => {
    e.preventDefault();
    setPassMsg(null);
    if (passwords.newPassword !== passwords.confirm) return setPassMsg({ type: 'error', text: 'Passwords do not match.' });
    if (passwords.newPassword.length < 6) return setPassMsg({ type: 'error', text: 'Password must be at least 6 characters.' });
    setPassLoading(true);
    try {
      await api.put('/auth/change-password', { currentPassword: passwords.currentPassword, newPassword: passwords.newPassword });
      setPasswords({ currentPassword: '', newPassword: '', confirm: '' });
      setPassMsg({ type: 'success', text: 'Password changed successfully.' });
    } catch (err) {
      setPassMsg({ type: 'error', text: err.response?.data?.message || 'Failed to change password.' });
    } finally {
      setPassLoading(false);
    }
  };

  const Msg = ({ msg }) => msg ? (
    <div className={`flex items-center gap-2 text-sm px-4 py-3 rounded-xl mb-4 ${msg.type === 'success' ? 'bg-green-50 border border-green-200 text-green-700' : 'bg-red-50 border border-red-200 text-red-700'}`}>
      {msg.type === 'success' && <Check className="w-4 h-4" />} {msg.text}
    </div>
  ) : null;

  const inputCls = "w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition";

  return (
    <DashboardLayout>
      <div className="max-w-2xl mx-auto space-y-6">
        <div>
          <h1 className="text-xl font-semibold text-gray-900">Settings</h1>
          <p className="text-sm text-gray-500 mt-0.5">Manage your account preferences</p>
        </div>

        {/* Profile */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6">
          <h2 className="text-base font-semibold text-gray-900 mb-5">Profile Information</h2>
          <Msg msg={profileMsg} />
          <form onSubmit={handleProfileSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Full name</label>
              <input value={profile.name} onChange={(e) => setProfile({ ...profile, name: e.target.value })} required className={inputCls} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Email address</label>
              <input type="email" value={profile.email} onChange={(e) => setProfile({ ...profile, email: e.target.value })} required className={inputCls} />
            </div>
            <button type="submit" disabled={profileLoading} className="flex items-center gap-2 bg-gradient-to-r from-violet-600 to-blue-500 text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:opacity-90 transition disabled:opacity-60">
              {profileLoading && <Loader2 className="w-4 h-4 animate-spin" />}
              {profileLoading ? 'Saving...' : 'Save Changes'}
            </button>
          </form>
        </div>

        {/* Change password */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6">
          <h2 className="text-base font-semibold text-gray-900 mb-5">Change Password</h2>
          <Msg msg={passMsg} />
          <form onSubmit={handlePassSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Current password</label>
              <input type="password" value={passwords.currentPassword} onChange={(e) => setPasswords({ ...passwords, currentPassword: e.target.value })} required className={inputCls} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">New password</label>
              <input type="password" value={passwords.newPassword} onChange={(e) => setPasswords({ ...passwords, newPassword: e.target.value })} required placeholder="Min. 6 characters" className={inputCls} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Confirm new password</label>
              <input type="password" value={passwords.confirm} onChange={(e) => setPasswords({ ...passwords, confirm: e.target.value })} required className={inputCls} />
            </div>
            <button type="submit" disabled={passLoading} className="flex items-center gap-2 bg-gradient-to-r from-violet-600 to-blue-500 text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:opacity-90 transition disabled:opacity-60">
              {passLoading && <Loader2 className="w-4 h-4 animate-spin" />}
              {passLoading ? 'Updating...' : 'Update Password'}
            </button>
          </form>
        </div>

        {/* Account info */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6">
          <h2 className="text-base font-semibold text-gray-900 mb-4">Account Details</h2>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between py-2 border-b border-gray-50">
              <span className="text-gray-500">Account ID</span>
              <span className="text-gray-700 font-mono text-xs">{user?._id}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-gray-50">
              <span className="text-gray-500">Role</span>
              <span className="capitalize text-gray-700">{user?.role}</span>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
