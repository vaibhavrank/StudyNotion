const mongoose = require("mongoose");
require("dotenv").config();

const catagorySchema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
    },
    description:
    {
        type:String,
    },
    courses:[
        {
        type:mongoose.Schema.Types.ObjectId,
        ref:"Course",
        }
    ]
});

module.exports = mongoose.model("Category",catagorySchema);