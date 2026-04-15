// ============================================
// Citizen Dashboard
// ============================================
// The main page for citizens after login.
// Shows:
//   - Welcome message
//   - Quick stats (total, resolved, pending)
//   - Recent complaints
//   - Quick action buttons
// ============================================

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import ComplaintCard from '../components/ComplaintCard';

const Dashboard = () => {
  const { user } = useAuth();
  const [complaints, setComplaints] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch user's complaints and notifications when page loads
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch complaints and notifications in parallel
        const [complaintsRes, notificationsRes] = await Promise.all([
          api.get('/complaints/my'),
          api.get('/notifications'),
        ]);

        setComplaints(complaintsRes.data.complaints);
        setNotifications(notificationsRes.data.notifications);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []); // Empty array = run once on mount

  // Calculate stats from complaints
  const stats = {
    total: complaints.length,
    registered: complaints.filter((c) => c.status === 'Registered').length,
    inProgress: complaints.filter((c) => c.status === 'In Progress').length,
    resolved: complaints.filter((c) => c.status === 'Resolved').length,
    escalated: complaints.filter((c) => c.status === 'Escalated').length,
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
        <div className="w-10 h-10 border-4 border-gray-300 border-t-blue-600 rounded-full animate-spin"></div>
        <p className="text-gray-600">Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Welcome Section */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Welcome, {user?.name} 👋</h1>
        <p className="text-gray-600">Manage and track your municipal complaints</p>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <Link to="/register-complaint" className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow text-center">
          <span className="text-3xl mb-2 block">📝</span>
          <span className="font-medium">Register New Complaint</span>
        </Link>
        <Link to="/track-complaints" className="bg-gradient-to-r from-cyan-500 to-cyan-600 text-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow text-center">
          <span className="text-3xl mb-2 block">🔍</span>
          <span className="font-medium">Track My Complaints</span>
        </Link>
        <Link to="/public-dashboard" className="bg-gradient-to-r from-purple-500 to-purple-600 text-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow text-center">
          <span className="text-3xl mb-2 block">📊</span>
          <span className="font-medium">Public Dashboard</span>
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
        <div className="bg-white p-4 rounded-lg shadow-md text-center border-t-4 border-blue-500">
          <h3 className="text-2xl font-bold mb-1">{stats.total}</h3>
          <p className="text-gray-600 text-sm">Total Complaints</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-md text-center border-t-4 border-cyan-500">
          <h3 className="text-2xl font-bold mb-1">{stats.registered}</h3>
          <p className="text-gray-600 text-sm">Registered</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-md text-center border-t-4 border-yellow-500">
          <h3 className="text-2xl font-bold mb-1">{stats.inProgress}</h3>
          <p className="text-gray-600 text-sm">In Progress</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-md text-center border-t-4 border-green-500">
          <h3 className="text-2xl font-bold mb-1">{stats.resolved}</h3>
          <p className="text-gray-600 text-sm">Resolved</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-md text-center border-t-4 border-red-500">
          <h3 className="text-2xl font-bold mb-1">{stats.escalated}</h3>
          <p className="text-gray-600 text-sm">Escalated</p>
        </div>
      </div>

      {/* Recent Notifications */}
      {notifications.length > 0 && (
        <div className="bg-white p-6 rounded-lg shadow-md mb-8">
          <h2 className="text-xl font-semibold mb-4">🔔 Recent Notifications</h2>
          <div className="max-h-60 overflow-y-auto">
            {notifications.slice(0, 5).map((notif) => (
              <div
                key={notif._id}
                className={`p-3 mb-2 rounded border-l-4 ${!notif.isRead ? 'bg-blue-50 border-blue-500' : 'bg-gray-50 border-gray-300'}`}
              >
                <p className="text-sm">{notif.message}</p>
                <span className="text-xs text-gray-500">
                  {new Date(notif.createdAt).toLocaleDateString()}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recent Complaints */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">📋 Your Recent Complaints</h2>
        {complaints.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-600 mb-4">You haven't filed any complaints yet.</p>
            <Link to="/register-complaint" className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors">
              Register Your First Complaint
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {complaints.slice(0, 6).map((complaint) => (
              <ComplaintCard key={complaint._id} complaint={complaint} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
