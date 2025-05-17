import { useState } from 'react';
import { useAuth } from '../components/AuthContext';

const Settings = () => {
  const { currentUser, logout } = useAuth();
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
    notifications: true,
    darkMode: false
  });
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    if (formData.newPassword !== formData.confirmPassword) {
      setErrorMessage("New passwords don't match");
      return;
    }
    
    // In a real app, this would validate current password and update via API
    setSuccessMessage('Password changed successfully!');
    setErrorMessage('');
    setFormData(prev => ({ ...prev, currentPassword: '', newPassword: '', confirmPassword: '' }));
    setTimeout(() => setSuccessMessage(''), 3000);
  };

  const handlePreferencesSubmit = (e) => {
    e.preventDefault();
    // In a real app, this would save preferences via API
    setSuccessMessage('Preferences updated successfully!');
    setTimeout(() => setSuccessMessage(''), 3000);
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <h1 className="text-3xl font-bold text-primary mb-6">Account Settings</h1>
      
      <div className="bg-white p-6 rounded-lg shadow-lg mb-8">
        <h2 className="text-xl font-bold text-primary mb-4">Change Password</h2>
        
        {successMessage && (
          <div className="mb-4 p-3 bg-green-100 text-green-800 rounded">
            {successMessage}
          </div>
        )}
        
        {errorMessage && (
          <div className="mb-4 p-3 bg-red-100 text-red-800 rounded">
            {errorMessage}
          </div>
        )}
        
        <form onSubmit={handlePasswordSubmit}>
          <div className="space-y-4">
            <div>
              <label className="block text-gray-700 mb-1">Current Password</label>
              <input
                type="password"
                name="currentPassword"
                value={formData.currentPassword}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                required
              />
            </div>
            
            <div>
              <label className="block text-gray-700 mb-1">New Password</label>
              <input
                type="password"
                name="newPassword"
                value={formData.newPassword}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                required
                minLength="8"
              />
            </div>
            
            <div>
              <label className="block text-gray-700 mb-1">Confirm New Password</label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                required
              />
            </div>
          </div>
          
          <div className="mt-6">
            <button
              type="submit"
              className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-blue-800 transition"
            >
              Update Password
            </button>
          </div>
        </form>
      </div>
      
      <div className="bg-white p-6 rounded-lg shadow-lg mb-8">
        <h2 className="text-xl font-bold text-primary mb-4">Notification Preferences</h2>
        
        <form onSubmit={handlePreferencesSubmit}>
          <div className="space-y-3">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="notifications"
                name="notifications"
                checked={formData.notifications}
                onChange={handleChange}
                className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
              />
              <label htmlFor="notifications" className="ml-2 block text-gray-700">
                Receive email notifications
              </label>
            </div>
            
            <div className="flex items-center">
              <input
                type="checkbox"
                id="darkMode"
                name="darkMode"
                checked={formData.darkMode}
                onChange={handleChange}
                className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
              />
              <label htmlFor="darkMode" className="ml-2 block text-gray-700">
                Dark mode
              </label>
            </div>
          </div>
          
          <div className="mt-6">
            <button
              type="submit"
              className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-blue-800 transition"
            >
              Save Preferences
            </button>
          </div>
        </form>
      </div>
      
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <h2 className="text-xl font-bold text-red-600 mb-4">Danger Zone</h2>
        
        <div className="space-y-4">
          <div>
            <button
              onClick={logout}
              className="bg-gray-200 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-300 transition"
            >
              Logout
            </button>
          </div>
          
          <div>
            <p className="text-gray-700 mb-2">Permanently delete your account and all associated data.</p>
            <button
              className="bg-red-100 text-red-700 px-4 py-2 rounded-lg hover:bg-red-200 transition"
              onClick={() => {
                if (window.confirm('Are you sure you want to delete your account? This cannot be undone.')) {
                  // In a real app, this would call an API to delete the account
                  logout();
                }
              }}
            >
              Delete Account
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;