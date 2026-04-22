import React, { useState, useEffect } from 'react';
import { FiBell, FiX, FiTrash2 } from 'react-icons/fi';
import { apiFetch } from '../utils/api';

const NotificationPanel = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [filter, setFilter] = useState('all'); // all, booking, ticket, comment

  useEffect(() => {
    const loadNotifications = async () => {
      try {
        const data = await apiFetch('/api/notifications');
        setNotifications(Array.isArray(data.notifications) ? data.notifications : []);
      } catch (error) {
        console.error('Error loading notifications:', error);
        setNotifications([]);
      }
    };

    loadNotifications();
  }, []);

  useEffect(() => {
    const unread = notifications.filter(n => !n.read).length;
    setUnreadCount(unread);
  }, [notifications]);

  const handleMarkAsRead = async (id) => {
    try {
      await apiFetch(`/api/notifications/${id}/read`, { method: 'PUT' });
      setNotifications(notifications.map(n =>
        n.id === id ? { ...n, read: true } : n
      ));
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const handleDeleteNotification = async (id) => {
    try {
      await apiFetch(`/api/notifications/${id}`, { method: 'DELETE' });
      setNotifications(notifications.filter(n => n.id !== id));
    } catch (error) {
      console.error('Error deleting notification:', error);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await apiFetch('/api/notifications/mark-all-read', { method: 'PUT' });
      setNotifications(notifications.map(n => ({ ...n, read: true })));
    } catch (error) {
      console.error('Error marking all as read:', error);
    }
  };

  const filteredNotifications = filter === 'all'
    ? notifications
    : notifications.filter(n => n.type.toLowerCase() === filter.toLowerCase());

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'BOOKING':
        return '📅';
      case 'TICKET':
        return '🔧';
      case 'COMMENT':
        return '💬';
      default:
        return '📢';
    }
  };

  const formatTime = (date) => {
    const now = new Date();
    const diffMs = now - new Date(date);
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return new Date(date).toLocaleDateString();
  };

  return (
    <div className="fixed top-6 right-6 z-50">
      {/* Notification Bell Button */}
      <button
        className="relative w-12 h-12 rounded-full bg-cyan-500 text-white shadow-lg hover:shadow-xl transition-all flex items-center justify-center hover:scale-110"
        onClick={() => setIsOpen(!isOpen)}
        title="Notifications"
      >
        <FiBell size={24} />
        {unreadCount > 0 && (
          <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center animate-pulse">
            {unreadCount}
          </span>
        )}
      </button>

      {/* Notification Panel */}
      {isOpen && (
        <div className="absolute top-16 right-0 w-96 h-screen md:h-auto md:max-h-96 rounded-[1.5rem] border border-blue-100 bg-white shadow-2xl shadow-blue-200/60 flex flex-col animate-in slide-in-from-top-2 duration-300 overflow-hidden">
          {/* Header */}
          <div className="bg-blue-700 text-white p-4 flex justify-between items-center flex-shrink-0 border-b border-blue-200">
            <h2 className="font-bold text-lg">Notifications</h2>
            <button
              className="hover:bg-white hover:bg-opacity-20 p-1 rounded transition"
              onClick={() => setIsOpen(false)}
              title="Close notifications"
            >
              <FiX size={24} />
            </button>
          </div>

          {/* Filter Tabs */}
          <div className="flex gap-2 p-3 border-b border-blue-100 bg-blue-50/60 overflow-x-auto flex-shrink-0">
            {['all', 'booking', 'ticket', 'comment'].map((filterType) => {
              const counts = {
                all: notifications.length,
                booking: notifications.filter(n => n.type === 'BOOKING').length,
                ticket: notifications.filter(n => n.type === 'TICKET').length,
                comment: notifications.filter(n => n.type === 'COMMENT').length
              };
              const labels = {
                all: 'All',
                booking: 'Bookings',
                ticket: 'Tickets',
                comment: 'Comments'
              };
              return (
                <button
                  key={filterType}
                  onClick={() => setFilter(filterType)}
                    className={`px-3 py-1 rounded-full text-sm font-medium transition whitespace-nowrap ${
                    filter === filterType
                      ? 'bg-cyan-400 text-slate-950'
                      : 'bg-white text-slate-700 border border-blue-100 hover:border-blue-300'
                  }`}
                >
                  {labels[filterType]} ({counts[filterType]})
                </button>
              );
            })}
          </div>

          {/* Action Buttons */}
          {unreadCount > 0 && (
            <div className="px-4 py-2 bg-blue-50/60 border-b border-blue-100 flex-shrink-0">
              <button
                className="w-full px-3 py-2 bg-cyan-400 text-slate-950 rounded-xl transition text-sm font-semibold"
                onClick={handleMarkAllAsRead}
              >
                Mark all as read
              </button>
            </div>
          )}

          {/* Notifications List */}
          <div className="flex-1 overflow-y-auto">
            {filteredNotifications.length > 0 ? (
              filteredNotifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`p-4 border-b border-blue-100 hover:bg-blue-50/50 cursor-pointer transition flex gap-3 items-start ${
                    !notification.read ? 'bg-cyan-500/10 border-l-4 border-l-cyan-400' : ''
                  }`}
                  onClick={() => !notification.read && handleMarkAsRead(notification.id)}
                >
                  <div className="text-2xl flex-shrink-0 pt-1">
                    {getNotificationIcon(notification.type)}
                  </div>

                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-slate-800 text-sm">{notification.title}</h4>
                    <p className="text-slate-400 text-xs mt-1 line-clamp-2">{notification.message}</p>
                    <span className="text-slate-500 text-xs mt-1 block">
                      {formatTime(notification.createdAt)}
                    </span>
                  </div>

                  <div className="flex items-start gap-2 flex-shrink-0">
                    {!notification.read && (
                      <div className="w-2 h-2 bg-cyan-400 rounded-full mt-2"></div>
                    )}
                    <button
                      className="text-slate-500 hover:text-rose-400 transition p-1"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteNotification(notification.id);
                      }}
                      title="Delete notification"
                    >
                      <FiTrash2 size={16} />
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="flex flex-col items-center justify-center py-12 px-4">
                <FiBell size={48} className="text-slate-600 mb-3" />
                <h3 className="font-semibold text-slate-300">No Notifications</h3>
                <p className="text-slate-500 text-sm">You're all caught up!</p>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="p-3 border-t border-blue-100 bg-blue-50/60 flex-shrink-0">
            <a
              href="#settings"
              className="text-center text-sm text-cyan-300 hover:text-cyan-200 font-medium transition block"
            >
              Notification Settings
            </a>
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationPanel;
