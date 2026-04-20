import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FcGoogle } from 'react-icons/fc';
import { FiArrowRight, FiBook, FiUsers, FiCalendar } from 'react-icons/fi';

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    
    if (!email || !password) {
      setError('Please enter email and password');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await fetch('http://localhost:8080/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          email,
          password,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        // Store user info and token in localStorage
        localStorage.setItem('user', JSON.stringify({
          name: data.user?.name || 'User',
          email: data.user?.email || email,
          id: data.user?.id || '',
          role: data.user?.role || 'STUDENT',
        }));
        localStorage.setItem('authToken', data.token || '');
        
        // Navigate to dashboard
        navigate('/dashboard');
      } else {
        setError(data.message || 'Login failed. Please try again.');
      }
    } catch (err) {
      setError('Error logging in: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    window.location.href = "http://localhost:8080/oauth2/authorization/google";
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 to-slate-800 p-4">
      <div className="w-full max-w-5xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* Left Side - Hero Section */}
          <div className="hidden lg:block">
            <div className="space-y-8">
              {/* Branding */}
              <div className="space-y-4">
                <div className="inline-flex items-center gap-3 bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                    <span className="text-2xl text-white font-bold">SC</span>
                  </div>
                  <h1 className="text-4xl font-bold">Smart Campus</h1>
                </div>
                <p className="text-xl text-gray-300">Group 177 - IT3030</p>
              </div>

              {/* Features */}
              <div className="space-y-4 pt-8 border-t border-gray-700">
                <h3 className="text-gray-400 text-sm font-semibold uppercase tracking-wider">Why Choose Smart Campus?</h3>
                
                <div className="space-y-4">
                  <div className="flex items-start gap-4 group cursor-pointer">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition">
                      <FiBook className="text-white" size={20} />
                    </div>
                    <div>
                      <h4 className="text-white font-semibold">Course Management</h4>
                      <p className="text-gray-400 text-sm">Effortlessly manage and track all your courses</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4 group cursor-pointer">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition">
                      <FiCalendar className="text-white" size={20} />
                    </div>
                    <div>
                      <h4 className="text-white font-semibold">Event Scheduling</h4>
                      <p className="text-gray-400 text-sm">Never miss important deadlines and events</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4 group cursor-pointer">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition">
                      <FiUsers className="text-white" size={20} />
                    </div>
                    <div>
                      <h4 className="text-white font-semibold">Collaboration</h4>
                      <p className="text-gray-400 text-sm">Connect and collaborate with peers and faculty</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Statistics */}
              <div className="grid grid-cols-3 gap-4 pt-8 border-t border-gray-700">
                <div>
                  <p className="text-3xl font-bold text-blue-400">2000+</p>
                  <p className="text-gray-400 text-sm">Active Users</p>
                </div>
                <div>
                  <p className="text-3xl font-bold text-purple-400">500+</p>
                  <p className="text-gray-400 text-sm">Courses</p>
                </div>
                <div>
                  <p className="text-3xl font-bold text-pink-400">150+</p>
                  <p className="text-gray-400 text-sm">Institutions</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side - Login Form */}
          <div className="w-full">
            <div className="bg-gradient-to-br from-gray-800 to-gray-900 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-gray-700">
              
              <div className="text-center mb-8">
                <h2 className="text-4xl font-bold text-white mb-2">Welcome Back</h2>
                <p className="text-gray-400">Sign in to your Smart Campus account</p>
              </div>

              {/* Error Message */}
              {error && (
                <div className="mb-6 p-4 rounded-lg bg-red-500 bg-opacity-10 border border-red-500 border-opacity-50 text-red-300 text-sm flex items-start gap-3 animate-in fade-in duration-300">
                  <span className="text-lg">⚠️</span>
                  <span>{error}</span>
                </div>
              )}

              {/* Login Form */}
              <form onSubmit={handleLogin} className="space-y-5">
                <div className="space-y-2">
                  <label className="text-gray-300 text-sm font-medium">Email Address</label>
                  <input 
                    type="email" 
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-5 py-3 rounded-xl bg-gray-700 bg-opacity-50 border border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-gray-300 text-sm font-medium">Password</label>
                  <input 
                    type="password" 
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-5 py-3 rounded-xl bg-gray-700 bg-opacity-50 border border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                  />
                </div>

                <div className="flex items-center justify-between pt-2">
                  <label className="flex items-center gap-2 text-gray-300 text-sm cursor-pointer">
                    <input type="checkbox" className="w-4 h-4 rounded border-gray-600" />
                    <span>Remember me</span>
                  </label>
                  <a href="#forgot" className="text-blue-400 hover:text-blue-300 text-sm font-medium transition">
                    Forgot password?
                  </a>
                </div>
                
                <button 
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 disabled:from-gray-600 disabled:to-gray-700 text-white font-semibold py-3 rounded-xl shadow-lg transition duration-300 transform hover:-translate-y-1 flex items-center justify-center gap-2 group"
                >
                  {loading ? (
                    <>
                      <span className="animate-spin">⏳</span>
                      <span>Signing In...</span>
                    </>
                  ) : (
                    <>
                      <span>Sign In</span>
                      <FiArrowRight className="group-hover:translate-x-1 transition" />
                    </>
                  )}
                </button>
              </form>

              {/* Divider */}
              <div className="flex items-center gap-4 my-8">
                <div className="flex-1 h-px bg-gradient-to-r from-gray-700 to-transparent"></div>
                <span className="text-gray-400 text-sm font-medium">OR</span>
                <div className="flex-1 h-px bg-gradient-to-l from-gray-700 to-transparent"></div>
              </div>

              {/* Google Login Button */}
              <button 
                onClick={handleGoogleLogin}
                className="w-full flex items-center justify-center gap-3 bg-white hover:bg-gray-100 text-gray-800 font-semibold py-3 rounded-xl transition duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                <FcGoogle size={24} />
                <span>Continue with Google</span>
              </button>

              {/* Sign Up Link */}
              <p className="text-center text-gray-400 text-sm mt-8">
                Don't have an account? 
                <span 
                  className="text-blue-400 font-semibold cursor-pointer hover:text-blue-300 ml-1 transition" 
                  onClick={() => navigate('/register')}
                >
                  Create one now
                </span>
              </p>
            </div>

            {/* Footer Text */}
            <p className="text-center text-gray-500 text-xs mt-8">
              By signing in, you agree to our Terms of Service and Privacy Policy
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;