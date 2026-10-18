import React from "react";
import "./Landing.css";

const Landing = ({ connectWallet }) => {
  return (
    <div className="landing-container">
      <div className="landing-content">
        <h1 className="landing-title">KOSMOS</h1>
        <p className="landing-subtitle">
          Secure, Decentralized Document Management for the Future.
        </p>
        <div className="landing-features">
          <div className="feature-item">
            <span className="feature-icon">🛡️</span>
            <span>Blockchain Security</span>
          </div>
          <div className="feature-item">
            <span className="feature-icon">📁</span>
            <span>IPFS Storage</span>
          </div>
          <div className="feature-item">
            <span className="feature-icon">🤖</span>
            <span>AI Tagging</span>
          </div>
        </div>
        <button className="connect-btn" onClick={connectWallet}>
          Enter the Cosmos
        </button>
      </div>
      <div className="landing-bg">
        <div className="star"></div>
        <div className="star"></div>
        <div className="star"></div>
        <div className="star"></div>
        <div className="star"></div>
      </div>
    </div>
  );
};

export default Landing;
