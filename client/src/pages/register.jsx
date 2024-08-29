import React, { useState } from "react";
import { useRef } from "react";
import "../styles/registerStyles.css";
import axios from "axios";
const Register = ({ setShowRegister }) => {
  const [success, setSuccess] = useState(false);
  const [faliure, setFaliure] = useState(false);
  const nameRef = useRef();
  const emailRef = useRef();
  const passwordRef = useRef();
  const [formData, setFormData] = useState({
    username: "",
    email: "",
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
        "http://localhost:8000/api/v1/user/register",
        formData
      );
      setSuccess(true);
      setFaliure(false);
    } catch (err) {
      setFaliure(true);
    }
  };
  return (
    <div className="register-container">
      <div className="logo">
        <i className="fa-solid fa-map-pin logo">World Mapper</i>
      </div>
      <form action="" className="register-form" onSubmit={handleFormSubmit}>
        <input
          type="text"
          name="username"
          placeholder="Username"
          className="username form-items"
          ref={nameRef}
          onChange={handleInputChange}
        />
        <i
          class="fa-solid fa-circle-xmark fa-lg cancelRegister"
          onClick={() => {
            setShowRegister(false);
          }}
        ></i>
        <input
          type="email"
          name="email"
          placeholder="Email"
          className="email form-items"
          ref={emailRef}
          onChange={handleInputChange}
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          className="password form-items"
          ref={passwordRef}
          onChange={handleInputChange}
        />
        <button className="registerButton">Register</button>
        {success && (
          <span className="success">
            Register Successful! You can login now.
          </span>
        )}
        {faliure && <span className="faliure">Something Went Wrong.</span>}
      </form>
    </div>
  );
};

export default Register;
