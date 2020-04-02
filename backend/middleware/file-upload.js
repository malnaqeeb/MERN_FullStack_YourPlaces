const multer = require('multer');
const cloudinary = require('../uploads/cloudinary');
const cloudinaryStorage = require('multer-storage-cloudinary');

const storage = cloudinaryStorage({
  cloudinary: cloudinary,
  folder: 'images',
  allowedFormats: ['jpg', 'jpeg', 'png'],
  filename: function(req, file, cb) {
    cb(undefined, file.filename);
  },
});

const fileUpload = multer({ storage: storage });

module.exports = fileUpload;
