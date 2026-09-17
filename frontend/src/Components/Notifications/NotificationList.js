import React, { useEffect, useState } from "react";

import NotificationItem from "./NotificationItem";

import {
  getMyNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
} from "../../Services/notificationService";

import {
  onNewNotification,
  offNewNotification,
} from "../../Services/notificationSocket";

const NotificationList = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  // Load existing notifications from MongoDB
  const loadNotifications = async () => {
    try {
      setLoading(true);

      const data = await getMyNotifications();

      setNotifications(data.notifications || []);
    } catch (error) {
      console.error(
        "Failed to load notifications:",
        error
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Load old notifications
    loadNotifications();

    // Receive new notification instantly
    const handleNewNotification = (notification) => {
      setNotifications((currentNotifications) => [
        notification,
        ...currentNotifications,
      ]);
    };

    onNewNotification(handleNewNotification);

    // Remove listener when component unmounts
    return () => {
      offNewNotification(handleNewNotification);
    };
  }, []);

  // Mark one notification as read
  const handleMarkAsRead = async (notificationId) => {
    try {
      await markNotificationAsRead(
        notificationId
      );

      setNotifications((currentNotifications) =>
        currentNotifications.map((notification) =>
          notification._id === notificationId
            ? {
                ...notification,
                isRead: true,
              }
            : notification
        )
      );
    } catch (error) {
      console.error(
        "Failed to mark notification as read:",
        error
      );
    }
  };

  // Mark all notifications as read
  const handleMarkAllAsRead = async () => {
    try {
      await markAllNotificationsAsRead();

      setNotifications((currentNotifications) =>
        currentNotifications.map(
          (notification) => ({
            ...notification,
            isRead: true,
          })
        )
      );
    } catch (error) {
      console.error(
        "Failed to mark all notifications as read:",
        error
      );
    }
  };

  const unreadCount = notifications.filter(
    (notification) => !notification.isRead
  ).length;

  return (
    <div className="notification-list">
      <div className="notification-list-header">
        <div>
          <h3>Notifications</h3>

          {unreadCount > 0 && (
            <span>
              {unreadCount} unread
            </span>
          )}
        </div>

        {unreadCount > 0 && (
          <button
            type="button"
            onClick={handleMarkAllAsRead}
          >
            Mark all as read
          </button>
        )}
      </div>

      {loading ? (
        <div className="notification-empty">
          Loading notifications...
        </div>
      ) : notifications.length === 0 ? (
        <div className="notification-empty">
          No notifications yet.
        </div>
      ) : (
        <div className="notification-items">
          {notifications.map((notification) => (
            <NotificationItem
              key={notification._id}
              notification={notification}
              onMarkAsRead={handleMarkAsRead}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default NotificationList;