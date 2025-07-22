import React, { useState, useEffect } from 'react';
import { libraryAPI } from '../services/api';
import { Clock, CheckCircle, AlertTriangle } from 'lucide-react';
import LoadingSpinner, { SkeletonLoader } from './LoadingSpinner';
import EmptyState from './EmptyState';
import { useNotification } from '../contexts/NotificationContext';

const MyReservations = () => {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const { showError } = useNotification();

  useEffect(() => {
    const fetchReservations = async () => {
      try {
        setLoading(true);
        const res = await libraryAPI.getMyReservations();
        setReservations(res.data || []);
      } catch (err) {
        showError(err.message || 'Failed to fetch reservations');
      } finally {
        setLoading(false);
      }
    };
    fetchReservations();
  }, []);

  const getStatusInfo = (status) => {
    switch (status) {
      case 'fulfilled':
        return { text: 'Ready for Pickup', icon: CheckCircle, color: 'text-green-600' };
      case 'expired':
        return { text: 'Expired', icon: AlertTriangle, color: 'text-red-600' };
      default:
        return { text: 'Pending', icon: Clock, color: 'text-yellow-600' };
    }
  };

  if (loading) {
    return <SkeletonLoader lines={5} />;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">My Reservations</h1>
      {reservations.length === 0 ? (
        <EmptyState
          icon={Clock}
          title="No Reservations"
          message="You have not reserved any books."
        />
      ) : (
        <div className="space-y-4">
          {reservations.map((res) => {
            const statusInfo = getStatusInfo(res.status);
            const StatusIcon = statusInfo.icon;
            return (
              <div key={res.id} className="card flex items-center p-4">
                <img src={res.cover_image_url || 'https://via.placeholder.com/100x150'} alt={res.title} className="w-16 h-24 object-cover rounded-md mr-4"/>
                <div className="flex-grow">
                  <h2 className="text-lg font-bold">{res.title}</h2>
                  <p className="text-sm text-gray-600">{res.author}</p>
                  <p className="text-sm text-gray-500">Reserved on: {new Date(res.reserved_at).toLocaleDateString()}</p>
                </div>
                <div className={`flex items-center font-semibold ${statusInfo.color}`}>
                  <StatusIcon className="w-5 h-5 mr-2" />
                  {statusInfo.text}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default MyReservations; 