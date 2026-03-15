import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// requirePlan=true means user must have an active paid plan
export default function ProtectedRoute({ children, requirePlan = false }) {
  const { user } = useAuth();

  if (!user) return <Navigate to="/login" replace />;

  if (requirePlan) {
    const hasPlan = user.plan && user.plan !== 'free' && user.subscriptionStatus === 'active';
    const expired = user.planExpiry && new Date(user.planExpiry) < new Date();
    if (!hasPlan || expired) return <Navigate to="/pricing" replace />;
  }

  return children;
}
