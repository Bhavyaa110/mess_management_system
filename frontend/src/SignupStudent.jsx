import React from "react";
import Food from "./assets/Food.png";
import "./SignupStudent.css";
import { Link } from 'react-router-dom';

export const SignupStudent = () => {

  let x=0

  const handlestudent = () =>{
    if(x==1){
      document.getElementById("student").style.backgroundColor="#C3D09A"
      document.getElementById("student").style.color="#4F622E"
      document.getElementById("staff").style.backgroundColor="#EFEDE4"
      document.getElementById("staff").style.color="#4F622E"
      const input = document.createElement("input");
      input.id = "rollno";
      input.type = "text";
      input.placeholder = "Roll No";
      input.className = "name";
      document.getElementById("form1").appendChild(input);
      x--
    }
    
  }
  const handlestaff = () =>{
    document.getElementById("staff").style.backgroundColor="#C3D09A"
    document.getElementById("staff").style.color="#4F622E"
    document.getElementById("student").style.backgroundColor="#EFEDE4"
    document.getElementById("student").style.color="#4F622E"
    document.getElementById("rollno").remove()
    x++
    console.log(x)
  }
  return (
    <div className="container">
      <div className="image-section">
        <img className="IMG" alt="Img" src={Food} />
      </div>
      <div className="form-section">
        <h1>WELCOME TO MEXX</h1>
        <p className="subtitle">Create Your Account</p>

        <div className="toggle-buttons">
          <button onClick={handlestudent} id="student" className="Student">Student</button>
          <div className="separator-line"></div>
          <button onClick={handlestaff} id="staff" className="Staff">Staff</button>
        </div>

        <form>
          <div id="form1" className="form-row">
            <input className="name" type="text" placeholder="Name" required />
            <input className="name" id="rollno" type="text" placeholder="Roll No." required />
          </div>
          <div className="form-row">
            <input className="name" type="text" placeholder="Contact No." required />
            <input className="name" type="text" placeholder="Hostel" required />
          </div>
          <input className="email" type="email" placeholder="Email" required />
          <input className="password" type="password" placeholder="Password" required />

          <button type="submit" className="submit-btn">
            Create Account
          </button>
          <p className="login-link">
            Already have an Account? <Link className="Signup-link" to="/Login">Sign Up</Link>
          </p>
        </form>
      </div>
    </div>
  );
};
export default SignupStudent;
