const mongoose = require("mongoose");
require("dotenv").config();

const subsectionSchema = new mongoose.Schema({
    title:{
        type:String,
    },
    timeduration:{
        type:String,
    },
    description:{
        type:String,
    },
    videoUrl:{
        type:String,
    },
    
});

module.exports = mongoose.model("SubSection",subsectionSchema);

