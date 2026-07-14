const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
const careerRoutes = require('./routes/careerRoutes');
const aiRoutes = require('./routes/aiRoutes');

app.use('/api/careers', careerRoutes);
app.use('/api/ai', aiRoutes);

// Database connection
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/skillnova';

// Start server without requiring MongoDB to be strictly connected yet
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

mongoose.connect(MONGO_URI)
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((error) => {
    console.warn('MongoDB connection warning (using mock data for now):', error.message);
  });
