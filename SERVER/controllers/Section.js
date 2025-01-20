const Section = require("../models/Section");
const SubSection = require("../models/SubSection");
const Course = require("../models/Course");
const { default: mongoose } = require("mongoose");

//create section 
exports.createSection = async (req,res) => {
    try{
        console.log(req.body.courseId)
       //data fetch
        const {sectionName,courseId} = req.body;
        //data validation
        if(!sectionName||!courseId){
            return res.json({
                success:false,
                message:"All feild is mandatory",
            });
        }
        //create section
        const newSection = await Section.create({sectionName});
        //update course
        console.log(newSection);
        
        const updatedCourse = await Course.findByIdAndUpdate(
            courseId,
			{
				$push: {
					courseSection: newSection._id,
				},
			},
			{ new: true }
		).populate("courseSection").exec();
        console.log(updatedCourse);
        //HW use populateto replace sections/sub-sections both in the updatedCourseDetails
        //response
        return res.status(200).json({
            success:true,
            message:"section Created Successfully",
            updatedCourse,
        });

    }catch(error){
        res.status(500).json({
            success:false,
            message:"Error while creating section",
            error:error.message,
        });  
    }
}
//update section
exports.updateSection = async (req,res) =>{
    try{
        //fetch data
        const {sectionName,sectionId,courseId} = req.body;
        //valodation
        if(!sectionName||!sectionId){
            return res.json({
                success:false,
                message:"All feild is mandatory",
            });
        }
        //update data
        const section = await Section.findByIdAndUpdate(sectionId,{sectionName:sectionName},{new:true});
        const course = await Course.findById(courseId);

        //respoonse
        if (!section) {
            return res.status(404).json({ error: "Section not found" });
        }
      
        console.log(section)
        return res.status(200).json({
            success:true,
            message:"Section updated successfully",
            course,
        });

    }catch(error){
        return res.status(500).json({
            success:false,
            error:error.message,
            message:"Error while updating the section",
        })
    }
}
//delete section 

exports.deleteSection = async (req,res) =>{
    try{
        //fetch the id of the setion
        const {sectionId,courseId}= req.body;
        //delete
        await Section.findByIdAndDelete(sectionId);
        //TODO Do we need to delete if from course section?
        console.log("COURSE ID: ",courseId,sectionId);
        const updatedCourse = await Course.findByIdAndUpdate(courseId,
            {$pull: {courseSection : sectionId}}
        ).populate({ path: "courseSection", populate: { path: "subSection" } }).exec();

        console.log("UPDATED COURSE AFTER DELETION OF SECTION...............",updatedCourse)
		res.status(200).json({
			success: true,
			message: "Section deleted",
			updatedCourse,
		});
    }catch(error){
        return res.status(500).json({
            success:false,
            error:error.message,
            message:"Error while deleting the section"
        })
    }
}
