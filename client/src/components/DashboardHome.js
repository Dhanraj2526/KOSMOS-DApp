import React from "react";
import "./DashboardHome.css";

const DashboardHome = ({ account, totalFiles, blockNumber }) => {
  return (
    <div className="dashboard-home-wrapper">
      {/* VIBRANT SOLAR BACKGROUND */}
      <div className="solar-system">
        <div className="sun-glow"></div>
        <div className="stardust">
          {[...Array(20)].map((_, i) => (
            <div key={i} className="star"></div>
          ))}
        </div>
        <div className="orb orb-cyan"></div>
        <div className="orb orb-pink"></div>
      </div>

      <div className="dashboard-container">
        <div className="dashboard-welcome">
          <h1 className="luminous-title">KOSMOS</h1>
          <p className="luminous-subtitle">THE NEXT GENERATION OF ASSET SECURITY</p>
        </div>

        {/* VIBRANT AUTH CARD */}
        <div className="auth-luminous-card">
          <div className="auth-header">
            <div className="label-group">
              <span className="diamond-dot">🔷</span>
              <div className="operator-flex">
                <div className="user-profile-icon-mini">👤</div>
                <span className="auth-label">VERIFIED OPERATOR</span>
              </div>
            </div>
            <div className="status-pill">
              <span className="pulse-dot-green"></span>
              LIVE ACCESS
            </div>
          </div>
          <div className="auth-body">
            <div className="address-container">
              <span className="address-value">{account || "Connecting Wallet..."}</span>
            </div>
          </div>
        </div>

        {/* COLORFUL STAT TILES */}
        <div className="stats-grid">
          <div className="stat-tile-color blue-tile">
            <div className="tile-icon">📦</div>
            <div className="tile-data">
              <span className="tile-label">ASSETS SECURED</span>
              <span className="tile-value">{totalFiles}</span>
            </div>
          </div>

          <div className="stat-tile-color purple-tile">
            <div className="tile-icon">🛰️</div>
            <div className="tile-data">
              <span className="tile-label">BLOCK HEIGHT</span>
              <span className="tile-value">{blockNumber}</span>
            </div>
          </div>

          <div className="stat-tile-color gold-tile">
            <div className="tile-icon">💎</div>
            <div className="tile-data">
              <span className="tile-label">VAULT STATUS</span>
              <span className="tile-value">ENCRYPTED</span>
            </div>
          </div>
        </div>

        {/* INFO TILES WITH COLORFUL GRADIENTS */}
        <div className="info-grid">
          <div className="luminous-info-card">
            <div className="card-accent-blue"></div>
            <h3>DECENTRALIZED CORE</h3>
            <p>Experience true data sovereignty. Your files are distributed across a global P2P network, anchored by the Ethereum blockchain.</p>
          </div>

          <div className="luminous-info-card">
            <div className="card-accent-pink"></div>
            <h3>MILITARY-GRADE PRIVACY</h3>
            <p>Utilizing AES-256 and SHA-256 protocols to ensure your documents are unreadable to anyone but the authorized operator.</p>
          </div>
        </div>

        {/* COLORFUL TELEMETRY FOOTER */}
        <div className="vibrant-telemetry">
          <div className="tele-unit">
            <span className="unit-icon">🌐</span>
            <span className="unit-text">GLOBAL SYNC: ACTIVE</span>
          </div>
          <div className="tele-unit">
            <span className="unit-icon">🛡️</span>
            <span className="unit-text">NODE HEALTH: 100%</span>
          </div>
          <div className="tele-unit">
            <span className="unit-icon">⚡</span>
            <span className="unit-text">SPEED: OPTIMAL</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardHome;
