import React, { useState } from "react";
import "./SignUp.css";

const SignUp = ({ contract, account, onRegisterSuccess }) => {
  const [username, setUsername] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSignUp = async (e) => {
    e.preventDefault();
    if (!username) return alert("Please enter a username");

    try {
      setIsLoading(true);
      const transaction = await contract.register(username);
      await transaction.wait();
      alert("Registration Successful!");
      onRegisterSuccess();
    } catch (error) {
      console.error("Registration error", error);
      alert("Registration failed. See console.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="signup-container">
      <div className="signup-card">
        <h2 className="signup-title">CREATE PROFILE</h2>
        <p className="signup-subtitle">Initialize your account on the blockchain.</p>
        <form onSubmit={handleSignUp}>
          <div className="input-group">
            <input
              type="text"
              placeholder="Choose a Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="signup-input"
            />
          </div>
          <button type="submit" className="signup-btn" disabled={isLoading}>
            {isLoading ? "Registering..." : "Register on Blockchain"}
          </button>
        </form>
        <p className="signup-note">
          Note: This is a one-time blockchain transaction to secure your identity.
        </p>
      </div>
    </div>
  );
};

export default SignUp;
