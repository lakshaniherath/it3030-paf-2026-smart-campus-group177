import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API_BASE_URL from '../utils/api';

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [token, setToken] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [generatedToken, setGeneratedToken] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loadingToken, setLoadingToken] = useState(false);
  const [resetting, setResetting] = useState(false);

  const requestToken = async (event) => {
    event.preventDefault();
    setError('');
    setSuccess('');

    if (!email) {
      setError('Please enter your account email.');
      return;
    }

    setLoadingToken(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/forgot-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Unable to create reset token');
      }

      setGeneratedToken(data.resetToken || '');
      setToken(data.resetToken || '');
      setSuccess('Reset token generated. Enter a new password and submit.');
    } catch (err) {
      setError(err.message || 'Unable to create reset token');
    } finally {
      setLoadingToken(false);
    }
  };

  const resetPassword = async (event) => {
    event.preventDefault();
    setError('');
    setSuccess('');

    if (!token || !newPassword || !confirmPassword) {
      setError('Please fill all reset fields.');
      return;
    }

    if (newPassword.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setResetting(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/reset-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, newPassword }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Unable to reset password');
      }

      setSuccess('Password reset successful. Please sign in with your new password.');
      setTimeout(() => navigate('/login'), 1200);
    } catch (err) {
      setError(err.message || 'Unable to reset password');
    } finally {
      setResetting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 via-white to-emerald-50/40 flex items-center justify-center p-4">
      <div className="w-full max-w-xl rounded-3xl border border-blue-100 bg-white/95 p-6 sm:p-8 shadow-2xl shadow-blue-200/50">
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">Forgot Password</h1>
        <p className="mt-2 text-slate-600">Generate a reset token, then set your new password.</p>

        {error && <div className="mt-4 rounded-xl border border-rose-300 bg-rose-50 px-4 py-3 text-sm text-rose-800">{error}</div>}
        {success && <div className="mt-4 rounded-xl border border-emerald-300 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">{success}</div>}

        <form onSubmit={requestToken} className="mt-6 space-y-3">
          <label className="block text-sm font-medium text-slate-700">Account Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-2xl border border-blue-100 bg-white px-4 py-3 text-slate-800 placeholder:text-slate-400 focus:border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-200"
            placeholder="you@example.com"
          />
          <button
            type="submit"
            disabled={loadingToken}
            className="w-full rounded-2xl bg-blue-700 py-3 font-semibold text-white transition hover:bg-blue-800 disabled:opacity-70"
          >
            {loadingToken ? 'Generating token...' : 'Generate Reset Token'}
          </button>
        </form>

        {generatedToken && (
          <div className="mt-5 rounded-xl border border-blue-200 bg-blue-50 p-4">
            <p className="text-xs uppercase tracking-[0.14em] text-blue-700 font-semibold">Reset Token (Demo)</p>
            <p className="mt-2 break-all text-sm font-medium text-slate-800">{generatedToken}</p>
          </div>
        )}

        <form onSubmit={resetPassword} className="mt-6 space-y-3">
          <label className="block text-sm font-medium text-slate-700">Reset Token</label>
          <input
            type="text"
            value={token}
            onChange={(e) => setToken(e.target.value)}
            className="w-full rounded-2xl border border-blue-100 bg-white px-4 py-3 text-slate-800 focus:border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-200"
            placeholder="Paste reset token"
          />

          <label className="block text-sm font-medium text-slate-700">New Password</label>
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="w-full rounded-2xl border border-blue-100 bg-white px-4 py-3 text-slate-800 focus:border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-200"
            placeholder="At least 6 characters"
          />

          <label className="block text-sm font-medium text-slate-700">Confirm New Password</label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full rounded-2xl border border-blue-100 bg-white px-4 py-3 text-slate-800 focus:border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-200"
            placeholder="Re-enter new password"
          />

          <button
            type="submit"
            disabled={resetting}
            className="w-full rounded-2xl bg-emerald-400 py-3 font-semibold text-slate-900 transition hover:bg-emerald-500 disabled:opacity-70"
          >
            {resetting ? 'Resetting password...' : 'Reset Password'}
          </button>
        </form>

        <button
          onClick={() => navigate('/login')}
          className="mt-6 w-full rounded-2xl border border-blue-200 bg-white py-3 text-sm font-semibold text-blue-700 hover:bg-blue-50 transition"
        >
          Back to Login
        </button>
      </div>
    </div>
  );
};

export default ForgotPassword;
