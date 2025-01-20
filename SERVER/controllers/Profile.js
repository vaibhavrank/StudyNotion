const User = require("../models/User");
const Course = require("../models/Course");
const Profile = require("../models/Profile");
const {uploadImageToCloudinary} = require("../utils/imageUploader");
const CourseProgress = require("../models/CourseProgress");
//update profile
exports.updateProfile = async (req,res) =>{
    try{
        //get data
        const {dateOfBirth ,about="", contactNumber,gender } = req.body;
        //get userId
        const id = req.user.id;
        //validation
        if(!contactNumber || !gender || !id ){
            return res.status(404).json({
                success:true,
                message:"All feild are required"
            });
        }
        //find profile
        const userDetails = await User.findById(id);
        const profileId = userDetails.additionalDetails;
        const profileDetails = await Profile.findById(profileId);
        //update profile
        profileDetails.dateOfBirth = dateOfBirth;
        profileDetails.gender = gender;
        profileDetails.contactnumber = contactNumber;
        profileDetails.about = about;
        await profileDetails.save();
        
        //return response
        return res.status(200).json({
            success:true,
            message:"Profile updated successfully",
            profileDetails,
        })

    }catch(error){
        return res.status(500).json({
            success:true,
            message:"Error while updating the profile",
            error:error.message,
        })
    }
}
//delete profile
//how can we schedule the jobs in express.js
exports.deleteAccount = async (req,res) =>{
    try {
        //get id
        const id = req.user.id;
        //validation
        const userDetails = await User.findById(id);
        if(!userDetails) {
            return res.status(404).json({
                success:false,
                message:"User not found"
            }
            );
        }
        //delete profile
        await Profile.findByIdAndDelete({_id:userDetails.additionalDetails._id});
        //TODO : unenroll the user from all the courses
        //resoponse
        await User.findByIdAndDelete({_id:userDetails._id})
        return res.status(200).json(
            {
                success:true,
                message:"User deleted successfully"
            }
        )
    } catch (error) {
        return res.status(500).json({
            success:true,
            message:"Error while deleting Profile",
            error:error.message,
        });
    }
}


//fetch the Profile
exports.getAllUserDetails = async (req,res) => {
    try {
      console.log("YESSSSSSSSSS");
        const id = req.user.id;
        const userDetails = await User.findById(id).populate("additionalDetails").exec();
        console.log(userDetails);
        if(!userDetails){
          return res.status(404).json({
            success:false,
            message:"User Profile Does Not Exist",
          })
        }
        
        return res.status(200).json({
            success:true,
            message:"USer data fetched successfully",
            data:userDetails,
        });
    } catch (error) {
        return res.status(500).json({
            success:false,
            message:"Error while fetching the data"
        })
    }
}


exports.updateDisplayPicture = async (req, res) => {
    try {
      const displayPicture = req.files.pfp
      // console.log("DISPLYA PICTURE: ",displayPicture)
      const userId = req.user.id
      const image = await uploadImageToCloudinary(
        displayPicture,
        process.env.FOLDER_NAME,
        1000,
        1000
      )
      // console.log(image)
      const updatedProfile = await User.findByIdAndUpdate(
        { _id: userId },
        { image: image.secure_url },
        { new: true }
      )
      res.send({
        success: true,
        message: `Image Updated successfully`,
        data: updatedProfile,
      })
    } catch (error) {
      console.log(error)
      return res.status(500).json({
        success: false,
        message: error.message,
      })
    }
  }
  
  exports.getEnrolledCourses = async (req, res) => {
    try {
      console.log("BACKEND CALLED FOR GET ENROLLED>>>>>>>>>>>>>>>")
      const userId = req.user.id
      
      let userDetails = await User.findOne({ _id: userId })
                                            .populate({
                                              path: 'courses',
                                              populate: 
                                                [{
                                                  path: "courseSection",
                                                  populate:[{ path: "subSection" }],
                                                }],
                                            })
                                            .exec();

        userDetails = userDetails.toObject()
        // console.log("USER DETAILS OBJECT..............",userDetails.courses.courseSection);
      var SubsectionLength = 0
      for (var i = 0; i < userDetails?.courses.length; i++) {
        let totalDurationInSeconds = 0
        SubsectionLength = 0
        for (var j = 0; j < userDetails.courses[i].courseSection.length; j++) {
          totalDurationInSeconds += userDetails.courses[i].courseSection[
            j
          ].subSection.reduce((acc, curr) => acc + parseInt(curr.timeduration), 0);


          console.log("totla DURATION..................",totalDurationInSeconds);
          userDetails.courses[i].totalDuration = (totalDurationInSeconds);
          SubsectionLength +=
            userDetails.courses[i].courseSection[j].subSection.length
        }
        let courseProgressCount = await CourseProgress.findOne({
          courseID: userDetails.courses[i]._id,
          userID: userId,
        })
        courseProgressCount = courseProgressCount?.completedVideos.length
        console.log("PROGRESS COUNT...............",courseProgressCount);
        if (SubsectionLength === 0) {
          userDetails.courses[i].progressPercentage = 100
        } else {
          // To make it up to 2 decimal point
          const multiplier = Math.pow(10, 2);
          console.log("MATH FUNTION.........................", Math.round(
            (courseProgressCount / SubsectionLength) * 100 * multiplier
          ) / multiplier)
          userDetails.courses[i].progressPercentage = 
           ( Math.round(
              (courseProgressCount / SubsectionLength) * 100 * multiplier
            ) / multiplier) || 0  
        }
      }
      // console.log("User Detils at Backend ... ",userDetails);
      res.status(200).json({
        success: true,
        message: "User Data fetched successfully",
        data: userDetails,
    });
      
  
      
      // return res.status(200).json({
      //   success: true,
      //   data: userDetails.courses,
      // })
    } catch (error) {

      return res.status(500).json({
        success: false,
        message: error.message,
      })
    }
  }
  
  exports.instructorDashboard = async (req, res) => {
    try {
      const courseDetails = await Course.find({ instructor: req.user.id })
      let totalStudents = 0;
      let totalAmount = 0;
      const courseData = courseDetails.map((course) => {
        const totalStudentsEnrolled = course.studentEnrolled.length
        totalStudents+=course.studentEnrolled.length;
        totalAmount+= totalStudentsEnrolled * course.price;
        const totalAmountGenerated = totalStudentsEnrolled * course.price
        const thumbnail = course.thumbnail;
        // Create a new object with the additional fields
        const courseDataWithStats = {
          _id: course._id,
          courseName: course.courseName,
          courseDescription: course.courseDescription,
          thumbnail,
          price:course.price,
          // Include other course properties as needed
          totalStudentsEnrolled,
          totalAmountGenerated,
          
        }
  
        return courseDataWithStats
      })
  
      res.status(200).json({ courses: courseData,
        totalAmount,totalStudents
       })
    } catch (error) {
      console.error(error)
      res.status(500).json({ message: "Server Error" })
    }
  }