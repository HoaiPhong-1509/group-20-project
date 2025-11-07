const multer = require('multer');
<<<<<<< HEAD

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
=======
const path = require('path');
const fs = require('fs');

const uploadDir = path.join(__dirname, '..', 'uploads');
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, uploadDir),
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname || '');
    cb(null, `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`);
  },
});

module.exports = multer({ storage });
>>>>>>> 9459f33e (finish hd 4)
