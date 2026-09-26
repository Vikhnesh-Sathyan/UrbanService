//To show the notification bell, load the user's notifications, receive new notifications in real time, show the unread count, and let the user mark notifications as read.

import React, {
  useEffect,
  useRef,
  useState,
} from "react";

import { useNavigate } from "react-router-dom";import { FaBell } from "react-icons/fa";

import NotificationList from "./NotificationList";

import {
  getMyNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
} from "../../Services/notificationService";

import {
  onNewNotification,
  offNewNotification,
} from "../../Services/notificationSocket";

import "../../styles/Notification.css";

const NotificationBell = () => {

  const navigate = useNavigate();

  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);

  //→ Keeps a reference to the notification container.
  const bellRef = useRef(null);

  // ==========================================
  // LOAD EXISTING NOTIFICATIONS
  // ==========================================

  useEffect(() => {
    const loadNotifications = async () => {
      try {
        const data = await getMyNotifications();

        setNotifications(data.notifications || []);
      } catch (error) {
        console.error(
          "Failed to load notifications:",
          error
        );
      }
    };

    loadNotifications();
  }, []);


  // ==========================================
  // RECEIVE REAL-TIME NOTIFICATIONS
  // ==========================================

  useEffect(() => {
    const handleNewNotification = (notification) => {
      console.log(
        "🔔 NEW NOTIFICATION RECEIVED:",
        notification
      );

      setNotifications((currentNotifications) => [
        notification,
        ...currentNotifications,
      ]);
    };

    onNewNotification(handleNewNotification);

    return () => {
      offNewNotification(handleNewNotification);
    };
  }, []);


  // ==========================================
  // UNREAD COUNT
  // ==========================================

  const unreadCount = notifications.filter(
    (notification) => !notification.isRead
  ).length;


  // ==========================================
  // MARK ONE AS READ
  // ==========================================

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


  // ==========================================
  // MARK ALL AS READ
  // ==========================================

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

  // ==========================================
// HANDLE NOTIFICATION CLICK
// ==========================================

const handleNotificationClick = (
  notification
) => {
  // Close notification dropdown
  setIsOpen(false);

  // Emergency booking notification
  if (
    notification.message?.includes(
      "Emergency request"
    )
  ) {
    navigate("/provider/bookings");
  }
};

  // ==========================================
  // CLOSE WHEN CLICKING OUTSIDE
  // ==========================================

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        bellRef.current &&
        !bellRef.current.contains(event.target)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener(
      "mousedown",
      handleClickOutside
    );

    return () => {
      document.removeEventListener(
        "mousedown",
        handleClickOutside
      );
    };
  }, []);


  return (
    <div
      className="notification-bell-container"
      ref={bellRef}
    >

      {/* ==========================================
          BELL BUTTON
      ========================================== */}

      <button
        type="button"
        className="notification-bell-button"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Notifications"
      >

        <FaBell />

        {/* Unread count */}

        {unreadCount > 0 && (
          <span className="notification-count">
            {unreadCount > 9
              ? "9+"
              : unreadCount}
          </span>
        )}

      </button>


      {/* ==========================================
          DROPDOWN
      ========================================== */}

      {isOpen && (
        <div className="notification-dropdown">

      <NotificationList
  notifications={notifications}
  unreadCount={unreadCount}
  onMarkAsRead={handleMarkAsRead}
  onMarkAllAsRead={
    handleMarkAllAsRead
  }
  onNotificationClick={
    handleNotificationClick
  }
/>  

        </div>
      )}

    </div>
  );
};

export default NotificationBell;