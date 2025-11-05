const multer = require('multer');

const MAX_FILE_SIZE = Number(process.env.AVATAR_MAX_FILE_SIZE_BYTES || 2 * 1024 * 1024);
const ALLOWED_MIME_TYPES = (process.env.AVATAR_ALLOWED_MIME_TYPES || 'image/jpeg,image/png,image/webp').split(',');

const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  if (ALLOWED_MIME_TYPES.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new multer.MulterError('LIMIT_UNEXPECTED_FILE', 'avatar'));
  }
};

const upload = multer({
  storage,
  limits: { fileSize: MAX_FILE_SIZE, files: 1 },
  fileFilter
});

module.exports = upload;