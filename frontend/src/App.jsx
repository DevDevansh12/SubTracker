import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import PricingPage from './pages/PricingPage';
import Dashboard from './pages/Dashboard';
import Subscriptions from './pages/Subscriptions';
import SubscriptionForm from './pages/SubscriptionForm';
import Analytics from './pages/Analytics';
import Settings from './pages/Settings';

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/pricing" element={<PricingPage />} />

          {/* Protected — requires login + active paid plan */}
          <Route path="/dashboard" element={<ProtectedRoute requirePlan><Dashboard /></ProtectedRoute>} />
          <Route path="/dashboard/subscriptions" element={<ProtectedRoute requirePlan><Subscriptions /></ProtectedRoute>} />
          <Route path="/dashboard/subscriptions/new" element={<ProtectedRoute requirePlan><SubscriptionForm /></ProtectedRoute>} />
          <Route path="/dashboard/subscriptions/:id/edit" element={<ProtectedRoute requirePlan><SubscriptionForm /></ProtectedRoute>} />
          <Route path="/dashboard/analytics" element={<ProtectedRoute requirePlan><Analytics /></ProtectedRoute>} />
          <Route path="/dashboard/settings" element={<ProtectedRoute requirePlan><Settings /></ProtectedRoute>} />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
