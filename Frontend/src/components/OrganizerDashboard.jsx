import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../components/AuthContext'; 
import axios from 'axios';

const OrganizerDashboard = () => {
  const { currentUser } = useAuth();
  const [stats, setStats] = useState(null);
  const [recentBookings, setRecentBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const [statsRes, bookingsRes] = await Promise.all([
          axios.get('/api/bookings/stats'),
          axios.get('/api/bookings/recent')
        ]);
        setStats(statsRes.data.data);
        setRecentBookings(bookingsRes.data.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch dashboard data');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return <div className="text-center py-8">Loading dashboard...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-primary mb-6">
        Organizer Dashboard - Welcome, {currentUser?.name}
      </h1>

      {error && (
        <div className="bg-red-100 text-red-800 p-4 rounded-lg mb-6">
          {error}
        </div>
      )}

      {/* Dashboard Cards */}
      {stats && (
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
            <h3 className="text-xl font-bold text-primary mb-2">Total Seats Booked</h3>
            <p className="text-3xl font-bold">{stats.totalSeatsBooked}/602</p>
            <p className="text-sm text-gray-500 mt-1">
              {Math.round((stats.totalSeatsBooked / 602) * 100)}% capacity
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
            <h3 className="text-xl font-bold text-primary mb-2">Total Revenue</h3>
            <p className="text-3xl font-bold">{stats.totalRevenue}</p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
            <h3 className="text-xl font-bold text-primary mb-2">Morning Session</h3>
            <p className="text-2xl font-bold">
              {stats.morningSession.booked}/{stats.morningSession.capacity}
            </p>
            <p className="text-sm text-gray-500 mt-1">{stats.morningSession.revenue}</p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
            <h3 className="text-xl font-bold text-primary mb-2">Afternoon Session</h3>
            <p className="text-2xl font-bold">
              {stats.afternoonSession.booked}/{stats.afternoonSession.capacity}
            </p>
            <p className="text-sm text-gray-500 mt-1">{stats.afternoonSession.revenue}</p>
          </div>
        </div>
      )}

      {/* Quick Actions */}
      <div className="grid md:grid-cols-3 gap-6 mb-8">
        <Link
          to="/book"
          className="bg-primary text-white p-6 rounded-lg shadow hover:bg-blue-800 transition text-center"
        >
          <h3 className="text-xl font-bold mb-2">Book for Guest</h3>
          <p>Reserve seats for VIPs or special guests</p>
        </Link>

        <Link
          to="/reports"
          className="bg-secondary text-white p-6 rounded-lg shadow hover:bg-red-700 transition text-center"
        >
          <h3 className="text-xl font-bold mb-2">View Reports</h3>
          <p>Detailed event analytics</p>
        </Link>

        <Link
          to="/settings"
          className="bg-accent text-primary p-6 rounded-lg shadow hover:bg-yellow-500 transition text-center"
        >
          <h3 className="text-xl font-bold mb-2">Settings</h3>
          <p>Account preferences</p>
        </Link>
      </div>

      {/* Recent Bookings Table */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-2xl font-bold text-primary mb-4">Recent Bookings</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Ticket ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Guest</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Organization</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Session</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Seat</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Price</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Booked At</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {recentBookings.map((booking) => (
                <tr key={booking.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{booking.id}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{booking.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{booking.organization}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{booking.session}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{booking.seat}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{booking.price}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{booking.bookedAt}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default OrganizerDashboard;
