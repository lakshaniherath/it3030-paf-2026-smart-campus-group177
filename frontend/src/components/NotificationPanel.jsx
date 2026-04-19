import React, { useState, useEffect } from 'react';
import { FiBell, FiX, FiTrash2 } from 'react-icons/fi';

const NotificationPanel = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState([
    {
      id: '1',
      type: 'BOOKING',
      title: 'Booking Approved',
      message: 'Your booking for Conference Room A has been approved.',
      read: false,
      createdAt: new Date(Date.now() - 5 * 60000),
      relatedId: 'booking-123'
    },
    {
      id: '2',
      type: 'TICKET',
      title: 'Ticket Status Updated',
      message: 'Your maintenance ticket is now in progress.',
      read: false,
      createdAt: new Date(Date.now() - 15 * 60000),
      relatedId: 'ticket-456'
    },
    {
      id: '3',
      type: 'COMMENT',
      title: 'New Comment',
      message: 'John Doe commented on your ticket.',
      read: true,
      createdAt: new Date(Date.now() - 2 * 3600000),
      relatedId: 'ticket-456'
    }
  ]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [filter, setFilter] = useState('all'); // all, booking, ticket, comment

  useEffect(() => {
    const unread = notifications.filter(n => !n.read).length;
    setUnreadCount(unread);
  }, [notifications]);

  const handleMarkAsRead = async (id) => {
    try {
      await fetch(`http://localhost:8080/api/notifications/${id}/read`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        }
      });
      setNotifications(notifications.map(n =>
        n.id === id ? { ...n, read: true } : n
      ));
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const handleDeleteNotification = async (id) => {
    try {
      await fetch(`http://localhost:8080/api/notifications/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        }
      });
      setNotifications(notifications.filter(n => n.id !== id));
    } catch (error) {
      console.error('Error deleting notification:', error);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await fetch('http://localhost:8080/api/notifications/mark-all-read', {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        }
      });
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
        className="relative w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 text-white shadow-lg hover:shadow-xl transition-all flex items-center justify-center hover:scale-110"
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
        <div className="absolute top-16 right-0 w-96 h-screen md:h-auto md:max-h-96 bg-white rounded-lg shadow-2xl flex flex-col animate-in slide-in-from-top-2 duration-300 overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white p-4 flex justify-between items-center flex-shrink-0">
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
          <div className="flex gap-2 p-3 border-b border-gray-200 bg-gray-50 overflow-x-auto flex-shrink-0">
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
                      ? 'bg-purple-500 text-white'
                      : 'bg-white text-gray-700 border border-gray-300 hover:border-purple-500'
                  }`}
                >
                  {labels[filterType]} ({counts[filterType]})
                </button>
              );
            })}
          </div>

          {/* Action Buttons */}
          {unreadCount > 0 && (
            <div className="px-4 py-2 bg-blue-50 border-b border-gray-200 flex-shrink-0">
              <button
                className="w-full px-3 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded transition text-sm font-medium"
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
                  className={`p-4 border-b border-gray-100 hover:bg-gray-50 cursor-pointer transition flex gap-3 items-start ${
                    !notification.read ? 'bg-blue-50 border-l-4 border-l-purple-500' : ''
                  }`}
                  onClick={() => !notification.read && handleMarkAsRead(notification.id)}
                >
                  <div className="text-2xl flex-shrink-0 pt-1">
                    {getNotificationIcon(notification.type)}
                  </div>

                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-gray-800 text-sm">{notification.title}</h4>
                    <p className="text-gray-600 text-xs mt-1 line-clamp-2">{notification.message}</p>
                    <span className="text-gray-400 text-xs mt-1 block">
                      {formatTime(notification.createdAt)}
                    </span>
                  </div>

                  <div className="flex items-start gap-2 flex-shrink-0">
                    {!notification.read && (
                      <div className="w-2 h-2 bg-purple-500 rounded-full mt-2"></div>
                    )}
                    <button
                      className="text-gray-400 hover:text-red-500 transition p-1"
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
                <FiBell size={48} className="text-gray-300 mb-3" />
                <h3 className="font-semibold text-gray-600">No Notifications</h3>
                <p className="text-gray-400 text-sm">You're all caught up!</p>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="p-3 border-t border-gray-200 bg-gray-50 flex-shrink-0">
            <a
              href="#settings"
              className="text-center text-sm text-purple-600 hover:text-purple-700 font-medium transition block"
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
