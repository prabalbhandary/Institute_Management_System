const Student = require("../models/studentModel");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const cloudinary = require("cloudinary").v2;
const Fee = require("../models/feeModel");
const Course = require("../models/courseModel");

const addNewStudent = (req, res) => {
  const token = req.headers.authorization.split(" ")[1];
  const verify = jwt.verify(token, process.env.JWT_SECRET_KEY);
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });
  cloudinary.uploader.upload(req.files.image.tempFilePath, (error, result) => {
    const newStudent = new Student({
      _id: new mongoose.Types.ObjectId(),
      fullName: req.body.fullName,
      phone: req.body.phone,
      email: req.body.email,
      address: req.body.address,
      courseId: req.body.courseId,
      uid: verify.uid,
      imageUrl: result.secure_url,
      imageId: result.public_id,
    });
    newStudent
      .save()
      .then((cResult) => {
        return res.status(201).json({
          success: true,
          message: "Student added successfully",
          newStudent: cResult,
        });
      })
      .catch((error) => {
        console.log(error.message);
        return res.status(400).json({
          success: false,
          message: "You can't add student",
        });
      });
  });
};

const getStudents = (req, res) => {
  const token = req.headers.authorization.split(" ")[1];
  const verify = jwt.verify(token, process.env.JWT_SECRET_KEY);
  Student.find({ uid: verify.uid })
    .then((cResult) => {
      return res.status(200).json({
        success: true,
        message: "Students fetched successfully",
        students: cResult,
      });
    })
    .catch((error) => {
      console.log(error.message);
      return res.status(400).json({
        success: false,
        message: "You can't fetch students",
      });
    });
};

const getStudentwithCourse = (req, res) => {
  const token = req.headers.authorization.split(" ")[1];
  const verify = jwt.verify(token, process.env.JWT_SECRET_KEY);
  Student.findOne({ uid: verify.uid, courseId: req.params.courseId })
    .then((cResult) => {
      return res.status(200).json({
        success: true,
        message: "Student with course fetched successfully",
        courses: cResult,
      });
    })
    .catch((error) => {
      console.log(error.message);
      return res.status(400).json({
        success: false,
        message: "You can't fetch student with course",
      });
    });
};

const getStudent = (req, res) => {
  const token = req.headers.authorization.split(" ")[1];
  const verify = jwt.verify(token, process.env.JWT_SECRET_KEY);
  Student.findById(req.params.id)
    .then((cResult) => {
      Fee.find({
        uid: verify.uid,
        courseId: cResult.courseId,
        phone: cResult.phone,
      })
        .then((feeData) => {
          Course.findById(cResult.courseId)
            .then((courseDetail) => {
              return res.status(200).json({
                success: true,
                message: "Student with fee detail fetched successfully",
                studentDetail: cResult,
                feeDetail: feeData,
                courseDetail: courseDetail,
              });
            })
            .catch((error) => {
              console.log(error.message);
              return res.status(400).json({
                success: false,
                message: "You can't fetch student",
              });
            });
        })
        .catch((error) => {
          console.log(error.message);
          return res.status(400).json({
            success: false,
            message: "You can't fetch student",
          });
        });
    })
    .catch((error) => {
      console.log(error.message);
      return res.status(400).json({
        success: false,
        message: "You can't fetch student",
      });
    });
};

const deleteStudent = (req, res) => {
  const token = req.headers.authorization.split(" ")[1];
  const verify = jwt.verify(token, process.env.JWT_SECRET_KEY);
  Student.findById(req.params.id)
    .then((cResult) => {
      if (!cResult || cResult.uid !== verify.uid) {
        return res.status(400).json({
          success: false,
          message: "You can't delete student",
        });
      }
      Fee.deleteMany({
        uid: verify.uid,
        phone: cResult.phone,
        courseId: cResult.courseId,
      })
        .then(() => {
          cloudinary.uploader.destroy(cResult.imageId, (error, result) => {
            if (error) {
              console.log(error.message);
              return res.status(400).json({
                success: false,
                message: "Failed to delete student",
              });
            }
            Student.findByIdAndDelete(req.params.id)
              .then(() => {
                return res.status(200).json({
                  success: true,
                  message: "Student and fee history deleted successfully",
                });
              })
              .catch((error) => {
                console.log(error.message);
                return res.status(400).json({
                  success: false,
                  message: "Failed to delete student",
                });
              });
          });
        })
        .catch((error) => {
          console.log(error.message);
          return res.status(400).json({
            success: false,
            message: "Failed to delete fee records",
          });
        });
    })
    .catch((error) => {
      console.log(error.message);
      return res.status(400).json({
        success: false,
        message: "You can't delete student",
      });
    });
};

const updateStudent = (req, res) => {
  const token = req.headers.authorization.split(" ")[1];
  const verify = jwt.verify(token, process.env.JWT_SECRET_KEY);
  Student.findById(req.params.id)
    .then((cResult) => {
      if (cResult.uid != verify.uid) {
        return res.status(400).json({
          success: false,
          message: "You can't update student",
        });
      }
      if (req.files) {
        cloudinary.uploader.destroy(cResult.imageId, (deletedImg) => {
          cloudinary.uploader.upload(
            req.files.image.tempFilePath,
            (error, result) => {
              const newUpdatedStudent = {
                fullName: req.body.fullName,
                phone: req.body.phone,
                email: req.body.email,
                address: req.body.address,
                courseId: req.body.courseId,
                uid: verify.uid,
                imageUrl: result.secure_url,
                imageId: result.public_id,
              };
              Student.findByIdAndUpdate(req.params.id, newUpdatedStudent, {
                new: true,
              })
                .then((data) => {
                  return res.status(200).json({
                    success: true,
                    message: "Student updated successfully",
                    updatedStudent: data,
                  });
                })
                .catch((error) => {
                  console.log(error.message);
                  return res.status(400).json({
                    success: false,
                    message: "You can't update student",
                  });
                });
            }
          );
        });
      } else {
        const updatedData = {
          fullName: req.body.fullName,
          phone: req.body.phone,
          email: req.body.email,
          address: req.body.address,
          courseId: req.body.courseId,
          uid: verify.uid,
          imageUrl: cResult.imageUrl,
          imageId: cResult.imageId,
        };
        Student.findByIdAndUpdate(req.params.id, updatedData, {
          new: true,
        }).then((data) => {
          return res.status(200).json({
            success: true,
            message: "Student updated successfully",
            updatedData: data,
          });
        });
      }
    })
    .catch((error) => {
      console.log(error.message);
      return res.status(400).json({
        success: false,
        message: "You can't update student",
      });
    });
};

const latestStudents = (req, res) => {
  const token = req.headers.authorization.split(" ")[1];
  const verify = jwt.verify(token, process.env.JWT_SECRET_KEY);
  Student.find({ uid: verify.uid })
    .sort({ createdAt: -1 })
    .limit(5)
    .then((cResult) => {
      return res.status(200).json({
        success: true,
        message: "Latest five students fetched successfully",
        latestStudents: cResult,
      });
    })
    .catch((error) => {
      console.log(error.message);
      return res.status(400).json({
        success: false,
        message: "You can't fetch latest students",
      });
    });
};

module.exports = {
  addNewStudent,
  getStudents,
  getStudentwithCourse,
  getStudent,
  deleteStudent,
  updateStudent,
  latestStudents,
};
