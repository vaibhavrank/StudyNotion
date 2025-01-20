//CREATE COURSE
const Course = require("../models/Course");
const Tag = require("../models/Category");
const User = require("../models/User");
const {uploadImageToCloudinary} = require("../utils/imageUploader");
const Category = require("../models/Category");
const Section = require("../models/Section");
const SubSection = require("../models/SubSection");
const CourseProgress = require("../models/CourseProgress")
//create
require("dotenv").config();
exports.createCourse = async (req,res)=>{
    try{
        //get data
        const {status,courseName,instructions, courseDescription, whatYouWillLearn,category, price,tag } = req.body;
        //get all thumbnail
        const thumbnail = req.files.thumbnailImage;
        //validation
        if(!tag||!courseName||!courseDescription||!instructions||!whatYouWillLearn||!category||!price||!thumbnail){
            return res.json({
                success:false,
                message:"All feilds are required",
            });
        } 
        //check for instructor
        const userId = req.user.id;
        const instructorDatails = await User.findById(userId); 

        if(!instructorDatails){
            return res.status(404).json({
                success:false,
                message:"Instructor Deatils not found",
            })
        }
        //validation of tag
        let categoryDetails = await Category.findById(category);
        if(!categoryDetails){
            return res.status(404).json({
                success:false,
                message:"Category Details not found",
            });
        }
        
         
        //upload image to cloudinary
        const thumbnailImage = await uploadImageToCloudinary(thumbnail,process.env.FOLDER_NAME);
        //save to DB 
        const parsedInstructions = Array.isArray(instructions)
            ? instructions
            : JSON.parse(instructions);

        const parsedTags = Array.isArray(tag) ? tag : JSON.parse(tag);

        const newCourse = await Course.create({
            courseName:courseName,
            courseDescription,
            instructor:instructorDatails._id,
            whatYouWillLearn:whatYouWillLearn,
            category:categoryDetails._id,
            thumbnail:thumbnailImage.secure_url.toString(),
            price:price,
            tags:tag,
            status:status,
            instructions:instructions
        });
        categoryDetails = await Category.findByIdAndUpdate(categoryDetails._id,
          {
            $push:{courses:newCourse._id},
          }
        )
        //add the new course in user schema
        await User.findByIdAndUpdate(
            {_id:instructorDatails._id},
            {
                $push: {
                    courses:newCourse._id,
                }
            }, 
            {new:true}
        );
        
        
        // return response
        return res.status(200).json({
            success:true,
            message:"Course created Succssfully",
            data:newCourse,
        })           
    }catch(error){
      console.log(error)
        return res.status(500).json({
            success:false,
            message:"Error while creating course",
            error:error.message,
        })
    }
}


//get all course handler functions

exports.showAllCourses = async (req, res) => {
    try{
        const allCourse = await Course.find({});//,{courseName:true,
                                                // price:true,
                                                // thumbnail:true,
                                                // instructor:true,
                                                // ratingAndReview:true,
                                                // studentEnrolled:true,})
                                                // .populate("instructor")
                                                // .exec();
            return res.status(200).json({
                success:true,
                message:"All courses fethced successfully",
                data:allCourse,
            });
    }
    catch(error){
        res.status(500).json({
            success:true,
            message:"error while fetching the courses",
            error:error.message,
        })
    }
};

