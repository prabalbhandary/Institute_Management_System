import http from "http";
import "colors";
import dotenv from "dotenv";
dotenv.config();
import connectCloud from "./config/cloudinary.js";
import connectDB from "./database/db.js";

import app from "./app.js";

const port = process.env.PORT || 3000;
const mode = process.env.NODE_ENV || "production";

const server = http.createServer(app);

server.listen(port, () => {
  connectDB();
  console.log(
    `Server running on ${mode} mode at http://localhost:${port}`.bgMagenta.white
  );
  connectCloud();
});
