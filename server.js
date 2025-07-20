const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? ['https://dashboard-survey.vercel.app', /\.vercel\.app$/] 
    : 'http://localhost:3000',
  methods: ['GET', 'POST'],
  credentials: true
}));
app.use(express.json());

// MongoDB Connection
// In production, use the environment variable set in Vercel
// In development, use the local .env file or fallback to the hardcoded URI
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://bhboomis:nPCJggIkHu1sYMF8@cluster0.9ezpy0a.mongodb.net/surveys?retryWrites=true&w=majority&appName=Cluster0';

// Log the environment (but not the full connection string for security)
console.log(`Environment: ${process.env.NODE_ENV}`);
console.log(`MongoDB connection: ${MONGODB_URI.split('@')[0].replace(/:[^:]*$/, ':****')}@${MONGODB_URI.split('@')[1]}`);


// MongoDB connection options
const mongoOptions = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 30s
  socketTimeoutMS: 45000, // Close sockets after 45s of inactivity
};

// Connect to MongoDB with retry logic
const connectWithRetry = () => {
  console.log('Attempting to connect to MongoDB...');
  mongoose.connect(MONGODB_URI, mongoOptions)
    .then(() => {
      console.log('MongoDB connected successfully');
    })
    .catch(err => {
      console.error('MongoDB connection error:', err);
      console.log('Retrying connection in 5 seconds...');
      setTimeout(connectWithRetry, 5000);
    });
};

connectWithRetry();

// Handle MongoDB connection events
mongoose.connection.on('error', (err) => {
  console.error('MongoDB connection error:', err);
});

mongoose.connection.on('disconnected', () => {
  console.log('MongoDB disconnected, attempting to reconnect...');
  connectWithRetry();
});

process.on('SIGINT', () => {
  mongoose.connection.close(() => {
    console.log('MongoDB connection closed due to app termination');
    process.exit(0);
  });
});

// Survey Schema
const surveySchema = new mongoose.Schema({
  recommendationRating: {
    type: String,
    required: true
  },
  satisfactionRating: {
    type: String,
    required: true
  },
  experience: {
    type: String,
    required: true
  },
  contactPermission: {
    type: String,
    required: true
  },
  furtherInfoPermission: {
    type: String,
    required: true
  },
  fullName: {
    type: String,
    required: true
  },
  phone: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Survey = mongoose.model('Survey', surveySchema);

// API Routes

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({ 
    status: 'ok',
    environment: process.env.NODE_ENV,
    timestamp: new Date().toISOString(),
    mongodb: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected'
  });
});

app.post('/api/surveys', async (req, res) => {
  try {
    const newSurvey = new Survey(req.body);
    const savedSurvey = await newSurvey.save();
    res.status(201).json(savedSurvey);
  } catch (error) {
    console.error('Error saving survey:', error);
    res.status(500).json({ error: 'Failed to save survey data' });
  }
});

app.get('/api/surveys', async (req, res) => {
  try {
    const surveys = await Survey.find().sort({ createdAt: -1 });
    res.status(200).json(surveys);
  } catch (error) {
    console.error('Error fetching surveys:', error);
    res.status(500).json({ error: 'Failed to fetch survey data' });
  }
});

// Serve static assets (always serve in Vercel)
app.use(express.static(path.join(__dirname, 'client/build')));

// Catch all handler: send back React's index.html file for any non-API routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'client/build/index.html'));
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));