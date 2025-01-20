const jwt = require("jsonwebtoken");
const User = require("../models/User");
//auth
exports.auth = async (req,res,next)=>{
    try{
        //extract token
        const token = req.cookies.token
                      || req.body.token
                      || req.header("Authorisation").replace("Bearer ", "");
        // if token missing
        if(!token){
            return res.status(401).json({
                success:false,
                message:"Token is missing",
            });
        }

        //verify the token
        try{
            const decode = jwt.verify(token, process.env.JWT_SECRET);
            req.user = decode;
            next();
        }catch(error){
            console.log(error);
            res.status(401).json({
                success:false,
                message:"token is invalid",
            });
        }
        
    }catch(error){
        console.log(error); 
        res.status(401).json({
            success: false, 
            message: error.message,
        });
    }
} 
// stident
exports.isStudent = async (req,res,next)=>{
    try {
        if(req.user.accountType!="Student"){
            return res.status(401).json({
                success:false,
                message:"This is a protected route for Stuentd onlly",
            });
            
        }
        next();
    } catch (error) {
        res.status(500).json({
            success:false,
            message:"User role cannot be verified",
        })
    }
}
//instructor
exports.isInstructor = async (req,res,next) =>{
    try {
        if(req.user.accountType!="Instructor"){
            return res.sstatus(401).json({
                success:false,
                message:"This is a protected route for Instructor onlly",
            });
            
        }
        next();
    } catch (error) {
        res.status(500).json({
            success:false,
            message:"User role cannot be verified",
        })
    }
}
//isAdmin
exports.isAdmin = async (req,res,next) =>{
    try {
        if(req.user.accountType!="Admin"){
            return res.status(401).json({
                success:false,
                message:"This is a protected route for Admin onlly",
            });
            
        }next();
    } catch (error) {
        res.status(500).json({
            success:false,
            message:"User role cannot be verified",
        })
    }
}
    
