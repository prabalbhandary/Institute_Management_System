import React, { useState } from "react";
import "./style.css";
import loginImg from "../assets/book.png";
import axios from "axios";
import { toast } from "react-toastify";
import { Link, useNavigate } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);
    axios
      .post("http://localhost:4000/api/v1/users/login", {
        email: email,
        password: password,
      })
      .then((res) => {
        toast.success(res.data.message);
        setIsLoading(false);
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("fullName", res.data.fullName);
        localStorage.setItem("email", res.data.email);
        localStorage.setItem("imageUrl", res.data.imageUrl);
        localStorage.setItem("imageId", res.data.imageId);
        navigate("/dashboard/home");
      })
      .catch((error) => {
        setIsLoading(false);
        toast.error(error.response.data.message);
      });
  };

  return (
    <div className="login-wrapper">
      <div className="login-box">
        <div className="login-left">
          <img src={loginImg} alt="Login Image" />
          <h1 className="login-left-heading">Institute Management System</h1>
          <p className="login-left-para">
            Manage your institute in one place...
          </p>
        </div>
        <div className="login-right">
          <form onSubmit={handleSubmit} className="form">
            <h1>Log in to your account</h1>
            <input
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              placeholder="Email"
              required
            />
            <input
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              placeholder="Password"
              required
            />
            <button type="submit">
              {isLoading && (
                <i className="fa-solid fa-spinner fa-spin-pulse fa-spin-reverse"></i>
              )}
              Submit
            </button>
            <p className="login-para2">
              Don't have an account? <Link className="link" to="/signup">Signup Here</Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
