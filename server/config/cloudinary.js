const cloudinary = require("cloudinary").v2;
const dotenv = require("dotenv");
dotenv.config();

const connectCloud = () => {
    try {
        cloudinary.config({
            cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
            api_key: process.env.CLOUDINARY_API_KEY,
            api_secret: process.env.CLOUDINARY_API_SECRET
        })
        console.log(`Cloudinary Connected`.bgBlue.white);
    } catch (error) {
        console.log(`Error: ${error}`.bgRed.white);
    }
}

module.exports = connectCloud