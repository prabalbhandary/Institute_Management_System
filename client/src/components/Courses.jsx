import axios from "axios";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import "./style.css";
import { useNavigate } from "react-router-dom";
import Loader from "./Loader";

const Courses = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [courseList, setCourseList] = useState([]);
  const navigate = useNavigate()
  useEffect(() => {
    getCourses();
  }, []);
  const getCourses = () => {
    setIsLoading(true);
    axios
      .get("https://institute-management-system.onrender.com/api/v1/courses/all-courses", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      })
      .then((res) => {
        setIsLoading(false);
        setCourseList(res.data.courses);
        toast.success(res.data.message);
      })
      .catch((error) => {
        setIsLoading(false);
        toast.error(error.response.data.message);
      });
  };
  return (
    <div className="course-wrapper">
      {isLoading ? (
        <Loader />
      ) : (
        <>
          {courseList.map((course) => (
            <div onClick={() => navigate(`/dashboard/course-details/${course._id}`)} className="course-box" key={course._id}>
              <img
                className="course-thumbnail"
                src={course.imageUrl}
                alt="Course Image"
              />
              <h2 className="course-title">{course.courseName}</h2>
              <p className="course-price">
                <i className="fa-solid fa-indian-rupee-sign"></i>
                {course.price} Only
              </p>
            </div>
          ))}
        </>
      )}
    </div>
  );
};

export default Courses;
