import React, { useState } from "react";
import Food from "./assets/Food.png";
import "./Login.css";
import { Link, useNavigate } from "react-router-dom";
import { loginUser } from "./api/api.js";

const Login = () => {
  const navigate = useNavigate();
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const [emailInput, passwordInput] = e.target.elements;
    const email = emailInput.value.trim();
    const password = passwordInput.value;

    try {
      const { data } = await loginUser({ email, password });

      if (data.success) {
        // Store user in localStorage
        localStorage.setItem("user", JSON.stringify(data.user));
          
        // Redirect based on role
        if (data.user.role === "Staff") {
          navigate("/AdminPage");
        } else if (data.user.role === "Student") {
          navigate("/LandingPage");
        } else {
          setError("Invalid role. Unable to determine destination.");
        }
      } else {
        setError(data.message || "Login failed");
      }
    } catch (err) {
      console.error(err);
      setError("Wrong password/email");
    }
  };

  return (
    <div className="desktop">
      <div className="group">
        <div className="overlap">
          <div className="overlap-group-wrapper">
            <div className="overlap-group">
              <img className="IMG" alt="Food" src={Food} />
              <div className="rectangle">
                <div className="text-wrapper">WELCOME TO MEXX</div>
                <form className="loginform" onSubmit={handleSubmit}>
                  <p className="don-t-have-an">
                    Don’t have an Account?
                    <br />
                    <Link className="register-link" to="/SignupStudent">
                      Register Here
                    </Link>
                  </p>
                  <input
                    className="email1"
                    type="email"
                    placeholder="Email"
                    required
                  />
                  <input
                    className="password1"
                    type="password"
                    placeholder="Password"
                    required
                  />
                  <div className="text-wrapper-3">Forgot your password?</div>
                  <label className="checkbox">
                    <input type="checkbox" className="tickbox" /> Remember Me
                  </label>
                  <button type="submit" className="div">Login</button>
                  {error && <div className="error-message">{error}</div>}
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
