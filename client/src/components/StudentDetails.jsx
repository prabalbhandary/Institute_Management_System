import React, { useEffect, useState } from "react";
import "./style.css";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate, useParams } from "react-router-dom";
import Loader from "./Loader";

const StudentDetails = () => {
  const { id } = useParams();
  const [isLoading, setIsLoading] = useState(false);
  const [student, setStudent] = useState({});
  const [paymentList, setPaymentList] = useState([]);
  const [course, setCourse] = useState({});
  const navigate = useNavigate();
  useEffect(() => {
    getStudentDetail();
  }, []);
  const getStudentDetail = () => {
    setIsLoading(true);
    axios
      .get(`https://institute-management-system.onrender.com/api/v1/students/student-detail/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      })
      .then((res) => {
        setIsLoading(false);
        setStudent(res.data.studentDetail);
        setPaymentList(res.data.feeDetail);
        setCourse(res.data.courseDetail);
        toast.success(res.data.message);
      })
      .catch((error) => {
        setIsLoading(false);
        toast.error(error.response.data.message);
      });
  };
  const deleteStudent = (studentId) => {
    if (window.confirm("Are you sure you want to delete the student?")) {
      setIsLoading(true);
      axios
        .delete(
          `https://institute-management-system.onrender.com/api/v1/students/delete-student/${studentId}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        )
        .then((res) => {
          setIsLoading(false);
          toast.success(res.data.message);
          navigate(`/dashboard/course-details/${course._id}`);
        })
        .catch((error) => {
          setIsLoading(false);
          toast.error(error.response.data.message);
        });
    }
  };
  return (
    <div className="student-detail-main-wraper">
      {isLoading ? (
        <Loader />
      ) : (
        <>
          <div className="student-detail-warpper">
            <div className="student-detail-header">
              <h2>Student Full Details</h2>
              <div className="sd-btn-container">
                <button
                  onClick={() => {
                    navigate(`/dashboard/update-student/${student._id}`, {
                      state: { student },
                    });
                  }}
                  className="primary-btn"
                >
                  Edit
                </button>
                <button
                  onClick={() => {
                    deleteStudent(student._id);
                  }}
                  className="secondary-btn"
                >
                  Delete
                </button>
              </div>
            </div>
            <div className="sd-detail">
              <img src={student.imageUrl} alt="Student Image" />
              <div>
                <h2>{student.fullName}</h2>
                <p>Phone: {student.phone}</p>
                <p>Email: {student.email}</p>
                <p>Address: {student.address}</p>
                <h4>Course Name: {course.courseName}</h4>
              </div>
            </div>
          </div>
          <br />
          <h2 className="payment-history-title">Payment History</h2>
          <div className="fee-detail-warpper">
            <table>
              <thead>
                <tr>
                  <th>Full Name</th>
                  <th>Date & Time</th>
                  <th>Amount</th>
                  <th>Remark</th>
                </tr>
              </thead>
              <tbody>
                {paymentList &&
                  paymentList.length > 0 &&
                  paymentList.map((payment) => (
                    <tr key={payment._id}>
                      <td>{payment.fullName}</td>
                      <td>{payment.createdAt}</td>
                      <td>{payment.amount}</td>
                      <td>{payment.remark}</td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
};

export default StudentDetails;
