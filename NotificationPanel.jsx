import React, { useState, useEffect } from 'react';
import './NotificationPanel.css';

const NotificationPanel = ({ userEmail }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [notifications, setNotifications] = useState([]);
    const unreadCount = notifications.filter(n => !n.read).length;

    useEffect(() => {
        if (userEmail) {
            fetchNotifications();
        }
    }, [userEmail]);

    const fetchNotifications = async () => {
        try {
            const response = await fetch(`http://localhost:8080/api/notifications?email=${userEmail}`);
            const data = await response.json();
            setNotifications(data.notifications || []);
        } catch (error) {
            console.error("Error fetching notifications:", error);
        }
    };

    const markAsRead = async (id) => {
        try {
            await fetch(`http://localhost:8080/api/notifications/${id}/read`, { method: 'PUT' });
            setNotifications(notifications.map(n => n.id === id ? { ...n, read: true } : n));
        } catch (error) {
            console.error("Error marking as read:", error);
        }
    };

    const deleteNotification = async (id) => {
        try {
            await fetch(`http://localhost:8080/api/notifications/${id}`, { method: 'DELETE' });
            setNotifications(notifications.filter(n => n.id !== id));
        } catch (error) {
            console.error("Error deleting notification:", error);
        }
    };

    return (
        <div className="notification-wrapper">
            <button className="bell-btn" onClick={() => setIsOpen(!isOpen)}>
                <i className="fas fa-bell"></i>
                {unreadCount > 0 && <span className="badge">{unreadCount}</span>}
            </button>

            {isOpen && (
                <div className="notification-dropdown">
                    <div className="notif-header">
                        <h3>Notifications</h3>
                        <button onClick={fetchNotifications} className="refresh-btn">
                            <i className="fas fa-sync-alt"></i>
                        </button>
                    </div>
                    <div className="notif-list">
                        {notifications.length === 0 ? (
                            <div className="empty-notif">No notifications yet</div>
                        ) : (
                            notifications.map(notif => (
                                <div key={notif.id} className={`notif-item ${notif.read ? 'read' : 'unread'}`}>
                                    <div className="notif-content" onClick={() => markAsRead(notif.id)}>
                                        <div className="notif-type-icon">{getIcon(notif.type)}</div>
                                        <div className="notif-text">
                                            <p className="notif-title">{notif.title}</p>
                                            <p className="notif-message">{notif.message}</p>
                                            <span className="notif-time">{formatTime(notif.createdAt)}</span>
                                        </div>
                                    </div>
                                    <button className="delete-notif" onClick={() => deleteNotification(notif.id)}>×</button>
                                </div>
                            ))
                        )}
                    </div>
                    <div className="notif-footer">
                        <button className="mark-all-btn">Mark all as read</button>
                    </div>
                </div>
            )}
        </div>
    );
};

const getIcon = (type) => {
    switch(type) {
        case 'BOOKING': return '📅';
        case 'TICKET': return '🔧';
        case 'COMMENT': return '💬';
        default: return '📢';
    }
};

const formatTime = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.round(diffMs / 60000);
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    return date.toLocaleDateString();
};

export default NotificationPanel;