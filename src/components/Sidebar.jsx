import React from "react";
import { NavLink } from "react-router-dom";

function Sidebar() {
  return (
    <aside className="sidebar">

      <div className="sidebar-section-title">
        MENU
      </div>

      <NavLink
        to="/dashboard"
        className={({ isActive }) =>
          isActive ? "sidebar-link active" : "sidebar-link"
        }
      >
        <span className="sidebar-icon">🏠</span>
        <span>Dashboard</span>
      </NavLink>

      <NavLink
        to="/applications"
        className={({ isActive }) =>
          isActive ? "sidebar-link active" : "sidebar-link"
        }
      >
        <span className="sidebar-icon">💼</span>
        <span>Applications</span>
      </NavLink>

    </aside>
  );
}

export default Sidebar;