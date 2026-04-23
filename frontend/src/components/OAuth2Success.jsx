import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API_BASE_URL from '../utils/api';

const OAuth2Success = () => {
  const navigate = useNavigate();
  const [error, setError] = useState('');

  useEffect(() => {
    const bootstrapOAuthSession = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/auth/oauth2/me`, {
          method: 'GET',
          credentials: 'include',
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || 'Google sign-in failed.');
        }

        localStorage.setItem('user', JSON.stringify({
          name: data.user?.name || 'User',
          email: data.user?.email || '',
          id: data.user?.id || '',
          role: data.user?.role || 'STUDENT',
        }));
        localStorage.setItem('authToken', data.token || 'oauth-session');

        navigate('/dashboard', { replace: true });
      } catch (err) {
        setError(err.message || 'Unable to complete Google sign-in.');
        setTimeout(() => navigate('/login', { replace: true }), 1800);
      }
    };

    bootstrapOAuthSession();
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 via-white to-cyan-50 flex items-center justify-center px-4">
      <div className="w-full max-w-md rounded-3xl border border-blue-100 bg-white/95 p-8 shadow-2xl shadow-blue-200/50 text-center">
        <h2 className="text-2xl font-bold text-slate-900">Google Sign-In</h2>
        {!error ? (
          <p className="mt-3 text-slate-600">Signing you in and loading your role-based dashboard...</p>
        ) : (
          <p className="mt-3 text-rose-700">{error}</p>
        )}
      </div>
    </div>
  );
};

export default OAuth2Success;
