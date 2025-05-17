import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('/api/auth/login', formData);
  
      console.log('Login successful:', response.data);
      navigate('/dashboard'); // Redirect to dashboard
    } catch (error) {
      console.error('Login error:', error.response?.data?.message || error.message);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-md">
      <h1 className="text-3xl font-bold text-primary mb-6 text-center">Login to Your Account</h1>
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-lg">
        <div className="space-y-4">
          <div>
            <label className="block text-gray-700 mb-1">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              required
            />
          </div>
          <div>
            <label className="block text-gray-700 mb-1">Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              required
            />
          </div>
        </div>
        <div className="mt-6">
          <button
            type="submit"
            className="w-full bg-primary text-white py-3 px-6 rounded-lg font-bold hover:bg-blue-800 transition"
          >
            Login
          </button>
        </div>
        <div className="mt-4 text-center">
          <Link to="/register" className="text-secondary hover:underline">
            Don't have an account? Register here
          </Link>
        </div>
      </form>
    </div>
  );
};

export default Login;
