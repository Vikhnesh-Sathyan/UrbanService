
import React, { useEffect } from "react";
import "../../../styles/ConfirmModal.css";

const ConfirmModal = ({
  isOpen,
  title = "Are you sure?",
  message = "Do you want to continue with this action?",
  confirmText = "Confirm",
  cancelText = "Cancel",
  variant = "danger",
  loading = false,
  onConfirm,
  onClose
}) => {

  useEffect(() => {
    if (!isOpen) return;

    const handleEscape = (event) => {
      if (event.key === "Escape" && !loading) {
        onClose();
      }
    };

    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("keydown", handleEscape);
    };

  }, [isOpen, loading, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="confirm-modal-overlay"
      onClick={() => {
        if (!loading) onClose();
      }}
    >

      <div
        className="confirm-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="confirm-modal-title"
        onClick={(event) => event.stopPropagation()}
      >

        <div className={`confirm-modal-icon ${variant}`}>
          {variant === "danger" ? "!" : "✓"}
        </div>

        <h3 id="confirm-modal-title">
          {title}
        </h3>

        <p>
          {message}
        </p>

        <div className="confirm-modal-actions">

          <button
            type="button"
            className="confirm-cancel-btn"
            onClick={onClose}
            disabled={loading}
          >
            {cancelText}
          </button>

          <button
            type="button"
            className={`confirm-action-btn ${variant}`}
            onClick={onConfirm}
            disabled={loading}
          >
            {loading ? "Please wait..." : confirmText}
          </button>

        </div>

      </div>

    </div>
  );
};

export default ConfirmModal;
