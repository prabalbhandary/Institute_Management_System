const express = require("express");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const fileUpload = require("express-fileupload");
const cors = require("cors");

const userRoutes = require("./routes/userRoutes");
const courseRoutes = require("./routes/courseRoutes");
const studentRoutes = require("./routes/studentRoutes");
const feeRoutes = require("./routes/feeRoutes");
const homeRoutes = require("./routes/homeRoutes");

const app = express();

app.use(cors());
app.use(morgan("dev"));
app.use(bodyParser.json());
app.use(fileUpload({ useTempFiles: true }));

app.use("/api/v1/users", userRoutes);
app.use("/api/v1/courses", courseRoutes);
app.use("/api/v1/students", studentRoutes);
app.use("/api/v1/fees", feeRoutes);
app.use("/api/v1/home", homeRoutes)

app.use("*", (req, res) => {
    res.status(404).json({
        success: false,
        message: "Route not found"
    });
});

module.exports = app;
