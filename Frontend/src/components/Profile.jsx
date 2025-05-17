import { useState, useEffect } from 'react';
import { useAuth } from '../components/AuthContext'; 
import { Link } from 'react-router-dom';

const Profile = () => {
  const { currentUser, updateDetails, updatePassword } = useAuth();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    affiliation: '',
    userType: ''
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [isEditing, setIsEditing] = useState(false);
  const [isPasswordEditing, setIsPasswordEditing] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (currentUser) {
      setFormData({
        name: currentUser.name || '',
        email: currentUser.email || '',
        phone: currentUser.phone || '',
        affiliation: currentUser.affiliation || '',
        userType: currentUser.role || ''
      });
    }
  }, [currentUser]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({ ...prev, [name]: value }));
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const success = await updateDetails(formData);
      if (success) {
        setSuccessMessage('Profile updated successfully!');
        setIsEditing(false);
        setTimeout(() => setSuccessMessage(''), 3000);
      }
    } catch (err) {
      setError(err.message || 'Failed to update profile');
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setError("New passwords don't match");
      return;
    }

    try {
      const success = await updatePassword(passwordData.currentPassword, passwordData.newPassword);
      if (success) {
        setSuccessMessage('Password updated successfully!');
        setIsPasswordEditing(false);
        setPasswordData({
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        });
        setTimeout(() => setSuccessMessage(''), 3000);
      }
    } catch (err) {
      setError(err.message || 'Failed to update password');
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <h1 className="text-3xl font-bold text-primary mb-6">Your Profile</h1>

      <div className="bg-white p-6 rounded-lg shadow-lg">
        {successMessage && <div className="mb-4 p-3 bg-green-100 text-green-800 rounded">{successMessage}</div>}
        {error && <div className="mb-4 p-3 bg-red-100 text-red-800 rounded">{error}</div>}

        <form onSubmit={handleProfileSubmit}>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-gray-700 mb-1">Full Name</label>
              {isEditing ? (
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary"
                  required
                />
              ) : (
                <p className="px-4 py-2 bg-gray-50 rounded-lg">{formData.name}</p>
              )}
            </div>

            <div>
              <label className="block text-gray-700 mb-1">Email</label>
              <p className="px-4 py-2 bg-gray-50 rounded-lg">{formData.email}</p>
            </div>

            <div>
              <label className="block text-gray-700 mb-1">Phone Number</label>
              {isEditing ? (
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary"
                />
              ) : (
                <p className="px-4 py-2 bg-gray-50 rounded-lg">{formData.phone || 'Not provided'}</p>
              )}
            </div>

            <div>
              <label className="block text-gray-700 mb-1">User Type</label>
              <p className="px-4 py-2 bg-gray-50 rounded-lg capitalize">{formData.userType}</p>
            </div>

            {formData.userType === 'guest' && (
              <div className="md:col-span-2">
                <label className="block text-gray-700 mb-1">Affiliation</label>
                {isEditing ? (
                  <input
                    type="text"
                    name="affiliation"
                    value={formData.affiliation}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary"
                  />
                ) : (
                  <p className="px-4 py-2 bg-gray-50 rounded-lg">{formData.affiliation || 'Not provided'}</p>
                )}
              </div>
            )}
          </div>

          <div className="mt-8 flex justify-end space-x-4">
            {isEditing ? (
              <>
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="bg-gray-200 text-gray-800 px-6 py-2 rounded-lg hover:bg-gray-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-blue-800"
                >
                  Save Changes
                </button>
              </>
            ) : (
              <button
                type="button"
                onClick={() => setIsEditing(true)}
                className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-blue-800"
              >
                Edit Profile
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Password Update Section */}
      <div className="mt-8 bg-white p-6 rounded-lg shadow-lg">
        <h2 className="text-xl font-bold text-primary mb-4">Account Security</h2>

        {isPasswordEditing ? (
          <form onSubmit={handlePasswordSubmit} className="space-y-4">
            <div>
              <label className="block text-gray-700 mb-1">Current Password</label>
              <input
                type="password"
                name="currentPassword"
                value={passwordData.currentPassword}
                onChange={handlePasswordChange}
                className="w-full px-4 py-2 border rounded-lg"
                required
              />
            </div>
            <div>
              <label className="block text-gray-700 mb-1">New Password</label>
              <input
                type="password"
                name="newPassword"
                value={passwordData.newPassword}
                onChange={handlePasswordChange}
                className="w-full px-4 py-2 border rounded-lg"
                required
              />
            </div>
            <div>
              <label className="block text-gray-700 mb-1">Confirm New Password</label>
              <input
                type="password"
                name="confirmPassword"
                value={passwordData.confirmPassword}
                onChange={handlePasswordChange}
                className="w-full px-4 py-2 border rounded-lg"
                required
              />
            </div>
            <div className="flex justify-end space-x-4">
              <button
                type="button"
                onClick={() => setIsPasswordEditing(false)}
                className="bg-gray-200 text-gray-800 px-6 py-2 rounded-lg hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="bg-secondary text-white px-6 py-2 rounded-lg hover:bg-red-700"
              >
                Update Password
              </button>
            </div>
          </form>
        ) : (
          <button
            onClick={() => setIsPasswordEditing(true)}
            className="text-secondary hover:underline"
          >
            Change Password
          </button>
        )}
      </div>
    </div>
  );
};

export default Profile;
