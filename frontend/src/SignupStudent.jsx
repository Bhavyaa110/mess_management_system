import React, { useState } from "react";
import Food from "./assets/Food.png";
import "./SignupStudent.css";
import { Link, useNavigate } from 'react-router-dom';
import { SignupStudent as SignupStudentAPI } from "./api/api.js";

const SignupUser = () => {
  const navigate = useNavigate();
  const [role, setRole] = useState("Student");
  const [form, setForm] = useState({
    full_name: "", roll_no: "", email: "", phone_number: "", hostel: "", password: ""
  });
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target; // Dynamically update the form state
    setForm((prevForm) => ({ ...prevForm, [name]: value }));
  };

  const handlestudent = () => {
    setRole("Student"); // Set role to 'Student'
    setError(""); // Clear any previous error
  };

  const handlestaff = () => {
    setRole("Staff"); // Set role to 'Staff'
    setError(""); // Clear any previous error
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent form default submission
    try {
      // Ensure roll_no is non-empty if the role is "Student"
      if (role === "Student" && !form.roll_no) {
        setError("Roll number is required for students");
        return;
      }

      const payload = {
        ...form,
        role,
        roll_no: form.roll_no ? parseInt(form.roll_no, 10) : null, // Convert roll_no to int if provided
      };

      const res = await SignupStudentAPI(payload); // Call the API helper function

      if (res.data.success) {
        setSuccessMessage("Account successfully created!");
        setError(""); // Clear error
        navigate("/Login"); // Redirect to Login page
      } else {
        setError(res.data.message || "Signup failed");
      }
    } catch (err) {
      console.error("Signup error:", err);
      setError(err.response?.data?.message || "An error occurred during signup.");
    }
  };

  return (
    <div className="container">
      <div className="image-section">
        <img className="IMG" alt="Img" src={Food} />
      </div>
      <div className="form-section">
        <h1>WELCOME TO MEXX</h1>
        <p className="subtitle">Create Your Account</p>

        <div className="toggle-buttons">
          <button onClick={handlestudent} id="student" className={`Student ${role === "Student" ? "active" : ""}`}>
            Student
          </button>
          <div className="separator-line"></div>
          <button onClick={handlestaff} id="staff" className={`Staff ${role === "Staff" ? "active" : ""}`}>
            Staff
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div id="form1" className="form-row">
            <input
              className="name"
              type="text"
              name="full_name"
              placeholder="Name"
              value={form.full_name}
              onChange={handleChange}
              required
            />
            {role === "Student" && (
              <input
                className="name"
                id="rollno"
                type="text"
                name="roll_no"
                placeholder="Roll No."
                value={form.roll_no}
                onChange={handleChange}
                required
              />
            )}
          </div>
          <div className="form-row">
            <input
              className="name"
              type="text"
              name="phone_number"
              placeholder="Contact No."
              value={form.phone_number}
              onChange={handleChange}
              required
            />
            <input
              className="name"
              type="text"
              name="hostel"
              placeholder="Hostel"
              value={form.hostel}
              onChange={handleChange}
              required
            />
          </div>
          <input
            className="email"
            type="email"
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            required
          />
          <input
            className="password"
            type="password"
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            required
          />

          <button type="submit" className="submit-btn">
            Create Account
          </button>
          {error && <div className="error-message">{error}</div>}
          {successMessage && <div className="success-message">{successMessage}</div>}
          <p className="login-link">
            Already have an Account? <Link className="Signup-link" to="/Login">Log In</Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default SignupUser;
