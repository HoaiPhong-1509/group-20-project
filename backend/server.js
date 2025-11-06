const express = require('express');
const dotenv = require('dotenv');
const path = require('path');

// 🔴 QUAN TRỌNG: Load .env TRƯỚC KHI import bất cứ module nào khác
dotenv.config({ path: path.join(__dirname, '.env') });

const mongoose = require('mongoose');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const profileRoutes = require('./routes/profile');

// ✅ Import Cloudinary sau khi dotenv đã load
const cloudinary = require('./services/cloudinary');

const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(cors({ origin: 'http://localhost:3000' }));

// Log request
app.use((req, _res, next) => { console.log('> ' + req.method, req.originalUrl); next(); });

// Routes
app.use('/api/profile', profileRoutes);
console.log('📦 Profile routes mounted at /api/profile');

const MONGO_URI = process.env.MONGO_URI;
if (!MONGO_URI) {
  console.error('❌ Missing MONGO_URI in backend/.env');
  process.exit(1);
}

mongoose
  .connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('✅ MongoDB connected successfully'))
  .catch((err) => console.error('❌ MongoDB connection error:', err));

const userRoutes = require('./routes/user');
const authRoutes = require('./routes/auth');
app.use('/users', userRoutes);
app.use('/auth', authRoutes);

app.get('/', (_req, res) => res.json({ message: 'Server running' }));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
