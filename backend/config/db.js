const mongoose = require('mongoose');
require('dotenv').config()

const connectDB = async ()=> {
  const url = process.env.DATABASE_URL;
  if (!url) {
    console.error('DATABASE_URL is not set in environment (.env missing or not loaded)');
    process.exit(1);
  }

  try{
    const conn = await mongoose.connect(url, {});
    console.log(`MongoDB connected: ${mongoose.connection.host}`);
  } catch(error){
    console.error('Could not connect to database:', error.message);
    console.error(error);
    process.exit(1);
  }
}

module.exports = connectDB;
