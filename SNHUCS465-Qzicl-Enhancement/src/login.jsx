import React, { useState, useEffect } from "react";
import axios from "axios";

//TODO for Artifact 3, add a register feature

export default function Login({ onLogin }) {

  //Set empty variables, like username, password, and the error message
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(""); //Error message that displays in a red font
  const [regError, setRegError] = useState("");
  const [popup, setPopup] = useState(false);
  const [newUser, setNewUser] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  //Calls when the Log in button is clicked, which in turn calls an api route to send in the new data from the form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const res = await axios.post("/api/login", {
        usernameInput: username,
        passwordInput: password,
      });
      if (res.data.user) onLogin(res.data.user);
    } catch (error) {
      if (error.response && error.response.data && error.response.data.error) {
        setError(error.response.data.error);
      } else {
        // Fallback generic message
        setError("Invalid username or password");
      }

    }
  };

  const registerUser = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setRegError("Passwords do not match");
      return;
    }
    try {
      const res = await axios.post("/api/register", { newUser, newPassword });
      if (res.data.user) onLogin(res.data.user);
    }
    catch (error) {
      if (error.response && error.response.data && error.response.data.error) {
        setRegError(error.response.data.error);
      } else {
        // Fallback generic message
        setRegError("Invalid username or password");
      }
    }
  };



  //Return the root with a form submission element
  return (
    <div className="login-page">
      {/* LOGIN BOX */}
      <div id="login">
        <h1>Login</h1>

        {error && <p style={{ color: "red" }}>{error}</p>}

        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button type="submit" className="btnLogin">Login</button>
        </form>

        <button
          id="register"
          onClick={() => setPopup(true)}
        >
          Create New Account
        </button>
      </div>

      {/* REGISTER POPUP */}
      {popup && (
        <div id="registerPopup">
          <div id="regContainer">
            <h1>Register</h1>

            {regError && <p style={{ color: "red" }}>{regError}</p>}

            <form onSubmit={registerUser}>
              <input
                type="text"
                placeholder="Username"
                value={newUser}
                onChange={(e) => setNewUser(e.target.value)}
              />

              <input
                type="password"
                placeholder="Password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />

              <input
                type="password"
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />

              <button type="submit" className="btnLogin">Create Account</button>
            </form>

            <button
              className="btnClose"
              onClick={() => setPopup(false)}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