// Edit Course Details
exports.editCourse = async (req, res) => {
    try {
      const { courseId } = req.body
      const updates = req.body
      const course = await Course.findById(courseId)
  
      if (!course) {
        return res.status(404).json({ error: "Course not found" })
      }
  
      // If Thumbnail Image is found, update it
      if (req.files) {
        const thumbnail = req.files.thumbnailImage
        const thumbnailImage = await uploadImageToCloudinary(
          thumbnail,
          process.env.FOLDER_NAME
        )
        course.thumbnail = thumbnailImage.secure_url
      }
  
      // Update only the fields that are present in the request body
      for (const key in updates) {
        if (updates.hasOwnProperty(key)) {
          if (key === "tag" || key === "instructions") {
            course[key] = JSON.parse(updates[key])
          } else {
            course[key] = updates[key]
          }
        }
      }
  
      await course.save()
  
      const updatedCourse = await Course.findOne({
        _id: courseId,
      })
        .populate({
          path: "instructor",
          populate: {
            path: "additionalDetails",
          },
        })
        .populate("category")
        
        .populate({
          path: "courseSection",
          populate: {
            path: "subSection",
          },
        })
        .exec()
  
      res.json({
        success: true,
        message: "Course updated successfully",
        data: updatedCourse,
      })
    } catch (error) {
      console.error(error)
      res.status(500).json({
        success: false,
        message: "Internal server error",
        error: error.message,
      })
    }
  }

//get Course Dtails

exports.getCourseDetails = async (req,res) => {
    try{
            const {courseId} = req.body;
            //find course details
            const courseDetails = await Course.find(
                                    {_id:courseId})
                                    .populate(
                                        {

                                            path:"instructor",
                                            populate:{
                                                path:"additionalDetails",
                                            }
                                        }
                                    )
                                    .populate("category")
                                    .populate({
                                      path:"ratingAndReview",
                                      populate:{
                                        path:"user",
                                      }
                                    })
                                    .populate({
                                      path:"courseSection",
                                      populate:{
                                        path:"subSection"
                                      }
                                    })
                                    // .populate("createdAt")
                                    .exec();
            //validation
            if(!courseDetails){
                return res.status(400).json({
                    success:false,
                    message:`could not find the course with ${courseId}`
                });
            }
            return res.status(200).json({
                success:true,
                message:"Course detailed fetch successfully",
                data:courseDetails,
            });
    }catch(error){
        console.log("ERROR",error)
        return res.status(500).json({
            success:true,
            message:error.message,
        });
    }
}

exports.getFullCourseDetails = async (req, res) => {

  const convertSecondsToDuration = (totalDurationInSeconds)=>{
    const hr = totalDurationInSeconds/3600;
    totalDurationInSeconds = totalDurationInSeconds-hr*3600;
    const min = totalDurationInSeconds/60;
    totalDurationInSeconds = totalDurationInSeconds - min*60;
    return `${hr}:${min}:${totalDurationInSeconds}`;
  }

    try {
      const {courseId} = req.body
      const userId = req.user.id
      const courseDetails = await Course.findOne({
        _id: courseId,
      })
        .populate({
          path: "instructor",
          populate: {
            path: "additionalDetails",
          },
        })
        .populate("category")
        .populate("ratingAndReview")
        .populate({
          path: "courseSection",
          populate: {
            path: "subSection",
          },
        })
        .exec()
  
      let courseProgressCount = await CourseProgress.findOne({
        courseID: courseId,
        userID: userId,
      })
      
  
      if (!courseDetails) {
        return res.status(400).json({
          success: false,
          message: `Could not find course with id: ${courseId}`,
        })
      }
  
      if (courseDetails.status === "Draft") {
        return res.status(403).json({
          success: false,
          message: `Accessing a draft course is forbidden`,
        });
      }
  
      let totalDurationInSeconds = 0
      courseDetails.courseSection.forEach((content) => {
        content.subSection.forEach((subSection) => {
          const timeDurationInSeconds = parseInt(subSection.timeduration)
          totalDurationInSeconds += timeDurationInSeconds
        })
      })
  
      const totalDuration = convertSecondsToDuration(totalDurationInSeconds)
      return res.status(200).json({
        success: true,
        data: {
          courseDetails,
          totalDuration,
          completedVideos: courseProgressCount?.completedVideos
            ? courseProgressCount?.completedVideos
            : [],
        },
      })
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message,
      })
    }
  }

  // Get Course List
