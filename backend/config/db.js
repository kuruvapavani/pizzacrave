const mongoose = require('mongoose');

const connectDB = async (dbUri) => {
  if (!dbUri) {
    console.error("MongoDB URI is undefined. Check your .env file.");
    process.exit(1);
  }
  try {
    await mongoose.connect(dbUri);
    console.log("Connected to MongoDB successfully");

    mongoose.connection.on('error', (err) => {
      console.error('MongoDB connection error:', err);
    });

    process.on('SIGINT', async () => {
      await mongoose.connection.close();
      console.log('MongoDB connection closed due to app termination');
      process.exit(0);
    });

  } catch (err) {
    console.error("Error connecting to the database:", err.message);
    process.exit(1);
  }
};

module.exports = connectDB;
