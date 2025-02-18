const Course = require("../models/courseModel");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const cloudinary = require("cloudinary").v2;
const Student = require("../models/studentModel");

const addCourse = (req, res) => {
  const token = req.headers.authorization.split(" ")[1];
  const verify = jwt.verify(token, process.env.JWT_SECRET_KEY);
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });
  cloudinary.uploader.upload(req.files.image.tempFilePath, (error, result) => {
    const newCourse = new Course({
      _id: new mongoose.Types.ObjectId(),
      courseName: req.body.courseName,
      price: req.body.price,
      description: req.body.description,
      startingDate: req.body.startingDate,
      endDate: req.body.endDate,
      uid: verify.uid,
      imageUrl: result.secure_url,
      imageId: result.public_id,
    });
    newCourse
      .save()
      .then((cResult) => {
        return res.status(201).json({
          success: true,
          message: "Course added successfully",
          _id: cResult._id,
          courseName: cResult.courseName,
          price: cResult.price,
          description: cResult.description,
          startingDate: cResult.startingDate,
          endDate: cResult.endDate,
          uid: cResult.uid,
          imageUrl: cResult.imageUrl,
          imageId: cResult.imageId,
        });
      })
      .catch((error) => {
        console.log(error.message);
        return res.status(400).json({
          success: false,
          message: "You can't add course",
        });
      });
  });
};

const getCourses = (req, res) => {
  const token = req.headers.authorization.split(" ")[1];
  const verify = jwt.verify(token, process.env.JWT_SECRET_KEY);
  Course.find({ uid: verify.uid })
    .then((cResult) => {
      return res.status(200).json({
        success: true,
        message: "Courses fetched successfully",
        courses: cResult,
      });
    })
    .catch((error) => {
      console.log(error.message);
      return res.status(400).json({
        success: false,
        message: "You can't fetch courses",
      });
    });
};

const getCourse = (req, res) => {
  Course.findById({ _id: req.params.id })
    .then((cResult) => {
      Student.find({ courseId: req.params.id }).then((students) => {
        return res.status(200).json({
          success: true,
          message: "Course with students fetched successfully",
          course: cResult,
          student: students,
        });
      });
    })
    .catch((error) => {
      console.log(error.message);
      return res.status(400).json({
        success: false,
        message: "You can't fetch courses",
      });
    });
};

const deleteCourse = (req, res) => {
  const token = req.headers.authorization.split(" ")[1];
  const verify = jwt.verify(token, process.env.JWT_SECRET_KEY);
  Course.findById(req.params.id).then((cResult) => {
    if (cResult.uid == verify.uid) {
      Course.findByIdAndDelete(req.params.id)
        .then((cResult) => {
          cloudinary.uploader.destroy(cResult.imageId, (deletedImg) => {
            Student.deleteMany({courseId: req.params.id})
            .then((data) => {
              return res.status(200).json({
                success: true,
                message: "Course deleted successfully",
              });
            })
            .catch((error) => {
              console.log(error.message);
              return res.status(400).json({
                success: false,
                message: "You can't delete course",
              });
            });
          });
        })
        .catch((error) => {
          console.log(error.message);
          return res.status(400).json({
            success: false,
            message: "You can't delete course",
          });
        });
    } else {
      return res.status(400).json({
        success: false,
        message: "You can't delete course",
      });
    }
  });
};

const updateCourse = (req, res) => {
  const token = req.headers.authorization.split(" ")[1];
  const verify = jwt.verify(token, process.env.JWT_SECRET_KEY);
  Course.findById(req.params.id)
    .then((cResult) => {
      if (cResult.uid != verify.uid) {
        return res.status(400).json({
          success: false,
          message: "You can't update course",
        });
      }
      if (req.files) {
        cloudinary.uploader.destroy(cResult.imageId, (deletedImg) => {
          cloudinary.uploader.upload(
            req.files.image.tempFilePath,
            (error, result) => {
              const newUpdatedCourse = {
                courseName: req.body.courseName,
                price: req.body.price,
                description: req.body.description,
                startingDate: req.body.startingDate,
                endDate: req.body.endDate,
                uid: verify.uid,
                imageUrl: result.secure_url,
                imageId: result.public_id,
              };
              Course.findByIdAndUpdate(req.params.id, newUpdatedCourse, {
                new: true,
              })
                .then((data) => {
                  return res.status(200).json({
                    success: true,
                    message: "Course updated successfully",
                    updatedCourse: data,
                  });
                })
                .catch((error) => {
                  console.log(error.message);
                  return res.status(400).json({
                    success: false,
                    message: "You can't update course",
                  });
                });
            }
          );
        });
      } else {
        const updatedData = {
          courseName: req.body.courseName,
          price: req.body.price,
          description: req.body.description,
          startingDate: req.body.startingDate,
          endDate: req.body.endDate,
          uid: verify.uid,
          imageUrl: cResult.imageUrl,
          imageId: cResult.imageId,
        };
        Course.findByIdAndUpdate(req.params.id, updatedData, {
          new: true,
        }).then((data) => {
          return res.status(200).json({
            success: true,
            message: "Course updated successfully",
            updatedData: data,
          });
        });
      }
    })
    .catch((error) => {
      console.log(error.message);
      return res.status(400).json({
        success: false,
        message: "You can't update course",
      });
    });
};

const latestCourses = (req, res) => {
  const token = req.headers.authorization.split(" ")[1];
  const verify = jwt.verify(token, process.env.JWT_SECRET_KEY);
  Course.find({ uid: verify.uid })
    .sort({ createdAt: -1 })
    .limit(5)
    .then((cResult) => {
      return res.status(200).json({
        success: true,
        message: "Latest five courses fetched successfully",
        latestCourses: cResult,
      });
    })
    .catch((error) => {
      console.log(error.message);
      return res.status(400).json({
        success: false,
        message: "You can't fetch latest courses",
      });
    });
};

module.exports = {
  addCourse,
  getCourses,
  getCourse,
  deleteCourse,
  updateCourse,
  latestCourses,
};
