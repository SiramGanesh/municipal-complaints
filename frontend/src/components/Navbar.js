// ============================================
// Navbar Component
// ============================================
// The navigation bar that appears at the top of
// every page. It shows different links based on:
// - Whether the user is logged in
// - What role the user has (citizen/officer/admin)
// ============================================

import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  // Handle logout
  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex justify-between items-center h-16 flex-wrap gap-2">
          {/* Logo / Brand Name */}
          <Link to="/" className="text-xl font-bold text-blue-600 hover:text-blue-700 transition-colors">
            🏛️ Municipal Complaints
          </Link>

          {/* Navigation Links */}
          <div className="flex items-center gap-4 flex-wrap">
            {/* Public link - always visible */}
            <Link to="/public-dashboard" className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors">
              📊 Public Dashboard
            </Link>

            {user ? (
              // ---- LOGGED IN ----
              <>
                {/* Citizen Links */}
                {user.role === 'citizen' && (
                  <>
                    <Link to="/dashboard" className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors">
                      🏠 Dashboard
                    </Link>
                    <Link to="/register-complaint" className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors">
                      📝 New Complaint
                    </Link>
                    <Link to="/track-complaints" className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors">
                      🔍 Track Complaints
                    </Link>
                  </>
                )}

                {/* User Info & Logout */}
                <span className="text-gray-600 text-sm px-3 py-2 bg-gray-100 rounded-md">
                  👤 {user.name} ({user.role})
                </span>
                <button onClick={handleLogout} className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition-colors text-sm font-medium">
                  Logout
                </button>
              </>
            ) : (
              // ---- NOT LOGGED IN ----
              <>
                <Link to="/login" className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors">
                  Login
                </Link>
                <Link to="/register" className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors text-sm font-medium">
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
