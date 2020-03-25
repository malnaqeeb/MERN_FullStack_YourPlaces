const cloudinary = require("cloudinary").v2;
const cloud_name = process.env.CLOUD_NAME;
const api_key = process.env.CLOUDINARY_API_KEY;
const api_secret = process.env.CLOUDINARY_API_SECRET;
cloudinary.config({
  cloud_name,
  api_key,
  api_secret
});

module.exports = cloudinary;
