
import React, { useEffect } from "react";
import { useToast } from "../../../Context/ToastContext";
import "../../../styles/Toast.css";

const Toast = () => {

  const { toast, hideToast } = useToast();

  useEffect(() => {
    if (!toast) return;

    const timer = setTimeout(() => {
      hideToast();
    }, 3500);

    return () => clearTimeout(timer);

  }, [toast, hideToast]);

  if (!toast) return null;

  const icons = {
    success: "✓",
    error: "✕",
    warning: "!",
    info: "i"
  };

  return (
    <div className={`toast toast-${toast.type}`}>

      <div className="toast-icon">
        {icons[toast.type] || icons.info}
      </div>

      <div className="toast-message">
        {toast.message}
      </div>

      <button
        className="toast-close"
        onClick={hideToast}
        aria-label="Close notification"
      >
        ×
      </button>

    </div>
  );
};

export default Toast;
