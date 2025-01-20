const mongoose = require("mongoose");
require("dotenv").config();

const CourseProgress = new mongoose.Schema({
    courseID:{
        type:String,
        ref:"Course",
    },
    userID: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "User",
	},
    completedVideos:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"SubSection",
        }
    ],    
});

module.exports = mongoose.model("CourseProgress",CourseProgress);

