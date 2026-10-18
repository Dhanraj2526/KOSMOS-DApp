import React from "react";
import "./Navbar.css";

const Navbar = ({ account, username, onLogout, activeTab, setActiveTab }) => {
  return (
    <nav className="navbar-wrapper">
      <div className="navbar">
        <div className="navbar-brand">KOSMOS</div>
        
        <div className="nav-links">
          <button 
            className={`nav-link ${activeTab === "home" ? "active" : ""}`}
            onClick={() => setActiveTab("home")}
          >
            HOME
          </button>
          <button 
            className={`nav-link ${activeTab === "drive" ? "active" : ""}`}
            onClick={() => setActiveTab("drive")}
          >
            MY DRIVE
          </button>
          <button 
            className={`nav-link ${activeTab === "shared" ? "active" : ""}`}
            onClick={() => setActiveTab("shared")}
          >
            SHARED
          </button>
          <button 
            className={`nav-link ${activeTab === "permissions" ? "active" : ""}`}
            onClick={() => setActiveTab("permissions")}
          >
            PERMISSIONS
          </button>
        </div>

        <div className="navbar-info">
          <div className="user-profile">
            <span className="user-name">ACCESS GRANTED: {username || "UNREGISTERED"}</span>
            <button className="logout-btn-premium" onClick={onLogout}>LOGOUT</button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
