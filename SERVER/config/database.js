const mongoose = require("mongoose");
require("dotenv").config();
 
const connect =   ()=>{
  try {    
    mongoose.connect(process.env.MONGODB_URL,{
      serverSelectionTimeoutMS: 15000, 
    });
    console.log('MongoDB connected successfully');
  } catch (error) {
    console.log(process.env.MONGODB_URL);    
    console.error('MongoDB connection error: ', error);
    process.exit(1);    
  }    
};    

module.exports = connect;
    