import React from "react";
import { FaBell, FaCheck } from "react-icons/fa";

const NotificationItem = ({
  notification,
  onMarkAsRead,
}) => {
  const handleClick = () => {
    if (!notification.isRead) {
      onMarkAsRead(notification._id);
    }
  };

  return (
    <div
      className={`notification-item ${
        notification.isRead
          ? "notification-read"
          : "notification-unread"
      }`}
      onClick={handleClick}
    >
      <div className="notification-icon">
        <FaBell />
      </div>

      <div className="notification-content">
        <p>{notification.message}</p>

        <span>
          {new Date(
            notification.createdAt
          ).toLocaleString()}
        </span>
      </div>

      {!notification.isRead && (
        <div className="notification-unread-dot"></div>
      )}

      {notification.isRead && (
        <FaCheck className="notification-read-icon" />
      )}
    </div>
  );
};

export default NotificationItem;