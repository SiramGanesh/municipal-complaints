// ============================================
// Complaint Card Component
// ============================================
// Displays a single complaint as a card.
// Used in lists/grids of complaints.
// Shows: title, issue type, status, date, location
// ============================================

import React from 'react';
import { Link } from 'react-router-dom';
import StatusBadge from './StatusBadge';

const ComplaintCard = ({ complaint }) => {
  // Format date to readable string
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  // Get a nice label for issue type
  const getIssueTypeLabel = (type) => {
    const labels = {
      road: '🛣️ Road',
      water: '💧 Water',
      garbage: '🗑️ Garbage',
      sanitation: '🚿 Sanitation',
      electricity: '⚡ Electricity',
      other: '📋 Other',
    };
    return labels[type] || type;
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      {/* Card Header */}
      <div className="flex justify-between items-center p-4 bg-gray-50 border-b border-gray-200">
        <span className="text-sm font-medium text-gray-700">{getIssueTypeLabel(complaint.issueType)}</span>
        <StatusBadge status={complaint.status} />
      </div>

      {/* Card Body */}
      <div className="p-4">
        <h3 className="text-lg font-semibold mb-2 text-gray-900">{complaint.title}</h3>
        <p className="text-gray-600 text-sm mb-3">
          {complaint.description.length > 100
            ? complaint.description.substring(0, 100) + '...'
            : complaint.description}
        </p>

        <div className="space-y-1 text-sm text-gray-500">
          <p>📍 {complaint.location}</p>
          <p>📅 {formatDate(complaint.createdAt)}</p>
          {complaint.departmentId && (
            <p>🏢 {complaint.departmentId.departmentName || 'Assigned'}</p>
          )}
        </div>
      </div>

      {/* Card Footer */}
      <div className="p-4 border-t border-gray-200">
        <Link to={`/complaints/${complaint._id}`} className="inline-block bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700 transition-colors text-sm">
          View Details →
        </Link>
      </div>
    </div>
  );
};

export default ComplaintCard;
