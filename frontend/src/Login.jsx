import React from "react";
import Food from "./assets/Food.png";
import "./Login.css";
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { loginUser } from '../api/api'; // Importing the login API function

export const Login = () => {
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const email = e.target.elements[0].value;
    const password = e.target.elements[1].value;

    // Call the loginUser API function
    try {
      const response = await loginUser({ email, password });
      
      // If login is successful, navigate to the LandingPage
      if (response.data) {
        console.log('Login successful', response.data);
        navigate('/LandingPage');
      } else {
        alert('Login failed. Please try again.');
      }
    } catch (error) {
      console.error("Error logging in: ", error);
      alert('Login failed. Please check your credentials.');
    }
  };

  return (
    <div className="desktop">
      <div className="group">
        <div className="overlap">
          <div className="overlap-group-wrapper">
            <div className="overlap-group">
              <img className="IMG" alt="Img" src={Food} />

              <div className="rectangle">
                <div className="text-wrapper">WELCOME TO MEXX</div>
                <form className="loginform" onSubmit={handleSubmit}>
                  <p className="don-t-have-an">
                    Don’t have an Account?
                    <br />
                    <Link className="register-link" to="/SignupStudent">Register Here</Link>
                  </p>

                  <input className="email1" type="email" placeholder="Email" required />
                  <input className="password1" type="password" placeholder="Password" required />
                  <div className="text-wrapper-3">Forgot your password?</div>

                  <label className="checkbox">
                    <input type="checkbox" className="tickbox" name="example" value="1" />Remember Me
                  </label>

                  <button type="submit" className="div">Login</button>
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
