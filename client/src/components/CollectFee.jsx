import React, { useEffect, useState } from "react";
import "./style.css";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const CollectFee = () => {
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [amount, setAmount] = useState(0);
  const [remark, setRemark] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [courseId, setCourseId] = useState("");
  const [courseList, setCourseList] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    getCourses();
  }, []);

  const getCourses = () => {
    setIsLoading(true);
    axios
      .get("http://localhost:4000/api/v1/courses/all-courses", {
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

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);
    axios
      .post("http://localhost:4000/api/v1/fees/add-fees", {
        fullName: fullName,
        phone: phone,
        amount: amount,
        remark: remark,
        courseId: courseId,
      }, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      })
      .then((res) => {
        setIsLoading(false);
        toast.success(res.data.message);
        navigate("/dashboard/payment-history");
      })
      .catch((error) => {
        setIsLoading(false);
        toast.error(error.response.data.message);
      });
  }
  
  return (
    <div>
      <form onSubmit={handleSubmit} className="form">
        <h1>Collect Fee</h1>
        <input onChange={(e) => setFullName(e.target.value)} type="text" placeholder="Full Name" required />
        <input onChange={(e) => setPhone(e.target.value)} type="text" placeholder="Phone" required />
        <input onChange={(e) => setAmount(e.target.value)} type="number" placeholder="Amount" required />
        <input onChange={(e) => setRemark(e.target.value)} type="text" placeholder="Remark" required />
        <select onChange={(e) => setCourseId(e.target.value)} required>
          <option value="">Select Course</option>
          {courseList.map((course) => (
            <option key={course._id} value={course._id}>
              {course.courseName}
            </option>
          ))}
        </select>
        <button type="submit">
          {isLoading && (
            <i className="fa-solid fa-spinner fa-spin-pulse fa-spin-reverse"></i>
          )}
          Submit
        </button>
      </form>
    </div>
  );
};

export default CollectFee;
