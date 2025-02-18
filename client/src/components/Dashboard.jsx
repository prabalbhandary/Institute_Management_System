import React from "react";
import "./style.css";
import Sidebar from "./Sidebar";
import { Outlet, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const Dashboard = () => {
  const navigate = useNavigate();
  const handleLogout = () => {
    toast.success("User Logout Successfully");
    localStorage.clear();
    navigate("/login");
  };
  return (
    <div className="dashboard-main-container">
      <div className="dashboard-container">
        <Sidebar />
        <div className="main-container">
          <div className="top-bar">
            <div className="logo-container">
              <img
                className="profile-logo"
                src={localStorage.getItem("imageUrl")}
                alt="Dashboard Image"
              />
            </div>
            <div className="profile-container">
              <h2 className="profile-name">
                {localStorage.getItem("fullName")}
              </h2>
              <button onClick={handleLogout} className="logout-btn">
                Logout
              </button>
            </div>
          </div>
          <div className="outlet-area">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
