import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FcGoogle } from 'react-icons/fc';
import API_BASE_URL from '../utils/api';

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
      const response = await fetch(`${API_BASE_URL}/api/auth/register`, {
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
    window.location.href = `${API_BASE_URL}/oauth2/authorization/google`;
  };

  return (
    <div className="min-h-screen overflow-hidden bg-gradient-to-b from-blue-50 via-white to-cyan-50 p-4 text-slate-800">
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute -top-24 left-[-8rem] h-96 w-96 rounded-full bg-blue-300/30 blur-3xl animate-blob"></div>
        <div className="absolute top-16 right-[-6rem] h-96 w-96 rounded-full bg-cyan-300/25 blur-3xl animate-blob animation-delay-2000"></div>
      </div>

      {/* Glassmorphism Card */}
      <div className="relative mx-auto flex min-h-[calc(100vh-2rem)] w-full max-w-md items-center justify-center">
      <div className="w-full rounded-[2rem] border border-blue-100 bg-white/90 p-8 shadow-2xl shadow-blue-200/60 backdrop-blur-xl">
        
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-slate-900 mb-2">Create Account</h2>
          <p className="text-slate-600">Smart Campus Group 177</p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-4 rounded-2xl border border-rose-300 bg-rose-50 p-3 text-sm text-rose-800">
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
              className="w-full rounded-2xl border border-blue-100 bg-white px-5 py-3 text-slate-800 placeholder:text-slate-400 focus:border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-200"
            />
          </div>
          <div>
            <input 
              type="email"
              name="email"
              placeholder="Email Address" 
              value={formData.email}
              onChange={handleChange}
              className="w-full rounded-2xl border border-blue-100 bg-white px-5 py-3 text-slate-800 placeholder:text-slate-400 focus:border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-200"
            />
          </div>
          <div>
            <input 
              type="password"
              name="password"
              placeholder="Password" 
              value={formData.password}
              onChange={handleChange}
              className="w-full rounded-2xl border border-blue-100 bg-white px-5 py-3 text-slate-800 placeholder:text-slate-400 focus:border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-200"
            />
          </div>
          <div>
            <input 
              type="password"
              name="confirmPassword"
              placeholder="Confirm Password" 
              value={formData.confirmPassword}
              onChange={handleChange}
              className="w-full rounded-2xl border border-blue-100 bg-white px-5 py-3 text-slate-800 placeholder:text-slate-400 focus:border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-200"
            />
          </div>
          
          <button 
            type="submit"
            disabled={loading}
            className="w-full rounded-2xl bg-cyan-400 py-3 font-semibold text-slate-950 shadow-lg shadow-cyan-500/20 transition duration-300 hover:-translate-y-1 disabled:opacity-70"
          >
            {loading ? 'Creating Account...' : 'Sign Up'}
          </button>
        </form>

        {/* Divider */}
        <div className="flex items-center my-6">
          <div className="flex-1 h-px bg-white/10"></div>
          <span className="px-4 text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">OR</span>
          <div className="flex-1 h-px bg-white/10"></div>
        </div>

        {/* Google Register Button */}
        <button 
          onClick={handleGoogleRegister}
          type="button"
          className="w-full flex items-center justify-center gap-3 rounded-2xl border border-blue-100 bg-blue-50/60 py-3 font-medium text-slate-800 transition duration-300 hover:bg-blue-100/70"
        >
          <FcGoogle size={24} />
          <span>Continue with Google</span>
        </button>

        <p className="text-center text-slate-600 text-sm mt-8">
          Already have an account? <span 
            className="font-semibold cursor-pointer text-blue-700 hover:text-blue-800" 
            onClick={() => navigate('/login')}
          >
            Sign In
          </span>
        </p>
      </div>
      </div>
    </div>
  );
};

export default Register;
