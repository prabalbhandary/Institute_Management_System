import React, { useEffect, useState } from "react";
import "./style.css";
import axios from "axios";
import { toast } from "react-toastify";
import Loader from "./Loader";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [totalCourse, setTotalCourse] = useState(0);
  const [totalStudent, setTotalStudent] = useState(0);
  const [totalAmount, setTotalAmount] = useState(0);
  const [students, setStudents] = useState([]);
  const [fees, setFees] = useState([]);
  const navigate = useNavigate();
  useEffect(() => {
    getHomeDetails();
  }, []);
  const getHomeDetails = () => {
    axios
      .get("https://institute-management-system.onrender.com/api/v1/home/all-data", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      })
      .then((res) => {
        setIsLoading(false);
        setTotalCourse(res.data.totalCourse);
        setTotalStudent(res.data.totalStudent);
        setTotalAmount(res.data.totalAmount);
        setStudents(res.data.students);
        setFees(res.data.fees);
        toast.success(res.data.message);
      })
      .catch((error) => {
        setIsLoading(false);
        toast.error(error.response.data.message);
      });
  };
  return isLoading ? (
    <Loader />
  ) : (
    <div className="home-wrapper">
      <div className="count-box-wrapper">
        <div className="box box1">
          <h2>00{totalCourse}</h2>
          <p>Total Courses</p>
        </div>
        <div className="box box2">
          <h2>00{totalStudent}</h2>
          <p>Total Students</p>
        </div>
        <div className="box box3">
          <h2>
            <i className="fa-solid fa-indian-rupee-sign"></i> {totalAmount}
          </h2>
          <p>Total Transaction</p>
        </div>
      </div>
      <div className="list-container">
        <div className="table-container">
          {students && students.length > 0 ? (
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
                {students &&
                  students.length > 0 &&
                  students.map((student) => (
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
          ) : (
            <Loader />
          )}
        </div>
        <div className="table-container">
          {fees && fees.length > 0 ? (
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
                {fees &&
                  fees.length > 0 &&
                  fees.map((payment) => (
                    <tr key={payment._id}>
                      <td>{payment.fullName}</td>
                      <td>{payment.createdAt}</td>
                      <td>{payment.amount}</td>
                      <td>{payment.remark}</td>
                    </tr>
                  ))}
              </tbody>
            </table>
          ) : (
            <Loader />
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;
