import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../components/AuthContext';
import axios from 'axios';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const AdminDashboard = () => {
  const { currentUser } = useAuth();
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [events, setEvents] = useState([]);
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState({
    stats: false,
    users: false,
    events: false
  });
  const [error, setError] = useState('');

  // Fetch dashboard stats
  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(prev => ({ ...prev, stats: true }));
        const res = await axios.get('/admin/stats');
        setStats(res.data.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch statistics');
      } finally {
        setLoading(prev => ({ ...prev, stats: false }));
      }
    };

    if (activeTab === 'overview') {
      fetchStats();
    }
  }, [activeTab]);

  // Fetch users
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(prev => ({ ...prev, users: true }));
        const res = await axios.get('/admin/users');
        setUsers(res.data.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch users');
      } finally {
        setLoading(prev => ({ ...prev, users: false }));
      }
    };

    if (activeTab === 'users') {
      fetchUsers();
    }
  }, [activeTab]);

  // Fetch events
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(prev => ({ ...prev, events: true }));
        const res = await axios.get('/admin/events');
        setEvents(res.data.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch events');
      } finally {
        setLoading(prev => ({ ...prev, events: false }));
      }
    };

    if (activeTab === 'events') {
      fetchEvents();
    }
  }, [activeTab]);

  // Format data for charts
  const formatChartData = () => {
    if (!stats) return [];
    
    return [
      { name: 'Users', count: stats.userCount },
      { name: 'Events', count: stats.eventCount },
      { name: 'Bookings', count: stats.bookingCount },
      { name: 'Revenue', count: stats.totalRevenue }
    ];
  };

  // Handle user role change
  const handleRoleChange = async (userId, newRole) => {
    try {
      await axios.put(`/admin/users/${userId}/role`, { role: newRole });
      setUsers(users.map(user => 
        user._id === userId ? { ...user, role: newRole } : user
      ));
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update user role');
    }
  };

  // Toggle event status
  const toggleEventStatus = async (eventId, currentStatus) => {
    try {
      await axios.put(`/admin/events/${eventId}/status`, { 
        isActive: !currentStatus 
      });
      setEvents(events.map(event =>
        event._id === eventId ? { ...event, isActive: !currentStatus } : event
      ));
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update event status');
    }
  };

  if (!currentUser || currentUser.role !== 'admin') {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h1 className="text-2xl font-bold text-red-600">
          Unauthorized Access
        </h1>
        <p className="mt-4">
          You don't have permission to access the admin dashboard.
        </p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-primary mb-6">
        Admin Dashboard - Welcome, {currentUser.name}
      </h1>
      
      {error && (
        <div className="bg-red-100 text-red-800 p-4 rounded-lg mb-6">
          {error}
        </div>
      )}

      <div className="flex flex-col md:flex-row gap-6">
        {/* Sidebar Navigation */}
        <div className="md:w-1/4">
          <nav className="bg-white p-4 rounded-lg shadow-lg">
            <ul className="space-y-2">
              <li>
                <button
                  onClick={() => setActiveTab('overview')}
                  className={`w-full text-left px-4 py-2 rounded-lg ${activeTab === 'overview' ? 'bg-primary text-white' : 'hover:bg-gray-100'}`}
                >
                  Overview
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveTab('users')}
                  className={`w-full text-left px-4 py-2 rounded-lg ${activeTab === 'users' ? 'bg-primary text-white' : 'hover:bg-gray-100'}`}
                >
                  User Management
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveTab('events')}
                  className={`w-full text-left px-4 py-2 rounded-lg ${activeTab === 'events' ? 'bg-primary text-white' : 'hover:bg-gray-100'}`}
                >
                  Event Management
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveTab('settings')}
                  className={`w-full text-left px-4 py-2 rounded-lg ${activeTab === 'settings' ? 'bg-primary text-white' : 'hover:bg-gray-100'}`}
                >
                  System Settings
                </button>
              </li>
            </ul>
          </nav>
        </div>

        {/* Main Content */}
        <div className="md:w-3/4">
          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {loading.stats ? (
                <div className="text-center py-8">Loading statistics...</div>
              ) : stats ? (
                <>
                  <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
                      <h3 className="text-xl font-bold text-primary mb-2">Total Users</h3>
                      <p className="text-3xl font-bold">{stats.userCount}</p>
                    </div>
                    <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
                      <h3 className="text-xl font-bold text-primary mb-2">Active Events</h3>
                      <p className="text-3xl font-bold">{stats.activeEventCount}</p>
                    </div>
                    <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
                      <h3 className="text-xl font-bold text-primary mb-2">Total Bookings</h3>
                      <p className="text-3xl font-bold">{stats.bookingCount}</p>
                    </div>
                    <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
                      <h3 className="text-xl font-bold text-primary mb-2">Total Revenue</h3>
                      <p className="text-3xl font-bold">UGX {stats.totalRevenue?.toLocaleString()}</p>
                    </div>
                  </div>

                  <div className="bg-white p-6 rounded-lg shadow">
                    <h2 className="text-xl font-bold text-primary mb-4">System Statistics</h2>
                    <div className="h-80">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={formatChartData()}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="name" />
                          <YAxis />
                          <Tooltip />
                          <Legend />
                          <Bar dataKey="count" fill="#3b82f6" />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </>
              ) : (
                <div className="text-center py-8">No statistics available</div>
              )}
            </div>
          )}

          {/* User Management Tab */}
          {activeTab === 'users' && (
            <div className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-xl font-bold text-primary mb-4">User Management</h2>
              
              {loading.users ? (
                <div className="text-center py-8">Loading users...</div>
              ) : users.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {users.map(user => (
                        <tr key={user._id}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div>
                                <div className="text-sm font-medium text-gray-900">{user.name}</div>
                                <div className="text-sm text-gray-500">{user.affiliation}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.email}</td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <select
                              value={user.role}
                              onChange={(e) => handleRoleChange(user._id, e.target.value)}
                              className="bg-gray-100 rounded px-2 py-1 text-sm"
                            >
                              <option value="guest">Guest</option>
                              <option value="student">Student</option>
                              <option value="organizer">Organizer</option>
                              <option value="admin">Admin</option>
                            </select>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <button
                              onClick={() => {
                                if (window.confirm(`Are you sure you want to delete ${user.name}?`)) {
                                  // Implement delete functionality
                                }
                              }}
                              className="text-red-600 hover:text-red-900"
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-8">No users found</div>
              )}
            </div>
          )}

          {/* Event Management Tab */}
          {activeTab === 'events' && (
            <div className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-xl font-bold text-primary mb-4">Event Management</h2>
              
              <div className="flex justify-end mb-4">
                <Link
                  to="/admin/events/new"
                  className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-blue-800 transition"
                >
                  Create New Event
                </Link>
              </div>

              {loading.events ? (
                <div className="text-center py-8">Loading events...</div>
              ) : events.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Event</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Dates</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sessions</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {events.map(event => (
                        <tr key={event._id}>
                          <td className="px-6 py-4">
                            <div className="text-sm font-medium text-gray-900">{event.title}</div>
                            <div className="text-sm text-gray-500">{event.eventType}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {new Date(event.startDate).toLocaleDateString()} - {new Date(event.endDate).toLocaleDateString()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {event.sessionCount || 0}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <button
                              onClick={() => toggleEventStatus(event._id, event.isActive)}
                              className={`px-2 py-1 rounded text-xs font-medium ${event.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}
                            >
                              {event.isActive ? 'Active' : 'Inactive'}
                            </button>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <Link
                              to={`/admin/events/${event._id}`}
                              className="text-primary hover:text-blue-800 mr-3"
                            >
                              Edit
                            </Link>
                            <button
                              onClick={() => {
                                if (window.confirm(`Are you sure you want to delete ${event.title}?`)) {
                                  // Implement delete functionality
                                }
                              }}
                              className="text-red-600 hover:text-red-800"
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-8">No events found</div>
              )}
            </div>
          )}

          {/* System Settings Tab */}
          {activeTab === 'settings' && (
            <div className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-xl font-bold text-primary mb-4">System Settings</h2>
              
              <div className="space-y-6">
                <div>
                  <h3 className="font-bold text-gray-700 mb-2">System Configuration</h3>
                  <div className="space-y-4">
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="maintenanceMode"
                        className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                      />
                      <label htmlFor="maintenanceMode" className="ml-2 block text-gray-700">
                        Maintenance Mode
                      </label>
                    </div>
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="registrationOpen"
                        className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                      />
                      <label htmlFor="registrationOpen" className="ml-2 block text-gray-700">
                        Allow New Registrations
                      </label>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="font-bold text-gray-700 mb-2">Payment Settings</h3>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-gray-700 mb-1">Default Currency</label>
                      <select className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent">
                        <option>UGX - Ugandan Shilling</option>
                        <option>USD - US Dollar</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-gray-700 mb-1">Payment Methods</label>
                      <div className="space-y-2">
                        <div className="flex items-center">
                          <input type="checkbox" id="mobileMoney" className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded" />
                          <label htmlFor="mobileMoney" className="ml-2 block text-gray-700">Mobile Money</label>
                        </div>
                        <div className="flex items-center">
                          <input type="checkbox" id="creditCard" className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded" />
                          <label htmlFor="creditCard" className="ml-2 block text-gray-700">Credit Card</label>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="pt-4">
                  <button className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-blue-800 transition">
                    Save Settings
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;

