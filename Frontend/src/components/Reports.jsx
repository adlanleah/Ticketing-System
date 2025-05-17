import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../components/AuthContext';
import axios from 'axios';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, 
  PieChart, Pie, Cell, ResponsiveContainer 
} from 'recharts';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

const Reports = () => {
  const { currentUser } = useAuth();
  const [reportData, setReportData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [dateRange, setDateRange] = useState({
    startDate: new Date(new Date().setMonth(new Date().getMonth() - 1)),
    endDate: new Date()
  });
  const [reportType, setReportType] = useState('attendance');

  useEffect(() => {
    fetchReportData();
  }, [dateRange, reportType]);

  const fetchReportData = async () => {
    try {
      setLoading(true);
      setError('');
      
      const params = {
        startDate: dateRange.startDate.toISOString(),
        endDate: dateRange.endDate.toISOString(),
        type: reportType
      };

    
      const res = await axios.get('/admin/reports', { params });
      setReportData(res.data.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch report data');
    } finally {
      setLoading(false);
    }
  };

  const handleDateChange = (dates) => {
    const [start, end] = dates;
    setDateRange({ startDate: start, endDate: end });
  };

  const renderChart = () => {
    if (!reportData) return null;

    switch(reportType) {
      case 'attendance':
        return (
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white p-4 rounded-lg shadow">
              <h3 className="text-lg font-semibold mb-4">Attendance by Session</h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={reportData.attendanceBySession}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="attendance" fill="#3b82f6" name="Attendance" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
            <div className="bg-white p-4 rounded-lg shadow">
              <h3 className="text-lg font-semibold mb-4">Attendance by Day</h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={reportData.attendanceByDate}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="count" fill="#10b981" name="Attendees" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        );
      
      case 'revenue':
        return (
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white p-4 rounded-lg shadow">
              <h3 className="text-lg font-semibold mb-4">Revenue by Section</h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={reportData.revenueBySection}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      nameKey="name"
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    >
                      {reportData.revenueBySection.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => [`UGX ${value.toLocaleString()}`, 'Revenue']} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
            <div className="bg-white p-4 rounded-lg shadow">
              <h3 className="text-lg font-semibold mb-4">Revenue Trend</h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={reportData.revenueTrend}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip formatter={(value) => [`UGX ${value.toLocaleString()}`, 'Revenue']} />
                    <Legend />
                    <Bar dataKey="revenue" fill="#f59e0b" name="Revenue (UGX)" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        );

      case 'demographics':
        return (
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white p-4 rounded-lg shadow">
              <h3 className="text-lg font-semibold mb-4">Guest Types</h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={reportData.guestTypes}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      nameKey="name"
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    >
                      {reportData.guestTypes.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
            <div className="bg-white p-4 rounded-lg shadow">
              <h3 className="text-lg font-semibold mb-4">Affiliation Distribution</h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={reportData.affiliations}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="count" fill="#8b5cf6" name="Count" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  if (!currentUser || currentUser.role !== 'admin') {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h1 className="text-2xl font-bold text-red-600">
          Unauthorized Access
        </h1>
        <p className="mt-4">
          You don't have permission to access reports.
        </p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-primary">Exhibition Reports</h1>
        <div className="flex items-center space-x-4">
          <div className="flex items-center">
            <DatePicker
              selectsRange
              startDate={dateRange.startDate}
              endDate={dateRange.endDate}
              onChange={handleDateChange}
              className="border rounded px-3 py-1"
            />
          </div>
          <select
            value={reportType}
            onChange={(e) => setReportType(e.target.value)}
            className="border rounded px-3 py-1"
          >
            <option value="attendance">Attendance</option>
            <option value="revenue">Revenue</option>
            <option value="demographics">Demographics</option>
          </select>
          <button
            onClick={fetchReportData}
            className="bg-primary text-white px-4 py-1 rounded hover:bg-blue-800"
            disabled={loading}
          >
            {loading ? 'Refreshing...' : 'Refresh'}
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-red-100 text-red-800 p-4 rounded-lg mb-6">
          {error}
        </div>
      )}

      {loading && !reportData ? (
        <div className="text-center py-12">Loading report data...</div>
      ) : reportData ? (
        <>
          <div className="bg-white p-6 rounded-lg shadow mb-6">
            <div className="grid md:grid-cols-4 gap-4">
              <div className="border p-4 rounded-lg">
                <h3 className="text-gray-500">Total Attendance</h3>
                <p className="text-2xl font-bold">{reportData.summary.totalAttendance}</p>
              </div>
              <div className="border p-4 rounded-lg">
                <h3 className="text-gray-500">Total Revenue</h3>
                <p className="text-2xl font-bold">UGX {reportData.summary.totalRevenue?.toLocaleString()}</p>
              </div>
              <div className="border p-4 rounded-lg">
                <h3 className="text-gray-500">Events Held</h3>
                <p className="text-2xl font-bold">{reportData.summary.eventsCount}</p>
              </div>
              <div className="border p-4 rounded-lg">
                <h3 className="text-gray-500">Avg. Attendance</h3>
                <p className="text-2xl font-bold">{reportData.summary.avgAttendance}</p>
              </div>
            </div>
          </div>

          {renderChart()}

          <div className="mt-6 bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-bold text-primary mb-4">Export Reports</h2>
            <div className="flex space-x-4">
              <button className="bg-primary text-white px-4 py-2 rounded hover:bg-blue-800">
                Export as PDF
              </button>
              <button className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
                Export as Excel
              </button>
              <button className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700">
                Export as CSV
              </button>
            </div>
          </div>
        </>
      ) : (
        <div className="text-center py-12">No report data available</div>
      )}
    </div>
  );
};

export default Reports;