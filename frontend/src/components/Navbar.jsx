import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X, Zap, LayoutDashboard, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => { logout(); navigate('/'); setOpen(false); };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-violet-600 to-blue-500 rounded-lg flex items-center justify-center">
              <Zap className="w-4 h-4 text-white" />
            </div>
            <span className="text-xl font-semibold text-gray-900">SubTracker</span>
          </Link>

          <div className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">Features</a>
            <a href="#how-it-works" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">How it works</a>
            <a href="#pricing" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">Pricing</a>
          </div>

          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <>
                <Link to="/dashboard" className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 font-medium transition-colors">
                  <LayoutDashboard className="w-4 h-4" /> Dashboard
                </Link>
                <button onClick={handleLogout} className="flex items-center gap-2 text-sm text-gray-600 hover:text-red-600 font-medium transition-colors">
                  <LogOut className="w-4 h-4" /> Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="text-sm text-gray-600 hover:text-gray-900 font-medium transition-colors">Login</Link>
                <Link to="/register" className="text-sm bg-gradient-to-r from-violet-600 to-blue-500 text-white px-4 py-2 rounded-lg font-medium hover:opacity-90 transition-opacity">
                  Sign Up Free
                </Link>
              </>
            )}
          </div>

          <button className="md:hidden p-2 text-gray-600" onClick={() => setOpen(!open)}>
            {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {open && (
        <div className="md:hidden bg-white border-t border-gray-100 px-4 py-4 flex flex-col gap-4">
          <a href="#features" className="text-sm text-gray-600" onClick={() => setOpen(false)}>Features</a>
          <a href="#how-it-works" className="text-sm text-gray-600" onClick={() => setOpen(false)}>How it works</a>
          <a href="#pricing" className="text-sm text-gray-600" onClick={() => setOpen(false)}>Pricing</a>
          {user ? (
            <>
              <Link to="/dashboard" className="text-sm text-gray-600 font-medium" onClick={() => setOpen(false)}>Dashboard</Link>
              <button onClick={handleLogout} className="text-sm text-red-600 font-medium text-left">Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" className="text-sm text-gray-600 font-medium" onClick={() => setOpen(false)}>Login</Link>
              <Link to="/register" className="text-sm bg-gradient-to-r from-violet-600 to-blue-500 text-white px-4 py-2 rounded-lg font-medium text-center" onClick={() => setOpen(false)}>
                Sign Up Free
              </Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
}
