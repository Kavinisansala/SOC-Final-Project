const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const session = require('express-session');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
require('dotenv').config();

const app = express();

// Middleware
app.use(express.json());
app.use(cors({
  origin: 'http://localhost:3000', // Your frontend URL
  credentials: true
}));

app.use(session({
  secret: process.env.SESSION_SECRET || 'your-secret-key-change-this',
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false } // Set to true in production with HTTPS
}));

app.use(passport.initialize());
app.use(passport.session());

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/weather-covid-db', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('✅ MongoDB Connected Successfully'))
.catch(err => console.error('❌ MongoDB Connection Error:', err));

// MongoDB Schema
const recordSchema = new mongoose.Schema({
  country: { type: String, required: true },
  weather: {
    temperature: Number,
    humidity: Number,
    description: String,
    windSpeed: Number,
    city: String
  },
  covidStats: {
    cases: Number,
    deaths: Number,
    recovered: Number,
    active: Number,
    todayCases: Number,
    todayDeaths: Number
  },
  timestamp: { type: Date, default: Date.now },
  userId: String,
  userEmail: String
});

const Record = mongoose.model('Record', recordSchema);

// Passport Google OAuth Setup
passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: '/auth/google/callback'
  },
  (accessToken, refreshToken, profile, done) => {
    return done(null, profile);
  }
));

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user);
});

// API Key Middleware
const validateApiKey = (req, res, next) => {
  const apiKey = req.headers['x-api-key'];
  const validApiKey = process.env.API_KEY || 'your-api-key-12345';
  
  if (!apiKey) {
    return res.status(401).json({ 
      success: false, 
      error: 'API Key is required in x-api-key header' 
    });
  }
  
  if (apiKey !== validApiKey) {
    return res.status(403).json({ 
      success: false, 
      error: 'Invalid API Key' 
    });
  }
  
  next();
};

// Authentication Middleware
const isAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  res.status(401).json({ 
    success: false, 
    error: 'User not authenticated' 
  });
};

// Routes

// Auth Routes
app.get('/auth/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

app.get('/auth/google/callback',
  passport.authenticate('google', { failureRedirect: '/login' }),
  (req, res) => {
    res.redirect('http://localhost:3000'); // Redirect to frontend
  }
);

app.get('/auth/logout', (req, res) => {
  req.logout((err) => {
    if (err) {
      return res.status(500).json({ success: false, error: 'Logout failed' });
    }
    res.json({ success: true, message: 'Logged out successfully' });
  });
});

app.get('/auth/user', (req, res) => {
  if (req.isAuthenticated()) {
    res.json({
      success: true,
      user: {
        id: req.user.id,
        displayName: req.user.displayName,
        email: req.user.emails[0].value,
        photo: req.user.photos[0].value
      }
    });
  } else {
    res.status(401).json({ success: false, error: 'Not authenticated' });
  }
});

// Main API Routes

// POST /submit - Submit aggregated data
app.post('/submit', validateApiKey, isAuthenticated, async (req, res) => {
  try {
    const { country, weather, covidStats } = req.body;
    
    // Data validation
    if (!country || !weather || !covidStats) {
      return res.status(400).json({ 
        success: false, 
        error: 'Missing required fields: country, weather, covidStats' 
      });
    }
    
    // Create new record
    const newRecord = new Record({
      country,
      weather,
      covidStats,
      userId: req.user.id,
      userEmail: req.user.emails[0].value
    });
    
    await newRecord.save();
    
    res.status(201).json({ 
      success: true, 
      message: 'Data stored successfully',
      recordId: newRecord._id
    });
    
  } catch (error) {
    console.error('Error saving record:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to store data',
      details: error.message 
    });
  }
});

// GET /records - Retrieve all records
app.get('/records', validateApiKey, isAuthenticated, async (req, res) => {
  try {
    const records = await Record.find({ userId: req.user.id })
      .sort({ timestamp: -1 })
      .limit(50); // Limit to last 50 records
    
    res.json({ 
      success: true, 
      count: records.length,
      records 
    });
    
  } catch (error) {
    console.error('Error fetching records:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to fetch records',
      details: error.message 
    });
  }
});

// GET /records/:id - Get specific record
app.get('/records/:id', validateApiKey, isAuthenticated, async (req, res) => {
  try {
    const record = await Record.findOne({ 
      _id: req.params.id,
      userId: req.user.id 
    });
    
    if (!record) {
      return res.status(404).json({ 
        success: false, 
        error: 'Record not found' 
      });
    }
    
    res.json({ success: true, record });
    
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      error: 'Failed to fetch record' 
    });
  }
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Server is running',
    timestamp: new Date().toISOString()
  });
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📊 MongoDB: ${mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected'}`);
});