import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Loader from "./Loader";

const Students = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [studentList, setStudentList] = useState([]);
  useEffect(() => {
    getStudentList();
  }, []);
  const getStudentList = () => {
    setIsLoading(true);
    axios
      .get(`https://institute-management-system.onrender.com/api/v1/students/all-students`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      })
      .then((res) => {
        setIsLoading(false);
        setStudentList(res.data.students);
        toast.success(res.data.message);
      })
      .catch((error) => {
        setIsLoading(false);
        toast.error(error.response.data.message);
      });
  };
  return (
    <div>
      {isLoading ? (
        <Loader />
      ) : (
        <div>
          {studentList && studentList.length > 0 ? (
            <div className="students-container">
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
          ) : (
            <p>No students to show</p>
          )}
        </div>
      )}
    </div>
  );
};

export default Students;
