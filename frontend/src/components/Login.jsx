import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FcGoogle } from 'react-icons/fc';
import { FiArrowRight, FiBook, FiUsers, FiCalendar } from 'react-icons/fi';
import API_BASE_URL from '../utils/api';

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
      const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
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
    window.location.href = `${API_BASE_URL}/oauth2/authorization/google`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 via-white to-cyan-50 text-slate-800 overflow-hidden">
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute -top-24 left-[-8rem] h-96 w-96 rounded-full bg-blue-300/30 blur-3xl animate-blob"></div>
        <div className="absolute top-16 right-[-6rem] h-96 w-96 rounded-full bg-cyan-300/25 blur-3xl animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-0 left-1/3 h-[28rem] w-[28rem] rounded-full bg-indigo-200/30 blur-3xl animate-blob animation-delay-4000"></div>
      </div>

      <div className="relative mx-auto grid min-h-screen max-w-7xl items-center gap-12 px-4 py-10 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:px-8 lg:py-16">
        <div className="hidden lg:block">
          <div className="space-y-8">
            <div className="inline-flex items-center gap-3 rounded-full border border-cyan-300/40 bg-cyan-100 px-4 py-2 text-sm text-cyan-900 shadow-lg shadow-cyan-500/5">
              <span className="h-2 w-2 rounded-full bg-cyan-300"></span>
              Secure access to the Smart Campus Operations Hub
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-cyan-400 text-slate-950 font-black shadow-lg shadow-cyan-500/20">
                  SC
                </div>
                <div>
                  <h1 className="text-4xl font-black tracking-tight text-slate-900">Smart Campus</h1>
                  <p className="text-slate-600">Group 177 - IT3030</p>
                </div>
              </div>
              <p className="max-w-xl text-lg leading-8 text-slate-700">
                A refined campus management experience for bookings, incidents, notifications, and role-based access.
              </p>
            </div>

            <div className="grid gap-4 rounded-[1.75rem] border border-blue-100 bg-white/90 p-6 backdrop-blur-md shadow-sm">
              <FeatureLine
                icon={<FiBook className="text-cyan-300" size={18} />}
                title="Operations-first layout"
                description="Clear structure designed around the workflows your users actually need."
              />
              <FeatureLine
                icon={<FiCalendar className="text-cyan-300" size={18} />}
                title="Fast navigation"
                description="A simple path into the system without visual clutter or noise."
              />
              <FeatureLine
                icon={<FiUsers className="text-sky-300" size={18} />}
                title="Role-aware access"
                description="Student, lecturer, technician, and admin all feel consistent."
              />
            </div>

            <div className="grid grid-cols-3 gap-4">
              <MetricBlock value="2000+" label="Active users" />
              <MetricBlock value="500+" label="Resources" />
              <MetricBlock value="150+" label="Institutions" />
            </div>
          </div>
        </div>

        <div className="w-full">
          <div className="rounded-[2rem] border border-blue-100 bg-white/90 p-6 shadow-2xl shadow-blue-200/60 backdrop-blur-xl sm:p-8 lg:p-10">
            <div className="mb-8 text-center">
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-cyan-400 text-slate-950 font-black shadow-lg shadow-cyan-500/20 lg:hidden">
                SC
              </div>
              <h2 className="text-3xl font-bold text-slate-900 sm:text-4xl">Welcome Back</h2>
              <p className="mt-2 text-slate-600">Sign in to continue to your Smart Campus dashboard</p>
            </div>

            {error && (
              <div className="mb-6 flex items-start gap-3 rounded-2xl border border-rose-400/20 bg-rose-500/10 p-4 text-sm text-rose-200">
                <span className="text-lg">⚠️</span>
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-5">
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">Email Address</label>
                <input
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-2xl border border-blue-100 bg-white px-5 py-3 text-slate-800 placeholder:text-slate-400 focus:border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-200"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">Password</label>
                <input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-2xl border border-blue-100 bg-white px-5 py-3 text-slate-800 placeholder:text-slate-400 focus:border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-200"
                />
              </div>

              <div className="flex items-center justify-between pt-2 text-sm">
                <label className="flex items-center gap-2 text-slate-700 cursor-pointer">
                  <input type="checkbox" className="h-4 w-4 rounded border-blue-200 bg-white text-cyan-500 focus:ring-cyan-300" />
                  <span>Remember me</span>
                </label>
                <button type="button" onClick={() => navigate('/forgot-password')} className="font-medium text-blue-700 transition hover:text-blue-800">
                  Forgot password?
                </button>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="flex w-full items-center justify-center gap-2 rounded-2xl bg-cyan-400 px-6 py-3.5 font-semibold text-slate-950 shadow-lg shadow-cyan-500/20 transition hover:translate-y-[-1px] hover:shadow-xl hover:shadow-cyan-500/25 disabled:cursor-not-allowed disabled:opacity-70"
              >
                {loading ? (
                  <>
                    <span className="animate-spin">⏳</span>
                    <span>Signing In...</span>
                  </>
                ) : (
                  <>
                    <span>Sign In</span>
                    <FiArrowRight className="transition group-hover:translate-x-1" />
                  </>
                )}
              </button>
            </form>

            <div className="my-8 flex items-center gap-4">
              <div className="h-px flex-1 bg-gradient-to-r from-transparent via-white/15 to-transparent"></div>
              <span className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Or continue with</span>
              <div className="h-px flex-1 bg-gradient-to-r from-transparent via-white/15 to-transparent"></div>
            </div>

            <button
              type="button"
              onClick={handleGoogleLogin}
              className="flex w-full items-center justify-center gap-3 rounded-2xl border border-blue-100 bg-blue-50/60 px-6 py-3 font-semibold text-slate-800 transition hover:border-blue-300 hover:bg-blue-100/70"
            >
              <FcGoogle size={24} />
              <span>Continue with Google</span>
            </button>

            <p className="mt-8 text-center text-sm text-slate-600">
              Don't have an account?{' '}
              <span
                className="cursor-pointer font-semibold text-blue-700 transition hover:text-blue-800"
                onClick={() => navigate('/register')}
              >
                Create one now
              </span>
            </p>
          </div>

          <p className="mt-6 text-center text-xs text-slate-500">
            By signing in, you agree to our Terms of Service and Privacy Policy
          </p>
        </div>
      </div>
    </div>
  );
};

const FeatureLine = ({ icon, title, description }) => (
  <div className="flex items-start gap-4 rounded-2xl border border-blue-100 bg-white/90 p-4">
    <div className="mt-0.5 rounded-2xl bg-blue-50 p-2">{icon}</div>
    <div>
      <h4 className="font-semibold text-slate-900">{title}</h4>
      <p className="mt-1 text-sm leading-6 text-slate-600">{description}</p>
    </div>
  </div>
);

const MetricBlock = ({ value, label }) => (
  <div className="rounded-2xl border border-blue-100 bg-white p-4 text-center backdrop-blur-sm shadow-sm">
    <p className="text-2xl font-black text-blue-800">{value}</p>
    <p className="mt-1 text-xs uppercase tracking-[0.16em] text-slate-500">{label}</p>
  </div>
);

export default Login;