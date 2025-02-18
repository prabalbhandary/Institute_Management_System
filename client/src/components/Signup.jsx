import React, { useState } from "react";
import "./style.css";
import signupImg from "../assets/book.png";
import axios from "axios";
import { toast } from "react-toastify";
import { Link, useNavigate } from "react-router-dom";

const Signup = () => {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [image, setImage] = useState(null);
  const [imgUrl, setImageUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);
    const formData = new FormData();
    formData.append("fullName", fullName);
    formData.append("email", email);
    formData.append("password", password);
    formData.append("phone", phone);
    formData.append("image", image);
    axios
      .post("https://institute-management-system.onrender.com/api/v1/users/signup", formData)
      .then((res) => {
        setIsLoading(false);
        toast.success(res.data.message);
        navigate("/login");
      })
      .catch((error) => {
        setIsLoading(false);
        toast.error(error.response.data.message);
      });
  };

  const handleFile = (e) => {
    setImage(e.target.files[0]);
    setImageUrl(URL.createObjectURL(e.target.files[0]));
  };

  return (
    <div className="signup-wrapper">
      <div className="signup-box">
        <div className="signup-left">
          <img src={signupImg} alt="Signup Image" />
          <h1 className="signup-left-heading">Institute Management System</h1>
          <p className="signup-left-para">
            Manage your institute in one place...
          </p>
        </div>
        <div className="signup-right">
          <form onSubmit={handleSubmit} className="form">
            <h1>Create an account</h1>
            <input
              onChange={(e) => setFullName(e.target.value)}
              type="text"
              placeholder="Institute Full Name"
              required
            />
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
            <input
              onChange={(e) => setPhone(e.target.value)}
              type="text"
              placeholder="Phone"
              required
            />
            <input onChange={handleFile} type="file" required />
            {imgUrl && <img className="your-logo" src={imgUrl} alt="Image" />}
            <button type="submit">
              {isLoading && (
                <i className="fa-solid fa-spinner fa-spin-pulse fa-spin-reverse"></i>
              )}
              Submit
            </button>
            <p className="signup-para2">
              Already have an account? <Link className="link" to="/login">Login Here</Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Signup;
