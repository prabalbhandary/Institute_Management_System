const cloudinary = require("cloudinary").v2;
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const User = require("../models/userModel");

const register = (req, res) => {
  User.find({ email: req.body.email }).then((users) => {
    if (users.length > 0) {
      return res
        .status(400)
        .json({ success: false, message: "User already exists" });
    }
    cloudinary.uploader.upload(
      req.files.image.tempFilePath,
      (error, result) => {
        bcrypt.hash(req.body.password, 10, (error, hash) => {
          if (error) {
            return res.status(400).json({
              success: false,
              message: "You can't hash your password",
            });
          }
          const newUser = new User({
            _id: new mongoose.Types.ObjectId(),
            fullName: req.body.fullName,
            email: req.body.email,
            phone: req.body.phone,
            password: hash,
            imageUrl: result.secure_url,
            imageId: result.public_id,
          });
          newUser
            .save()
            .then((uResult) => {
              return res.status(201).json({
                success: true,
                message: "User Registered Successfully",
                newUser: uResult,
              });
            })
            .catch((error) => {
              console.log(error.message);
              return res
                .status(500)
                .json({ success: false, message: "Internal Server Error" });
            });
        });
      }
    );
  });
};

const login = (req, res) => {
  User.find({ email: req.body.email }).then((users) => {
    if (users.length == 0) {
      return res.status(404).json({ sucess: false, message: "User not found" });
    }
    bcrypt.compare(req.body.password, users[0].password, (error, result) => {
      if (!result) {
        return res
          .status(400)
          .json({ sucess: false, message: "Invalid Credentials" });
      }
      const token = jwt.sign(
        {
          uid: users[0]._id,
          fullName: users[0].fullName,
          email: users[0].email,
          phone: users[0].phone,
        },
        process.env.JWT_SECRET_KEY,
        { expiresIn: "365d" }
      );
      return res.status(200).json({
        success: true,
        message: "User logged in successfully",
        _id: users[0]._id,
        fullName: users[0].fullName,
        email: users[0].email,
        phone: users[0].phone,
        imageUrl: users[0].imageUrl,
        imageId: users[0].imageId,
        token: token,
      });
    });
  });
};

module.exports = {
  register,
  login,
};
