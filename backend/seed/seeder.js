// backend/seed/seeder.js
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Recommendation = require('../models/recommendationModel');
const recommendationsData = require('./recommendations');

// Load env vars
dotenv.config();

// Connect to DB
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

// Import data into DB
const importData = async () => {
  try {
    await Recommendation.deleteMany();
    await Recommendation.insertMany(recommendationsData);
    
    console.log('Data Imported!');
    process.exit();
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

// Delete all data from DB
const deleteData = async () => {
  try {
    await Recommendation.deleteMany();
    
    console.log('Data Destroyed!');
    process.exit();
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

// Check command line argument and perform corresponding action
if (process.argv[2] === '-d') {
  deleteData();
} else {
  importData();
}