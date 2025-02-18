import express from "express";
import morgan from "morgan";
import bodyParser from "body-parser";
import fileUpload from "express-fileupload";
import cors from "cors";

import userRoutes from "./routes/userRoutes.js";
import courseRoutes from "./routes/courseRoutes.js";
import studentRoutes from "./routes/studentRoutes.js";
import feeRoutes from "./routes/feeRoutes.js";
import homeRoutes from "./routes/homeRoutes.js";

const app = express();

app.use(cors());
app.use(morgan("dev"));
app.use(bodyParser.json());
app.use(fileUpload({ useTempFiles: true }));

app.use("/api/v1/users", userRoutes);
app.use("/api/v1/courses", courseRoutes);
app.use("/api/v1/students", studentRoutes);
app.use("/api/v1/fees", feeRoutes);
app.use("/api/v1/home", homeRoutes);

app.use("*", (req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

export default app;
