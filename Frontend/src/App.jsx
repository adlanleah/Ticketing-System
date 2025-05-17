import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './components/AuthContext';
import Home from './components/Home';
import Login from './components/Login';
import Register from './components/Register';
import GuestDashboard from './components/GuestDashboard';
import OrganizerDashboard from './components/OrganizerDashboard';
import AdminDashboard from './components/AdminDashboard';
import Booking from './components/Booking';
import Ticket from './components/Ticket';
import Profile from './components/Profile';
import Settings from './components/Settings';
import OrganizerReports from './components/Reports';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import './index.css'

// Protected Route Component
const ProtectedRoute = ({ children, allowedRoles }) => {
  const { currentUser } = useAuth();
  
  if (!currentUser) {
    return <Navigate to="/login" />;
  }
  
  if (allowedRoles && !allowedRoles.includes(currentUser.role)) {
    return <Navigate to="/" />;
  }
  
  return children;
};

function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="min-h-screen flex flex-col">
          <Navbar />
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              
              {/* Guest/Student Routes */}
              <Route path="/dashboard" element={
                <ProtectedRoute allowedRoles={['guest', 'student']}>
                  <GuestDashboard />
                </ProtectedRoute>
              } />
              
              {/* Organizer Routes */}
              <Route path="/organizer" element={
                <ProtectedRoute allowedRoles={['organizer', 'admin']}>
                  <OrganizerDashboard />
                </ProtectedRoute>
              } />
              
              {/* Admin Routes */}
              <Route path="/admin" element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <AdminDashboard />
                </ProtectedRoute>
              } />
              
              {/* Common Routes */}
              <Route path="/book" element={<Booking />} />
              <Route path="/ticket/:id" element={<Ticket />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/reports" element={<OrganizerReports />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;
