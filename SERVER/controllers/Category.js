const Category = require('../models/Category');
// const Catagory = require('../models/Category');
// const  
exports.createCategory = async (req,res) => {
    try{
        //fetch data
        const {name, description} = req.body;
        //validtion
        if(!name||!description) {
            return res.json({
                success:false,
                message:"All Feils are required",
            });
        }
        //creaate Entry in DB
        const catagoryDetails = await Category.create({
            name: name,
            description:description,
        });
        return res.status(200).json({
            success: true,
            messsage:"Category created Successfully",
        });
    }catch(error){
        return res.status(500).json({
            success:false,
            message:error.message,
        })
    }
}

//get all tags
exports.showAllCategories = async (req,res) =>{
    try{
        const allCatagory = await Category.find({},{name:true,description:true});
        res.status(200).json({
            success:true,
            message:"All tags returned successfully",
            allCatagory,
        })

    }catch(error){
        return res.status(500).json({
            success:false,
            message:error.message,
        })
    }
}

// catagory page details

exports.categoryPageDetails = async (req,res) => {
    try{
        //get category id catagoryId
        const {catagoryId} =req.body;
        //fetch all teh course of that cataegory
        const selectedCatagory = await Category.findById(catagoryId)
                                                    .populate({
                                                        path:"courses",
                                                        populate:{
                                                            path:"instructor"
                                                        },
                                                        populate:{
                                                            path:"ratingAndReview"
                                                        }
                                                        })
                                                    .exec();

        // validation
        if(!selectedCatagory){
            return res.status(404).json({
                success:false,
                message:"Data not Found",
            })
        }

        
        // get courses of different category
        const differentCatagory = await Category.find({
                                           _id:{$ne:catagoryId},
                                })
                                .populate({
                                    path:"courses",
                                    populate:{
                                        path:"instructor"
                                    },
                                    populate:{
                                        path:"ratingAndReview"
                                    }
                                    })
                                .exec();
        //get top selling course
        // TODO
        const allCategories = await Category.find().populate({path:"courses",match:{status:"Published"},populate:([{path:"instructor"}]),populate:([{path:"ratingAndReview"}])});
		const allCourses = allCategories.flatMap((category) => category.courses);
		const mostSellingCourses = allCourses
			.sort((a, b) => b.sold - a.sold)
			.slice(0, 10);
        //return response
        return res.status(200).json({
            success:true,
            data:{
                selectedCatagory,
                differentCatagory,
                mostSellingCourses
             },
        }); 
    }catch(error){
        return res.status(500).json({
            success:false,
            message:error.message,
        })
    }
}