const express = require("express");
const User = require("../models/User");
const OTP = require("../models/Otp");
const OTPgenerator = require("otp-generator");
const bcrypt = require("bcrypt");
const Profile = require("../models/Profile");
const jwt = require("jsonwebtoken");
const mailSender = require("../utils/mailsender");
const {passwordUpdated} = require("../mail/templates/passwordUpdate");
require("dotenv").config();
//send otp
exports.sendOTP = async (req,res)=>{
    try{
         //fetch email from req bidy
        const {email} = req.body;

        // check if user alderady exist
        const chaeckPresent = await User.findOne({email});

        if(chaeckPresent){
            return res.status(401).json({
                success: false,
                message: "User Alderady Exist",
            });
        };

        //generate OTP
        var otp = OTPgenerator.generate(6,{
            upperCaseAlphabets:false,
            lowerCaseAlphabets:false,
            specialChars: false,
        });
  
        ("OTP Generated");

        //check Unique otp or not

        let result = await OTP.findOne({otp: otp});

        while(result){
            otp = OTPgenerator.generate(6,{
                upperCaseAlphabets:false,
                lowerCaseAlphabets:false,
                specialChars: false,
            });
            result = await OTP.findOne({otp:otp});
        }
        const OTPplayload = {email,otp};

        //create an entry in db
        const otpbody = await OTP.create(OTPplayload);
        console.log("OTPBODY:",otpbody);
        
        // return response
        res.status(200).json({
            success:true,
            message: "Otp Genrated and saved successfully",
            otp
        });
    }catch(error){ 
        console.log("Send OTP SERVER SIDE ERROR................",error.message);
        res.status(401).json({
            success:false,
            message:error.message,
        });
    }
}
//signup
exports.signUp = async (req,res)=>{
    try{
        //data fetch from rew body
        const{
            firstName,
            lastName,
            email,
            password,
            confirmPassword,
            accountType,
            otp
        } = req.body;
        //data validation
        if(!firstName||!lastName||!password||!confirmPassword||!otp ){
            return res.status(403).json({
                success:false,
                message:"All fields are required",
            })
        }
        //2 passward matches or not
        if(password!=confirmPassword){
            return res.status(400).json({
                success:false,
                message: 'Passward and confirm Passward value does not match , please try again',
            });
        }
        //validate otp
        const existingUser = await User.findOne({email});
        if(existingUser){
            return res.status(401).json({
                success:false,
                message:"User with this email id is aldready Registered",
            })
        }
        //find most recent otp
        const recentOtp = await OTP.find({email}).sort({createdAt:-1}).limit(1);
        
        //validate OTP
        if(recentOtp.length==0){
            //OTP not found
            return res.status(401).json({
                success:false,
                message:"Otp Not Found",
            });
        }else if(otp!==recentOtp[0].otp){
            //invalid otp
          
            return res.status(401).json({
                success:false,
                message:"Invalid OTP",
            });
        }
        //hash passwardd 
        const hashedPassward = await bcrypt.hash(password,10)
        //save to database
        const profiledetails = await Profile.create({
            gender:null,
            dataofbirth:null,
            about:null,contactnumber:null,
        }); 
        const user = await User.create({
            firstName,
            lastName,
            email,
            password:hashedPassward,
            confirmPassword,
            accountType,
            additionalDetails:profiledetails._id,
            image:`https://api.dicebear.com/5.x/initials/svg?seed=${firstName}${lastName}`
        });
        return res.status(200).json({
            success:true,
            message:"User is registeeerd successfully",
            user,
        });
    }catch(error){
        console.log(error);
        res.status(401).json({
            success:false,
            message:"user can't be registered plaese try again",
            error:error.message
        });
    }

}
//Login
exports.login = async (req,res) =>{
    try{
        //get data frome req
        const {email,password} = req.body;
        if(!email||!password){
            
            return res.status(401).json({
                success:false,
                message:"Enter All ceredentials correctely",
            });
        }
        //check usser exost or not
        const user = await User.findOne({email:email}).populate("additionalDetails");
        if(!user){
            
            return res.status(401).json({
                success:false,
                message:"User with this email id is not registered",
            });
        }
        //passward match
        if(await bcrypt.compare(password,user.password)){
            const payload= {
                email : user.email,
                id:user._id,
                accountType: user.accountType
            }
            const token = jwt.sign(payload,process.env.JWT_SECRET,{
                expiresIn:"2h",
            });
            const options = {
                expires: new Date(Date.now()-3*24*60*60*1000),
                httpOnly:true,
            }
            user.token = token;
            user.password = undefined;
            res.cookie("token", token, options).status(200).json({
				success: true,
				token,
				user,
				message: `User Login Success`,
			});
        }else{
            return res.status(401).json({
                success:false,
                message:"Passward is incorrect",
            });
        }
    }catch(error){
        console.log("Login Error ......",error)
        return res.status(500).json({
            success:false,
            message:error.message,
        });
    }
}

// Controller for Changing Password
exports.changePassword = async (req, res) => {
    try {
      // Get user data from req.user
		const userDetails = await User.findById(req.user.id);

		// Get old password, new password, and confirm new password from req.body
		const { oldPassword, newPassword, confirmPassword } = req.body;
        
		// Validate old password
		const isPasswordMatch = await bcrypt.compare(
			oldPassword,
			userDetails.password
		);

		if(oldPassword === newPassword){
			return res.status(400).json({
				success: false,
				message: "New Password cannot be same as Old Password",
			});
		}
		
		if (!isPasswordMatch) {
			// If old password does not match, return a 401 (Unauthorized) error
			return res
				.status(401)
				.json({ success: false, message: "The password is incorrect" });
		}

		// Match new password and confirm new password
		if (newPassword !== confirmPassword) {
			// If new password and confirm new password do not match, return a 400 (Bad Request) error
			return res.status(400).json({
				success: false,
				message: "The password and confirm password does not match",
			});
		}
        
		// Update password
		const encryptedPassword = await bcrypt.hash(newPassword, 10);
		const updatedUserDetails = await User.findByIdAndUpdate(
			req.user.id,
			{ password: encryptedPassword },
			{ new: true }
		); 
		// Send notification email
		
        try {
			const emailResponse = await mailSender(
				updatedUserDetails.email,
				"Study Notion - Password Updated",
                passwordUpdated(userDetails.email,`${userDetails.firstName} ${userDetails.lastName}`)
            );
		} catch (error) {
			// If there's an error sending the email, log the error and return a 500 (Internal Server Error) error
			console.error("Error occurred while sending email:", error);
			return res.status(500).json({
				success: false,
				message: "Error occurred while sending email",
				error: error.message,
			});
		}
		// Return success response
		return res
			.status(200)
			.json({ success: true, message: "Password updated successfully" });
    } catch (error) {
      // If there's an error updating the password, log the error and return a 500 (Internal Server Error) error
      console.error("Error occurred while updating password:", error)
      return res.status(500).json({
        success: false,
        message: "Error occurred while updating password",
        error: error.message,
      })
    }
  } 