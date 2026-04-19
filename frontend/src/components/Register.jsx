import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FcGoogle } from 'react-icons/fc';

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setError('');
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    
    // Validation
    if (!formData.fullName || !formData.email || !formData.password || !formData.confirmPassword) {
      setError('Please fill in all fields');
      return;
    }
    
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);
    
    try {
      const response = await fetch('http://localhost:8080/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.fullName,
          email: formData.email,
          password: formData.password,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        alert('Registration successful! Please log in.');
        navigate('/login');
      } else {
        setError(data.message || 'Registration failed');
      }
    } catch (err) {
      setError('Error registering user: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleRegister = () => {
    window.location.href = "http://localhost:8080/oauth2/authorization/google";
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#1e3c72] to-[#2a5298] p-4">
      {/* Glassmorphism Card */}
      <div className="bg-white bg-opacity-10 backdrop-blur-lg rounded-3xl p-8 shadow-2xl border border-white border-opacity-20 w-full max-w-md">
        
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-white mb-2">Create Account</h2>
          <p className="text-blue-100 opacity-80">Smart Campus Group 177</p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-4 p-3 rounded-lg bg-red-500 bg-opacity-20 border border-red-400 text-red-200 text-sm">
            {error}
          </div>
        )}

        {/* Registration Form */}
        <form onSubmit={handleRegister} className="space-y-4">
          <div>
            <input 
              type="text"
              name="fullName"
              placeholder="Full Name" 
              value={formData.fullName}
              onChange={handleChange}
              className="w-full px-5 py-3 rounded-xl bg-white bg-opacity-20 border border-white border-opacity-30 text-white placeholder-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
            />
          </div>
          <div>
            <input 
              type="email"
              name="email"
              placeholder="Email Address" 
              value={formData.email}
              onChange={handleChange}
              className="w-full px-5 py-3 rounded-xl bg-white bg-opacity-20 border border-white border-opacity-30 text-white placeholder-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
            />
          </div>
          <div>
            <input 
              type="password"
              name="password"
              placeholder="Password" 
              value={formData.password}
              onChange={handleChange}
              className="w-full px-5 py-3 rounded-xl bg-white bg-opacity-20 border border-white border-opacity-30 text-white placeholder-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
            />
          </div>
          <div>
            <input 
              type="password"
              name="confirmPassword"
              placeholder="Confirm Password" 
              value={formData.confirmPassword}
              onChange={handleChange}
              className="w-full px-5 py-3 rounded-xl bg-white bg-opacity-20 border border-white border-opacity-30 text-white placeholder-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
            />
          </div>
          
          <button 
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold py-3 rounded-xl shadow-lg transition duration-300 transform hover:-translate-y-1"
          >
            {loading ? 'Creating Account...' : 'Sign Up'}
          </button>
        </form>

        {/* Divider */}
        <div className="flex items-center my-6">
          <div className="flex-1 h-px bg-white bg-opacity-30"></div>
          <span className="px-4 text-blue-100 text-sm">OR</span>
          <div className="flex-1 h-px bg-white bg-opacity-30"></div>
        </div>

        {/* Google Register Button */}
        <button 
          onClick={handleGoogleRegister}
          className="w-full flex items-center justify-center gap-3 bg-white hover:bg-gray-100 text-gray-800 font-medium py-3 rounded-xl transition duration-300 shadow-md"
        >
          <FcGoogle size={24} />
          <span>Continue with Google</span>
        </button>

        <p className="text-center text-blue-100 text-sm mt-8">
          Already have an account? <span 
            className="font-semibold cursor-pointer hover:underline" 
            onClick={() => navigate('/login')}
          >
            Sign In
          </span>
        </p>
      </div>
    </div>
  );
};

export default Register;
