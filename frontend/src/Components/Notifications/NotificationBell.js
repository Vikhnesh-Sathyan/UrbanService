import React, { useEffect, useRef, useState } from "react";
import { FaBell } from "react-icons/fa";

import NotificationList from "./NotificationList";

const NotificationBell = () => {
  const [isOpen, setIsOpen] = useState(false);

  const bellRef = useRef(null);

  // Close dropdown when clicking outside
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
      <button
        type="button"
        className="notification-bell-button"
        onClick={() => setIsOpen(!isOpen)}
      >
        <FaBell />
      </button>

      {isOpen && (
        <div className="notification-dropdown">
          <NotificationList />
        </div>
      )}
    </div>
  );
};

export default NotificationBell;