exports.getAllCourses = async (req, res) => {
    try {
      // const allCourses = await Course.find(
      //   // { status: "Published" },
      //   {
      //     courseName: true,
      //     // price: true,
      //     thumbnail: true,
      //     // Instructor: true,
      //     // ratingAndReviews: true,
      //     // studentsEnrolled: true,
      //   }
      // )
      //   // .populate("Instructor")
      //   // .exec()
      const allCourses = await Course.find({});
      return res.status(200).json({
        success: true,
        data: allCourses,
      })
    } catch (error) {
      console.log(error)
      return res.status(404).json({
        success: false,
        message: `Can't Fetch Course Data`,
        error: error.message,
      })
    }
  }


// Get a list of Course for a given Instructor
exports.getInstructorCourses = async (req, res) => {
    try {
      // Get the instructor ID from the authenticated user or request body
      const instructorId = req.user.id
  
      // Find all courses belonging to the instructor
      const instructorCourses = await Course.find({
        instructor: instructorId,
      }).sort({ createdAt: -1 }).populate("category").exec();
  
      // Return the instructor's courses
      res.status(200).json({
        success: true,
        data: instructorCourses,
      })
    } catch (error) {
      console.error(error)
      res.status(500).json({
        success: false,
        message: "Failed to retrieve instructor courses",
        error: error.message,
      })
    }
  }


  // Delete the Course
  exports.deleteCourse = async (req, res) => {
    try {
      const { courseId } = req.body
  
      // Find the course
      const course = await Course.findById(courseId)
      if (!course) {
        return res.status(404).json({ message: "Course not found" })
      }
  
      // Unenroll students from the course
      const studentsEnrolled = course.studentEnrolled
      for (const studentId of studentsEnrolled) {
        await User.findByIdAndUpdate(studentId, {
          $pull: { courses: courseId },
        })
      }
  
      // Delete sections and sub-sections
      const courseSections = course.courseSection
      for (const sectionId of courseSections) {
        // Delete sub-sections of the section
        const section = await Section.findById(sectionId)
        if (section) {
          const subSections = section.subSection
          for (const subSectionId of subSections) {
            await SubSection.findByIdAndDelete(subSectionId)
          }
        }
  
        // Delete the section
        await Section.findByIdAndDelete(sectionId)
      }
  
      // Delete the course
      await Course.findByIdAndDelete(courseId)
  
      return res.status(200).json({
        success: true,
        message: "Course deleted successfully",
      })
    } catch (error) {
      console.error(error)
      return res.status(500).json({
        success: false,
        message: "Server error",
        error: error.message,
      })
    }
  }


  exports.markLectureAsComplete = async (req, res) => {
    const { courseId, subSectionId, userId } = req.body
    if (!courseId || !subSectionId || !userId) {
      return res.status(400).json({
      success: false,
      message: "Missing required fields",
      })
    }
    try {
      let progressAlreadyExists = await CourseProgress.findOne({
            userID: userId,
            courseID: courseId,
          })
          if(!progressAlreadyExists){
            progressAlreadyExists = await CourseProgress.create({
              userID: userId,
              courseID: courseId,
            })
          }
      const completedVideos = progressAlreadyExists.completedVideos
      if (!completedVideos.includes(subSectionId)) {
      await CourseProgress.findOneAndUpdate(
        {
        userID: userId,
        courseID: courseId,
        },
        {
        $push: { completedVideos: subSectionId },
        }
      )
      }else{
      return res.status(400).json({
        success: false,
        message: "Lecture already marked as complete",
        })
      }
      await CourseProgress.findOneAndUpdate(
      {
        userId: userId,
        courseID: courseId,
      },
      {
        completedVideos: completedVideos,
      }
      )
    return res.status(200).json({
      success: true,
      message: "Lecture marked as complete",
    })
    } catch (error) {
      return res.status(500).json({
      success: false,
      message: error.message,
      })
    }
  
  }