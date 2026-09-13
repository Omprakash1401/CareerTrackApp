import React from "react";

function EmptyState({
  title,
  message,
  buttonText,
  onButtonClick
}) {
  return (
    <div className="empty-state">
      <div className="empty-state-icon">📋</div>

      <h3>{title}</h3>

      <p>{message}</p>

      {buttonText && (
        <button
          className="add-button"
          onClick={onButtonClick}
        >
          {buttonText}
        </button>
      )}
    </div>
  );
}

export default EmptyState;