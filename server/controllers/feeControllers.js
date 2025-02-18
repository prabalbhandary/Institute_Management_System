const Fee = require("../models/feeModel");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const addFee = (req, res) => {
  const token = req.headers.authorization.split(" ")[1];
  const verify = jwt.verify(token, process.env.JWT_SECRET_KEY);
  const newFee = new Fee({
    _id: new mongoose.Types.ObjectId(),
    fullName: req.body.fullName,
    phone: req.body.phone,
    courseId: req.body.courseId,
    uid: verify.uid,
    amount: req.body.amount,
    remark: req.body.remark,
  });
  newFee
    .save()
    .then((cResult) => {
      return res.status(201).json({
        success: true,
        message: "Fee added successfully",
        newFee: cResult,
      });
    })
    .catch((error) => {
      console.log(error.message);
      return res.status(400).json({
        success: false,
        message: "Fee not added",
      });
    });
};

const feeHistory = (req, res) => {
  const token = req.headers.authorization.split(" ")[1];
  const verify = jwt.verify(token, process.env.JWT_SECRET_KEY);
  Fee.find({ uid: verify.uid })
    .then((cResult) => {
      return res.status(200).json({
        success: true,
        message: "Fee history fetched successfully",
        paymentHistory: cResult,
      });
    })
    .catch((error) => {
      console.log(error.message);
      return res.status(400).json({
        success: false,
        message: "Fee history not fetched",
      });
    });
};

const studentFeeHistory = (req, res) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const verify = jwt.verify(token, process.env.JWT_SECRET_KEY);

    Fee.find({
      uid: verify.uid,
      courseId: req.query.courseId,
      phone: req.query.phone,
    })
      .then((cResult) => {
        return res.status(200).json({
          success: true,
          message: "Student fee history fetched successfully",
          fees: cResult,
        });
      })
      .catch((error) => {
        console.error(error.message);
        return res.status(400).json({
          success: false,
          message: "Student fee history not fetched",
        });
      });
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

module.exports = {
  addFee,
  feeHistory,
  studentFeeHistory,
};
