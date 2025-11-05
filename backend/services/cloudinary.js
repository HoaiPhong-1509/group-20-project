const cloudinary = require('cloudinary').v2;

const { CLOUDINARY_URL, CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET } = process.env;

if (CLOUDINARY_URL) {
  cloudinary.config({ secure: true });
} else if (CLOUDINARY_CLOUD_NAME && CLOUDINARY_API_KEY && CLOUDINARY_API_SECRET) {
  cloudinary.config({
    cloud_name: CLOUDINARY_CLOUD_NAME,
    api_key: CLOUDINARY_API_KEY,
    api_secret: CLOUDINARY_API_SECRET,
    secure: true
  });
} else {
  console.warn('Cloudinary not configured. Avatar uploads will fail.');
}

module.exports = cloudinary;