const mongoose = require("mongoose");
require("dotenv").config();

const courseSchema = new mongoose.Schema({
    courseName:{
        type:String,
    },
    courseDescription:{
        type:String,
    },
    instructor:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true,
    },
    whatYouWillLearn:{
        type:String,
    },
    courseSection:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"Section",
        },
    ],
    ratingAndReview:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"RatingAndReview",
        },
    ],
    price:{
        type:Number,
    },
    thumbnail:{
        type:String,
    },
    category:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Category",
    },
    tags:[{
        type:String,
        required:true,
    }],
    studentEnrolled:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"User",
        }
    ],
    status:{
        type:String,
    
    },
    instructions:[
        {
            type:String,
            required:true,
        },
    ],
}, {
    timestamps: true, // Adds createdAt and updatedAt fields automatically
});

module.exports = mongoose.model("Course",courseSchema);
 