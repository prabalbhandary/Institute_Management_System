import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useLocation, useNavigate } from "react-router-dom";
import "./style.css";

const AddCourse = () => {
  const [courseName, setCourseName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState(0);
  const [startingDate, setStartingDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [image, setImage] = useState(null);
  const [imageUrl, setImageUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (location.state) {
      setCourseName(location.state.course.courseName);
      setDescription(location.state.course.description);
      setPrice(location.state.course.price);
      setStartingDate(location.state.course.startingDate);
      setEndDate(location.state.course.endDate);
      setImageUrl(location.state.course.imageUrl);
    }else{
      setCourseName("");
      setDescription("");
      setPrice(0);
      setStartingDate("");
      setEndDate("");
      setImageUrl("");
    }
  }, [location]);

  const handleFile = (e) => {
    setImage(e.target.files[0]);
    setImageUrl(URL.createObjectURL(e.target.files[0]));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);
    const formData = new FormData();
    formData.append("courseName", courseName);
    formData.append("description", description);
    formData.append("price", price);
    formData.append("startingDate", startingDate);
    formData.append("endDate", endDate);
    if (image) {
      formData.append("image", image);
    }
    if (location.state) {
      axios
        .put(
          `http://localhost:4000/api/v1/courses/update-course/${location.state.course._id}`,
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
          navigate(
            `/dashboard/course-detail/${location.state.course._id}`
          );
        })
        .catch((error) => {
          setIsLoading(false);
          toast.error(error.response.data.message);
        });
    } else {
      axios
        .post("http://localhost:4000/api/v1/courses/add-course", formData, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        })
        .then((res) => {
          setIsLoading(false);
          toast.success(res.data.message);
          navigate("/dashboard/courses");
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
        <h1>{location.state ? "Edit Course" : "Add New Course"}</h1>
        <input
          value={courseName}
          onChange={(e) => setCourseName(e.target.value)}
          type="text"
          placeholder="Course Name"
          required
        />
        <input
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          type="text"
          placeholder="Course Description"
          required
        />
        <input
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          type="number"
          placeholder="Price"
          required
        />
        <input
          value={startingDate}
          onChange={(e) => setStartingDate(e.target.value)}
          type="date"
          required
        />
        <input
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          type="date"
          required
        />
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

export default AddCourse;
