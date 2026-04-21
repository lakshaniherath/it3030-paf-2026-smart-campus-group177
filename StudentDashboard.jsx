import React, { useState, useEffect } from 'react';
import NotificationPanel from '../components/NotificationPanel';
import Chatbot from '../components/Chatbot';
import './StudentDashboard.css';

const StudentDashboard = () => {
    const [user, setUser] = useState(null);
    const [stats, setStats] = useState({
        pendingBookings: 0,
        openTickets: 0,
        unreadNotifications: 0
    });

    useEffect(() => {
        // Retrieve user info stored after Google OAuth login
        const storedUser = JSON.parse(localStorage.getItem('user')) || {
            name: 'Student User',
            email: 'student@sliit.lk',
            role: 'STUDENT',
            picture: 'https://via.placeholder.com/150'
        };
        setUser(storedUser);

        // Fetch summary stats from backend
        fetchUnreadCount(storedUser.email);
    }, []);

    const fetchUnreadCount = async (email) => {
        try {
            const response = await fetch(`http://localhost:8080/api/notifications/count/unread?email=${email}`);
            const data = await response.json();
            setStats(prev => ({ ...prev, unreadNotifications: data.count || 0 }));
        } catch (error) {
            console.error("Error fetching notification count:", error);
        }
    };

    return (
        <div className="dashboard-container">
            <header className="dashboard-header">
                <div className="welcome-section">
                    <h1>Welcome back, {user?.name.split(' ')[0]}!</h1>
                    <p>Manage your campus life from your Smart Dashboard.</p>
                </div>
                <div className="header-actions">
                    <NotificationPanel userEmail={user?.email} />
                </div>
            </header>

            <main className="dashboard-content">
                <section className="stats-grid">
                    <div className="stat-card">
                        <h3>My Bookings</h3>
                        <p className="stat-value">{stats.pendingBookings}</p>
                        <span className="stat-label">Active Requests</span>
                    </div>
                    <div className="stat-card">
                        <h3>Active Tickets</h3>
                        <p className="stat-value">{stats.openTickets}</p>
                        <span className="stat-label">In Progress</span>
                    </div>
                    <div className="stat-card highlight">
                        <h3>Notifications</h3>
                        <p className="stat-value">{stats.unreadNotifications}</p>
                        <span className="stat-label">Unread Messages</span>
                    </div>
                </section>

                <section className="dashboard-grid">
                    <div className="dashboard-main">
                        <div className="card">
                            <h2>Recent Activity</h2>
                            <p className="empty-state">No recent activity to show.</p>
                        </div>
                    </div>
                    <aside className="dashboard-sidebar">
                        <div className="card profile-card">
                            <img src={user?.picture} alt="Profile" className="profile-img" />
                            <h3>{user?.name}</h3>
                            <p className="user-role">{user?.role}</p>
                            <p className="user-email">{user?.email}</p>
                        </div>
                    </aside>
                </section>
            </main>

            {/* Floating Chatbot Component */}
            <Chatbot />
        </div>
    );
};

export default StudentDashboard;