
import React from "react";

function Navbar({ user, onLogout }) {
  return (
    <nav className="navbar">
      <h2 className="logo">CareerTrack</h2>

      <div className="profile">
        <span>👤</span>
        <span>{user?.name || "User"}</span>

        <button
          type="button"
          onClick={onLogout}
          className="logout-btn"
        >
          Logout
        </button>
      </div>
    </nav>
  );
}

export default Navbar;
