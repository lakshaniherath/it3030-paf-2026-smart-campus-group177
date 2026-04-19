import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminDashboard from './AdminDashboard';
import UserDashboard from './UserDashboard';

const Dashboard = () => {
  const navigate = useNavigate();
  const [userRole, setUserRole] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (!storedUser) {
      navigate('/login');
      return;
    }

    try {
      const userData = JSON.parse(storedUser);
      setUserRole(userData.role);
      setLoading(false);
    } catch (err) {
      navigate('/login');
    }
  }, [navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0f172a] flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  // Route to admin dashboard if user is admin or technician
  if (userRole === 'ADMIN' || userRole === 'TECHNICIAN') {
    return <AdminDashboard />;
  }

  // Route to user dashboard for all other roles
  return <UserDashboard />;
};

export default Dashboard;

