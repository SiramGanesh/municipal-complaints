// ============================================
// Public Dashboard Page
// ============================================
// A transparency dashboard accessible to everyone
// (no login required). Shows:
//   - Total complaints and resolution rate
//   - Complaints by issue type
//   - Department performance
//
// This promotes accountability and trust in
// municipal governance.
// ============================================

import React, { useState, useEffect } from 'react';
import api from '../utils/api';

const PublicDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch public statistics
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await api.get('/dashboard/public');
        setStats(response.data.stats);
      } catch (error) {
        console.error('Error fetching public stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading public dashboard...</p>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="page-container">
        <div className="alert alert-error">Unable to load dashboard data.</div>
      </div>
    );
  }

  // Get emoji for issue type
  const getIssueEmoji = (type) => {
    const emojis = {
      road: '🛣️',
      water: '💧',
      garbage: '🗑️',
      sanitation: '🚿',
      electricity: '⚡',
      other: '📋',
    };
    return emojis[type] || '📋';
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-3xl font-bold mb-4">📊 Public Transparency Dashboard</h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Real-time statistics of municipal complaint management.
          This dashboard is accessible to everyone to promote transparency.
        </p>
      </div>

      {/* Main Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-md text-center border-t-4 border-blue-500">
          <h3 className="text-3xl font-bold mb-2">{stats.totalComplaints}</h3>
          <p className="text-gray-600">Total Complaints</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md text-center border-t-4 border-green-500">
          <h3 className="text-3xl font-bold mb-2">{stats.resolved}</h3>
          <p className="text-gray-600">Resolved</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md text-center border-t-4 border-yellow-500">
          <h3 className="text-3xl font-bold mb-2">{stats.inProgress}</h3>
          <p className="text-gray-600">In Progress</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md text-center border-t-4 border-red-500">
          <h3 className="text-3xl font-bold mb-2">{stats.escalated}</h3>
          <p className="text-gray-600">Escalated</p>
        </div>
      </div>

      {/* Resolution Rate */}
      <div className="bg-white p-8 rounded-lg shadow-md text-center mb-8">
        <h2 className="text-2xl font-bold mb-6">Overall Resolution Rate</h2>
        <div className="mb-6">
          <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-r from-green-400 to-green-600 rounded-full text-white text-2xl font-bold">
            {stats.resolutionRate}
          </div>
        </div>
        <div className="w-full max-w-md mx-auto bg-gray-200 rounded-full h-4">
          <div
            className="bg-gradient-to-r from-green-400 to-green-600 h-4 rounded-full transition-all duration-1000"
            style={{ width: stats.resolutionRate }}
          ></div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-8 mb-8">
        {/* Complaints by Type */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">📊 Complaints by Issue Type</h2>
          {stats.complaintsByType.length === 0 ? (
            <p className="text-gray-600">No data available yet.</p>
          ) : (
            <div className="space-y-3">
              {stats.complaintsByType.map((item) => (
                <div key={item._id} className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
                  <span className="text-2xl">{getIssueEmoji(item._id)}</span>
                  <span className="flex-1 font-medium capitalize">{item._id}</span>
                  <span className="font-bold text-blue-600">{item.count}</span>
                  <div className="w-20 bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full"
                      style={{
                        width: `${(item.count / stats.totalComplaints) * 100}%`,
                      }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Department Performance */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">🏢 Department Performance</h2>
          {stats.departmentPerformance.length === 0 ? (
            <p className="text-gray-600">No data available yet.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-2 font-semibold text-gray-700">Department</th>
                    <th className="text-center py-2 font-semibold text-gray-700">Total</th>
                    <th className="text-center py-2 font-semibold text-gray-700">Resolved</th>
                    <th className="text-center py-2 font-semibold text-gray-700">Rate</th>
                  </tr>
                </thead>
                <tbody>
                  {stats.departmentPerformance.map((dept) => (
                    <tr key={dept._id} className="border-b border-gray-100">
                      <td className="py-3">{dept._id}</td>
                      <td className="text-center py-3">{dept.total}</td>
                      <td className="text-center py-3 text-green-600 font-semibold">{dept.resolved}</td>
                      <td className="text-center py-3">
                        <span
                          className={
                            dept.total > 0 && dept.resolved / dept.total >= 0.5
                              ? 'text-green-600 font-semibold'
                              : 'text-red-600 font-semibold'
                          }
                        >
                          {dept.total > 0
                            ? `${((dept.resolved / dept.total) * 100).toFixed(0)}%`
                            : '0%'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Footer note */}
      <div className="text-center text-gray-600">
        <p>
          📌 This dashboard is updated in real time. Data reflects all complaints
          registered in the system.
        </p>
      </div>
    </div>
  );
};

export default PublicDashboard;
