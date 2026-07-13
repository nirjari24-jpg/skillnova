const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();

// Middleware
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:3000'],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true,
}));
app.use(express.json());

// Routes
const careerRoutes = require('./routes/careerRoutes');
const aiRoutes = require('./routes/aiRoutes');

app.use('/api/careers', careerRoutes);
app.use('/api/ai', aiRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'SkillNova API is running!' });
});

// Start server immediately (MongoDB is optional)
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`\n🚀 SkillNova Server running on http://localhost:${PORT}`);
  console.log(`   Health check: http://localhost:${PORT}/api/health`);

  // Optionally connect to MongoDB if URI is provided
  const MONGO_URI = process.env.MONGO_URI;
  if (MONGO_URI && MONGO_URI !== 'mongodb://localhost:27017/skillnova') {
    const mongoose = require('mongoose');
    mongoose.connect(MONGO_URI)
      .then(() => console.log('   ✅ Connected to MongoDB'))
      .catch((err) => console.warn('   ⚠️  MongoDB connection failed (API still works):', err.message));
  } else {
    console.log('   ℹ️  Running without MongoDB (using in-memory data)');
  }
});
