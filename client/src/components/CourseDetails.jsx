import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import Loader from "./Loader";

const CourseDetails = () => {
  const { id } = useParams();
  const [isLoading, setIsLoading] = useState(false);
  const [course, setCourse] = useState(null);
  const [studentList, setStudentList] = useState([]);
  const navigate = useNavigate();
  useEffect(() => {
    getCourseDetail();
  }, []);
  const getCourseDetail = () => {
    setIsLoading(true);
    axios
      .get(`http://localhost:4000/api/v1/courses/course-details/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      })
      .then((res) => {
        setIsLoading(false);
        setCourse(res.data.course);
        setStudentList(res.data.student);
        toast.success(res.data.message);
      })
      .catch((error) => {
        setIsLoading(false);
        toast.error(error.response.data.message);
      });
  };
  const deleteCourse = (courseId) => {
    if (window.confirm("Are you sure you want to delete the course?")) {
      setIsLoading(true);
      axios
        .delete(
          `http://localhost:4000/api/v1/courses/delete-course/${courseId}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        )
        .then((res) => {
          setIsLoading(false);
          toast.success(res.data.message);
          navigate("/dashboard/courses")
        })
        .catch((error) => {
          setIsLoading(false);
          toast.error(error.response.data.message);
        });
    }
  };
  return (
    <div className="course-detail-main-wrapper">
      {isLoading ? (
        <Loader />
      ) : (
        <div>
          {course && (
            <div className="course-detail-wrapper">
              <img
                className="course-detail-thumbnail"
                src={course.imageUrl}
                alt="Course Image"
              />
              <div className="course-detail-text">
                <h1>{course.courseName}</h1>
                <p>
                  Price: <i className="fa-solid fa-indian-rupee-sign"></i>
                  {course.price}
                </p>
                <p>Starting Date: {course.startingDate}</p>
                <p>Ending Date: {course.endDate}</p>
              </div>
              <div className="course-description-box">
                <div className="btn-container">
                  <button
                    onClick={() => {
                      navigate(`/dashboard/update-course/${course._id}`, {
                        state: { course },
                      });
                    }}
                    className="primary-btn"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => {
                      deleteCourse(course._id);
                    }}
                    className="secondary-btn"
                  >
                    Delete
                  </button>
                </div>
                <h3>Course Description</h3>
                <div className="course-description-container">
                  <p>{course.description}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
      {studentList && studentList.length > 0 && (
        <div className="studentlist-container">
          <table>
            <thead>
              <tr>
                <th>Profile Picture</th>
                <th>Full Name</th>
                <th>Phone Number</th>
                <th>Email</th>
              </tr>
            </thead>
            <tbody>
              {studentList.map((student) => (
                <tr
                  onClick={() => {
                    navigate(`/dashboard/student-details/${student._id}`);
                  }}
                  key={student._id}
                  className="student-row"
                >
                  <td>
                    <img
                      className="student-profile-pic"
                      src={student.imageUrl}
                      alt="Student Image"
                    />
                  </td>
                  <td>
                    <p>{student.fullName}</p>
                  </td>
                  <td>
                    <p>{student.phone}</p>
                  </td>
                  <td>
                    <p>{student.email}</p>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default CourseDetails;
