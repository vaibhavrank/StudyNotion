const { default: mongoose } = require("mongoose");
const Section = require("../models/Section");
const SubSection = require("../models/SubSection");
const { uploadImageToCloudinary,uploadFileToCloudinary } = require("../utils/imageUploader");
const Course = require("../models/Course");
//create subsection
exports.createSubSection = async (req,res) => {
    try{
        //fetchfetch data from req.body
        const { sectionId, title , description,courseId } = req.body;
		const video = req.files.videoFile;

		// Check if all necessary fields are provided
		if (!sectionId || !title || !description || !video || !courseId ) {
			return res
				.status(404)
				.json({ success: false, message: "All Fields are Required" });
		}

		const ifsection= await Section.findById(sectionId);
		if (!ifsection) {
            return res
                .status(404)
                .json({ success: false, message: "Section not found" });
        }


		// Upload the video file to Cloudinary
		const uploadDetails = await uploadImageToCloudinary(
			video,
			process.env.FOLDER_VIDEO
		);

		console.log(uploadDetails);
		// Create a new sub-section with the necessary information
		const SubSectionDetails = await SubSection.create({
			title: title,
			timeduration: uploadDetails.duration,
			description: description,
			videoUrl: uploadDetails.secure_url,
		});

		// Update the corresponding section with the newly created sub-section
		const updatedSection = await Section.findByIdAndUpdate(
			{ _id: sectionId },
			{ $push: { subSection: SubSectionDetails._id } },
			{ new: true }
		).populate("subSection");

		const updatesection = await Course.findById(courseId).populate({ path: "courseSection", populate: { path: "subSection" } }).exec();
		// Return the updated section in the response
		return res.status(200).json({ 
            success: true,  
            message:"sub section added successfully",
            updatesection, });
	} catch (error) {
		// Handle any errors that may occur during the process
		console.error("Error creating new sub-section:", error);
		return res.status(500).json({
			success: false,
			message: "Internal server error",
			error: error.message,
		});
	}
};
// update subsetion
  
// delete subsection

// need to be improved
exports.updateSubSection = async (req,res) =>{
    try{
        //fetch data
        const {subsectionName,subsectionId,title,description,timeduration} = req.body;
        //valodation
        const video = req.files.videoUrl;
        var uploadDetails = -1;
        if(video){
            uploadDetails = await uploadImageToCloudinary(video,process.env.FOLDER_NAME);
            if(!uploadDetails){
                return res.status(501).json({
                    success:true,
                    message:"Video Uploading Failed",
                });
            }

            const updatedSection = await SubSection.findByIdAndUpdate(subsectionId,{videoUrl:uploadDetails.secure_url},{new:true});
            if(!updatedSection){
                return res.status(404).json({
                    success:false,
                    message:"Sub section not found",
                })
            } 
        }
        if(!subsectionName||!subsectionId){
            return res.json({
                success:false,
                message:"All feild is mandatory",
            });
        }
        //update data
        const subsection = await SubSection.findByIdAndUpdate(subsectionId,{title,description},{new:true});
        if(!subsection){
            return res.status(404).json({
                success:false,
                message:"No Sub section found",
            })
        }
        //respoonse
        return res.status(200).json({
            success:true,
            message:"Section updated successfully",
            subsection ,
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

exports.deleteSubSection = async (req,res) =>{
    try{
        //fetch the id of the setion
        const {sectionId,subSectionId}= req.body;
        //delete
        console.log(sectionId,subSectionId);
        const subSectionDetails = await SubSection.findById(subSectionId);
        if(!subSectionDetails){
            return res.status(404).json({
                success:false,
                message:"Sub Section is not found",
            })
        }
        const data = await Section.findByIdAndUpdate(sectionId,
                                {$pull :{subSection:subSectionDetails._id},
                        },
                        {new:true}
        );
        if(!data){
            return res.status(501).json({
                success:false,
                message:"Section Deletion failed"
            })
        }
        const updatedSection = await SubSection.findByIdAndDelete({_id:subSectionDetails._id});
        console.log("UPDATED section after DELETING SUB SECTION..........",data)
        //TODO Do we need to delete if from course section?
        if(!updatedSection){
            res.status(501).json({
                success:false,
                message:"Deletion of Section is Failed",
            })
        }
        // response
        return res.status(200).json({
            success:true,
            message:"Section deletes successfully", 
            data,
        });

    }catch(error){
        console.log(error)
        return res.status(500).json({
            success:false,
            error:error.message,
            message:"Error while deleting the section"
        })
    }
}
