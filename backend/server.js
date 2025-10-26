// server.js (đã chỉnh chính xác)
const express = require('express');
const dotenv = require('dotenv');
const mongoose = require('mongoose');

dotenv.config();

const app = express();
app.use(express.json());

// ✅ Kết nối MongoDB Atlas
mongoose.connect("mongodb+srv://sinhvien3:h3622@cluster0.wou1pdj.mongodb.net/groupDB?retryWrites=true&w=majority&appName=Cluster0", {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log("✅ MongoDB connected successfully"))
.catch((err) => console.error("❌ MongoDB connection error:", err));

// Mount user routes
const userRoutes = require('./routes/user');
app.use('/users', userRoutes);

// Health check
app.get('/', (req, res) => res.json({ message: 'Server running' }));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
