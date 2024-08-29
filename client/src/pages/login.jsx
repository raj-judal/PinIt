import React, { useState } from "react";
import { useRef } from "react";
// import { createTheme, ThemeProvider } from "@mui/material/styles"; // Import ThemeProvider and createTheme
import "../styles/loginStyles.css";
import axios from "axios";
const Login = ({ setShowLogin, setcurrentUser }) => {
  const [faliure, setFaliure] = useState(false);
  const nameRef = useRef();
  const passwordRef = useRef();
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    console.log(formData);
    try {
      const res = await axios.post(
        "http://localhost:8000/api/v1/user/login",
        formData
      );
      if (res.status === 200) {
        const { _id, username } = res.data;
        setcurrentUser(username);
        setShowLogin(false); // Close the login form
      } else {
        // Handle other possible res statuses (e.g., 401 for unauthorized)
        setFaliure(true);
      }
    } catch (err) {
      setFaliure(true);
    }
  };

  return (
    <div className="login-container">
      <div className="logo">
        <i className="fa-solid fa-map-pin logo">World Mapper</i>
      </div>
      <form action="" className="login-form" onSubmit={handleFormSubmit}>
        <input
          type="text"
          placeholder="Username"
          className="username form-items"
          name="username"
          onChange={handleInputChange}
          ref={nameRef}
        />
        <i
          class="fa-solid fa-circle-xmark fa-lg cancelLogin"
          onClick={() => {
            setShowLogin(false);
          }}
        ></i>
        <input
          type="password"
          placeholder="Password"
          name="password"
          onChange={handleInputChange}
          className="password form-items"
          ref={passwordRef}
        />
        <button className="loginButton">Login</button>
        {faliure && <span className="faliure">Something Went Wrong.</span>}
      </form>
    </div>
  );
};

export default Login;
