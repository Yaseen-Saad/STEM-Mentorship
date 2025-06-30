const mongoose = require('mongoose');

// MongoDB connection configuration
const connectDB = async () => {
  try {
    // Use environment variable or default to local MongoDB
    const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/stem-mentorship';
    
    console.log('Attempting to connect to MongoDB...');
    console.log('Environment:', process.env.NODE_ENV || 'development');
    
    const conn = await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 10000, // 10 seconds
      heartbeatFrequencyMS: 10000,
      maxPoolSize: 10,
      minPoolSize: 1,
    });

    console.log(`MongoDB Connected: ${conn.connection.host}`);
    console.log(`Database: ${conn.connection.name}`);
    return conn;
  } catch (error) {
    console.error('MongoDB connection error:', error.message);
    
    // In production/Vercel, don't exit but log the error
    if (process.env.NODE_ENV === 'production' || process.env.VERCEL) {
      console.log('Running without database in production mode');
      return null;
    } else {
      // In development, still try to connect but don't crash
      console.log('Running without database in development mode');
      return null;
    }
  }
};

// Handle connection events
mongoose.connection.on('connected', () => {
  console.log('Mongoose connected to MongoDB');
});

mongoose.connection.on('error', (err) => {
  console.error('Mongoose connection error:', err);
});

mongoose.connection.on('disconnected', () => {
  console.log('Mongoose disconnected');
});

// Close connection on app termination
process.on('SIGINT', async () => {
  await mongoose.connection.close();
  console.log('MongoDB connection closed due to app termination');
  process.exit(0);
});

module.exports = connectDB;
