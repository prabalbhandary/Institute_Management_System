const http = require("http");
require("colors");
const dotenv = require("dotenv");
dotenv.config();

const connectCloud = require("./config/cloudinary");
const connectDB = require("./database/db");

const port = process.env.PORT || 3000;

const app = require("./app");

const server = http.createServer(app);

server.listen(port, () => {
    connectDB();
    console.log(`Server running on http://localhost:${port}`.bgMagenta.white);
    connectCloud();
});