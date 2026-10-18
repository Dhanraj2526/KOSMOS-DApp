import React, { useState } from "react";
import "./Login.css";

const Login = ({ onLogin, account }) => {
  const [isVerifying, setIsVerifying] = useState(false);

  return (
    <div className="login-container">
      <div className="login-card">
        <span className="login-icon-large">🛡️</span>
        <h2 className="login-title">SECURE LOGIN</h2>
        <p className="login-subtitle">
          Account: <span className="account-text">{account.slice(0,6)}...{account.slice(-4)}</span>
        </p>
        <p className="login-desc">
          Please sign the cryptographic message to verify your identity and unlock your encrypted drive.
        </p>
        <button 
          className="login-btn" 
          onClick={() => {
            setIsVerifying(true);
            onLogin();
          }}
          disabled={isVerifying}
        >
          {isVerifying ? "AUTHENTICATING..." : "INITIALIZE SECURE ACCESS"}
        </button>
      </div>
    </div>
  );
};

export default Login;
