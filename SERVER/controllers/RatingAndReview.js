const RatingAndReview = require("../models/RatingAndReview");
const Course = require("../models/Course");

//createRating
exports.createRating = async (req,res) => {
    try{
        //get user id
        const userId = req.user.id;
        //fetchdata from req body
        const {rating,review,courseId} = req.body;
        console.log("CREATE RATING CALLED................",rating,review,courseId);
        // check if user is enrolled or not
        const courseDetails = await Course.findOne(
                            {_id:courseId ,
                             studentEnrolled:{$elemMatch:{$eq:userId}},
                            }
                        );
        if(!courseDetails){
            return res.status(404).json({
                success:false,
                message:"User is  not enrolled in course",
            })
        }
        //check if user aldredy reviewed the course
        const aldreadyReviewed = await RatingAndReview.findOne(
                                    {
                                        user:userId,
                                        course:courseId,
                                    }
        );
        if(aldreadyReviewed){
            return res.status(403).json({
                success:false,
                message:"User aldready reviewed"
            });
        }
        //create rating and review
        const ratingReview = await RatingAndReview.create({
            rating,review,
            course:courseId,
            user:userId,
        });
        
        //update the course with this rating review
        const updatedCourseDetails = await Course.findByIdAndUpdate(
                            {_id:courseId},
                            {

                                $push: {
                                    ratingAndReview:ratingReview._id,
                                }
                            },{new:true}
        )

        console.log(updatedCourseDetails,ratingReview);
        // return response
        return res.status(200).json({
            success:true,
            message:"Rating and review updated",
            ratingReview, 
        })
    }catch(error){
        return res.status(500).json({
            success:false,
            message:error.message
        })
    }
}


//getAverageRatings
exports.getAverageRating = async (req,res) =>{
    try{    
        //get average rating
        const courseId = req.body.courseId;
        //calculate avg rating
        const result = await RatingAndReview.aggregate([
            {
                $match:{
                    course:new mongoose.Types.ObjectId(courseId),
                },
            },
            {
                $group:{
                    _id:null,
                    averageRating: {$avg:"$rating"},
                }
            }
        ])
        //return rating
        if(result.length>0){
            return res.status(200).json({
                success:true,
                averageRating:result[0].averageRating,
            });
        }

        //if no rating reviews exists
        return res.status(200).json({
            success:false,
            message:"Average rating is 0, no ratings given till now",
            averageRating:0,
        });

    }catch(error){
        return res.status(500).json({
            success:false,
            message:error.message,
        })
    }
}


//getAllRating

exports.getAllRating = async (req,res) =>{
    try{
       const allReviews = await RatingAndReview.find({})
                                .sort({rating:"desc"})
                                .populate({
                                    path:"user",
                                    select:"firstName lastName email image",
                                }) 
                                .populate({
                                    path:"course",
                                    select:"courseName",
                                }).exec();
            return res.status(200).json({
                success:true,
                message:"All reviews fetched successfully",
                data :allReviews,
            })
    }catch(error){
        return res.status(500).json({
            success:false,
            message:error.message,
        })
    }
}