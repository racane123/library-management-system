import React, { useState, useEffect } from 'react';
import { libraryAPI } from '../services/api';
import { CheckCircle, Clock, User } from 'lucide-react';
import LoadingSpinner, { SkeletonLoader } from './LoadingSpinner';
import { useNotification } from '../contexts/NotificationContext';
import EmptyState from './EmptyState';

const ReservationManagement = () => {
  const { showError, showSuccess } = useNotification();
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchReservations = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await libraryAPI.getReservations();
      setReservations(res.data || []);
    } catch (err) {
      setError(err.message || 'Failed to fetch reservations');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReservations();
  }, []);

  const handleFulfill = async (id) => {
    try {
      await libraryAPI.fulfillReservation(id);
      showSuccess('Reservation fulfilled successfully!');
      fetchReservations(); // Refresh the list
    } catch (err) {
      showError(err.message || 'Failed to fulfill reservation');
    }
  };

  return (
    <div className="card">
      <h3 className="text-lg font-medium text-gray-900 mb-4">Active Reservations</h3>
      {loading ? (
        <SkeletonLoader lines={5} />
      ) : error ? (
        <div className="text-red-600">{error}</div>
      ) : reservations.length === 0 ? (
        <EmptyState
          icon={CheckCircle}
          title="No Active Reservations"
          message="There are no active reservations at this time."
        />
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Book Title</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Reserved At</th>
                <th className="px-6 py-3"></th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {reservations.map((res) => (
                <tr key={res.id}>
                  <td className="px-6 py-4 whitespace-nowrap">{res.book_title}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <User className="h-4 w-4 mr-2 text-gray-500" />
                      {res.user_name}
                    </div>
                    <div className="text-sm text-gray-500">{res.user_email}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 mr-2 text-gray-500" />
                      {new Date(res.reserved_at).toLocaleString()}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <button
                      onClick={() => handleFulfill(res.id)}
                      className="btn-primary"
                    >
                      Fulfill
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ReservationManagement; 