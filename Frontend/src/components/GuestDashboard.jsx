import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../components/AuthContext'; 
import axios from 'axios';

const GuestDashboard = () => {
  const { currentUser } = useAuth();
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const res = await axios.get(`/api/bookings/user/${currentUser._id}`);
        setTickets(res.data.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch tickets');
      } finally {
        setLoading(false);
      }
    };

    if (currentUser?._id) {
      fetchTickets();
    }
  }, [currentUser]);

  if (loading) {
    return <div className="text-center py-8">Loading dashboard...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-primary mb-6">
        Welcome, {currentUser?.name}
      </h1>

      {error && (
        <div className="bg-red-100 text-red-800 p-4 rounded-lg mb-6">
          {error}
        </div>
      )}

      <div className="grid md:grid-cols-4 gap-6 mb-8">
        <Link
          to="/book"
          className="bg-primary text-white p-6 rounded-lg shadow hover:bg-blue-800 transition text-center"
        >
          <h3 className="text-xl font-bold mb-2">Book a Seat</h3>
          <p>Reserve your spot at upcoming events</p>
        </Link>

        <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
          <h3 className="text-xl font-bold text-primary mb-2">Your Tickets</h3>
          <p className="text-3xl font-bold">{tickets.length}</p>
        </div>

        <Link
          to="/profile"
          className="bg-secondary text-white p-6 rounded-lg shadow hover:bg-red-700 transition text-center"
        >
          <h3 className="text-xl font-bold mb-2">Your Profile</h3>
          <p>View and update your information</p>
        </Link>

        <Link
          to="/settings"
          className="bg-accent text-primary p-6 rounded-lg shadow hover:bg-yellow-500 transition text-center"
        >
          <h3 className="text-xl font-bold mb-2">Settings</h3>
          <p>Account preferences</p>
        </Link>
      </div>

      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-2xl font-bold text-primary mb-4">Your Upcoming Tickets</h2>

        {tickets.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ticket ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Event</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Session</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Seat</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {tickets.map(ticket => (
                  <tr key={ticket.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{ticket.id}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{ticket.event}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{ticket.date}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{ticket.session}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{ticket.seat}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                        ${ticket.status === 'Confirmed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                        {ticket.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <Link to={`/ticket/${ticket.id}`} className="text-primary hover:text-blue-800">View</Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-500">You don't have any tickets yet.</p>
            <Link to="/book" className="mt-2 inline-block bg-primary text-white px-4 py-2 rounded hover:bg-blue-800">
              Book Your First Seat
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default GuestDashboard;
