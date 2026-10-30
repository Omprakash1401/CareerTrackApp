
import React, { useEffect } from "react";

function Toast({ message, onClose, type = "success" }) {
  useEffect(() => {
    if (!message) return;

    const timer = setTimeout(onClose, 3000);
    return () => clearTimeout(timer);
  }, [message, onClose]);

  if (!message) return null;

  const icons = {
    success: "✓",
    error: "!",
    info: "i"
  };

  return (
    <div
      className={`toast toast-${type}`}
      role={type === "error" ? "alert" : "status"}
      aria-live={type === "error" ? "assertive" : "polite"}
    >
      <span className="toast-icon">
        {icons[type] || icons.info}
      </span>

      <span className="toast-message">{message}</span>

      <button
        type="button"
        onClick={onClose}
        aria-label="Dismiss notification"
      >
        ×
      </button>
    </div>
  );
}

export default Toast;
