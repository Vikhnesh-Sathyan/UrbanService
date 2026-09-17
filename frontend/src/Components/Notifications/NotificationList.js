import React from "react";

import NotificationItem from "./NotificationItem";

const NotificationList = ({
  notifications,
  unreadCount,
  onMarkAsRead,
  onMarkAllAsRead,
}) => {
  return (
    <div className="notification-list">

      {/* ==========================================
          HEADER
      ========================================== */}

      <div className="notification-list-header">

        <div>
          <h3>
            Notifications
          </h3>

          {unreadCount > 0 && (
            <span>
              {unreadCount} unread
            </span>
          )}
        </div>


        {/* Mark all as read */}

        {unreadCount > 0 && (
          <button
            type="button"
            onClick={onMarkAllAsRead}
          >
            Mark all as read
          </button>
        )}

      </div>


      {/* ==========================================
          NOTIFICATION ITEMS
      ========================================== */}

      {notifications.length === 0 ? (

        <div className="notification-empty">
          No notifications yet.
        </div>

      ) : (

        <div className="notification-items">

          {notifications.map((notification) => (

            <NotificationItem
              key={notification._id}
              notification={notification}
              onMarkAsRead={onMarkAsRead}
            />

          ))}

        </div>

      )}

    </div>
  );
};

export default NotificationList;