// services/cloudinary.js
const cloudinary = require('cloudinary').v2;

// 🟢 DEBUG: Kiểm tra env variables
console.log('🔍 CLOUD_NAME:', process.env.CLOUD_NAME);
console.log('🔍 CLOUD_API_KEY:', process.env.CLOUD_API_KEY);
console.log('🔍 CLOUD_API_SECRET:', process.env.CLOUD_API_SECRET ? '***exists***' : 'MISSING');

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
  secure: true,
});

if (!process.env.CLOUD_NAME || !process.env.CLOUD_API_KEY || !process.env.CLOUD_API_SECRET) {
  console.warn('⚠️ Cloudinary environment variables are missing. Avatar uploads will fail.');
} else {
  console.log('✅ Cloudinary configured successfully');
}

module.exports = cloudinary;
