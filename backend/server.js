<<<<<<< HEAD
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
=======
require('dotenv').config();
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const express = require('express');
const mongoose = require('mongoose');
>>>>>>> 9459f33e (finish hd 4)

const app = express();

app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:3000',
  methods: ['GET','POST','PUT','PATCH','DELETE','OPTIONS'],
  allowedHeaders: ['Content-Type','Authorization'],
}));
app.use(express.json());
<<<<<<< HEAD
app.use(cookieParser());
app.use(cors({ origin: 'http://localhost:3000' }));

// Log request
app.use((req, _res, next) => { console.log('> ' + req.method, req.originalUrl); next(); });

// Routes
app.use('/api/profile', profileRoutes);
console.log('📦 Profile routes mounted at /api/profile');
=======
>>>>>>> 9459f33e (finish hd 4)

// static uploads
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}
app.use('/uploads', express.static(uploadsDir));

// mount routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/profile', require('./routes/profile'));
app.use('/api/users', require('./routes/user'));

<<<<<<< HEAD
const userRoutes = require('./routes/user');
const authRoutes = require('./routes/auth');
app.use('/users', userRoutes);
app.use('/auth', authRoutes);

app.get('/', (_req, res) => res.json({ message: 'Server running' }));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
=======
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    app.listen(process.env.PORT || 5000, () =>
      console.log('Server running on', process.env.PORT || 5000));
  })
  .catch(err => console.error('Mongo error', err));
>>>>>>> 9459f33e (finish hd 4)
