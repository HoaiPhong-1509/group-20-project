// Load env trước
const path = require('path');
const fs = require('fs');
const dotenv = require('dotenv');
dotenv.config({ path: path.join(__dirname, '.env') });

const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');

// Mongoose connection event handlers - these print clear messages to stdout
// so hosting providers like Railway will show obvious success/failure logs.
mongoose.connection.on('connected', () => {
  console.log(`✅ [mongoose] connected (readyState=${mongoose.connection.readyState})`);
});
mongoose.connection.on('error', (err) => {
  console.error('❌ [mongoose] connection error:', err && err.message ? err.message : err);
});
mongoose.connection.on('disconnected', () => {
  console.log('⚠️ [mongoose] disconnected');
});
// (Tuỳ chọn) Cloudinary nếu cần khởi tạo
// const cloudinary = require('./services/cloudinary');

const app = express();

// CORS
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:3000',
  credentials: true,
  methods: ['GET','POST','PUT','PATCH','DELETE','OPTIONS'],
  allowedHeaders: ['Content-Type','Authorization'],
}));

app.use(express.json());
app.use(cookieParser());

// Log request (tuỳ chọn)
app.use((req, _res, next) => {
  console.log(`${req.method} ${req.originalUrl}`);
  next();
});

// Static uploads
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });
app.use('/uploads', express.static(uploadsDir));

// Routes (chỉ giữ dạng /api/...)
app.use('/api/auth', require('./routes/auth'));
app.use('/api/profile', require('./routes/profile'));
app.use('/api/users', require('./routes/user'));

app.get('/', (_req, res) => res.json({ message: 'Server running' }));

// Start server sau khi Mongo kết nối
const PORT = process.env.PORT || 5000;
// Accept either MONGODB_URI (common) or MONGO_URI (existing in this project)
const mongoUri = process.env.MONGODB_URI || process.env.MONGO_URI;
if (!mongoUri) {
  console.error('Missing MongoDB connection string. Set MONGODB_URI or MONGO_URI.');
  process.exit(1);
}
// Connect with retry and clearer logging
async function startServer() {
  // try to extract host(s) from the connection string for logging (don't print credentials)
  const hostMatch = mongoUri.match(/@([^/?]+)/);
  const hosts = hostMatch ? hostMatch[1] : 'unknown-host';
  console.log(`Attempting to connect to MongoDB host(s): ${hosts}`);

  const maxRetries = 5;
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      await mongoose.connect(mongoUri);
      console.log('✅ MongoDB connected successfully');
      app.listen(PORT, () => console.log(`Server running on ${PORT}`));
      return;
    } catch (err) {
      const msg = err && err.message ? err.message : String(err);
      console.error(`MongoDB connection attempt ${attempt} failed: ${msg}`);

      // Provide actionable hints for common problems
      if (/authentication failed|bad auth/i.test(msg) || (err && err.codeName === 'AtlasError')) {
        console.error('❌ Authentication failed. Check your MongoDB user, password, and that the password is URL-encoded if it contains special characters.');
        console.error('Also verify the user has proper roles and that your Atlas IP Access List allows your server IP (or 0.0.0.0/0 for testing).');
        process.exit(1);
      }

      if (attempt < maxRetries) {
        const delay = attempt * 2000; // exponential-ish backoff
        console.log(`Retrying connection in ${delay / 1000}s... (${attempt + 1}/${maxRetries})`);
        await new Promise(r => setTimeout(r, delay));
      } else {
        console.error('Exceeded max retries connecting to MongoDB. Exiting.');
        process.exit(1);
      }
    }
  }
}

startServer();