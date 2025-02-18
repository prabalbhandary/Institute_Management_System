import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useLocation, useNavigate } from "react-router-dom";
import "./style.css";

const AddStudent = () => {
  const location = useLocation();
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [courseId, setCourseId] = useState("");
  const [image, setImage] = useState(null);
  const [imageUrl, setImageUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const [courseList, setCourseList] = useState([]);
  useEffect(() => {
    getCourses();
    if (location.state) {
      setFullName(location.state.student.fullName);
      setPhone(location.state.student.phone);
      setEmail(location.state.student.email);
      setAddress(location.state.student.address);
      setCourseId(location.state.student.courseId);
      setImageUrl(location.state.student.imageUrl);
    } else {
      setFullName("");
      setPhone("");
      setEmail("");
      setAddress("");
      setCourseId("");
      setImageUrl("");
    }
  }, [location]);
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

  const handleFile = (e) => {
    setImage(e.target.files[0]);
    setImageUrl(URL.createObjectURL(e.target.files[0]));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);
    const formData = new FormData();
    formData.append("fullName", fullName);
    formData.append("phone", phone);
    formData.append("email", email);
    formData.append("address", address);
    formData.append("courseId", courseId);
    if (image) {
      formData.append("image", image);
    }
    if (location.state) {
      axios
        .put(
          `https://institute-management-system.onrender.com/api/v1/students/update-student/${location.state.student._id}`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        )
        .then((res) => {
          setIsLoading(false);
          toast.success(res.data.message);
          navigate(`/dashboard/student-details/${location.state.student._id}`);
        })
        .catch((error) => {
          setIsLoading(false);
          toast.error(error.response.data.message);
        });
    } else {
      axios
        .post("https://institute-management-system.onrender.com/api/v1/students/add-student", formData, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        })
        .then((res) => {
          setIsLoading(false);
          toast.success(res.data.message);
          navigate(`/dashboard/course-details/${courseId}`);
        })
        .catch((error) => {
          setIsLoading(false);
          toast.error(error.response.data.message);
        });
    }
  };
  return (
    <div>
      <form onSubmit={handleSubmit} className="form">
        <h1>{location.state ? "Edit Student Details" : "Add New Student"}</h1>
        <input
          value={fullName}
          type="text"
          placeholder="Student Name"
          onChange={(e) => setFullName(e.target.value)}
          required
        />
        <input
          value={phone}
          type="text"
          placeholder="Phone Number"
          onChange={(e) => setPhone(e.target.value)}
          required
        />
        <input
          value={email}
          type="email"
          placeholder="Email"
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          value={address}
          type="text"
          placeholder="Full Address"
          onChange={(e) => setAddress(e.target.value)}
          required
        />
        <select
          disabled={location.state}
          value={courseId}
          onChange={(e) => setCourseId(e.target.value)}
        >
          <option value="">Select Course</option>
          {courseList.map((course) => (
            <option value={course._id} key={course._id}>
              {course.courseName}
            </option>
          ))}
        </select>
        <input type="file" onChange={handleFile} required={!location.state} />
        {imageUrl && <img src={imageUrl} className="your-logo" alt="preview" />}
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

export default AddStudent;
