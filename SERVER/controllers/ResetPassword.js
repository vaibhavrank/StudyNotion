const User = require("../models/User");
const mailSender = require("../utils/mailSender");

const bcrypt = require("bcryptjs");
const crypto = require("crypto");

//resetPasswardToken
exports.resetPasswordToken = async (req,res) =>{
    try {
        // get email from req body 
        const {email} = req.body;

        //check user for this email, email verification
        const user = await User.findOne({email:email});
        if(!user){
            return res.json({
                message:"Your email is not registered with us",
            })
        }
        //generate token 
        const token = crypto.randomBytes(20).toString("hex");
        const updateDetails = await User.findOneAndUpdate({email:email},
                                                          {
                                                            token:token,
                                                            resetPasswordExpires : Date.now() + 5*60*1000,
                                                          },
                                                          {
                                                            new: true
                                                          });
            //create url   
        const url = `http://localhost:3000/update-password/${token}`;

        //sen mail containg the url
        await mailSender(email,
                        "Passward Reset Link",
                        `PasswordResetLink:${url}`);
        // retrun respoce
        return res.json(
            {
                success: true,
                message:"Mail sent Successfully , please check email and change password"
            }
        );
    } catch (error) {
        console.log(error);
        return res.status(401).json(
            {
                success: false,
                message:"Somr thing went wrong while reset password and sendding mail",
            }
        );
    }
};

//reset password 
exports.resetPassword = async (req,res)=>{
    try{
        //get data
        const {password,confirmPassword,token } = req.body ;
        //validation
        console.log(password,confirmPassword)
        if(password!=confirmPassword){
            return res.json({
                success:false,
                message: "Password and confirm apsswprd is no mathced",
            });
        }

        //get user details(token)
        const userDetails = await User.findOne({token:token});
        
        //if no entry- invalid token
        if(!userDetails){
            return res.json({
                success:false,
                message:"Token is invalid",
            });
        }
        
        // token time check
        if(userDetails.resetPasswordExpires < Date.now() ){
            return res.json({
                success:false,
                message:"Token is Expired , plese regengerate ypur token",
            });
        }
        // hash pwd
        const hasshedPassword = await bcrypt.hash(password,10);
        // change passward
        await User.findOneAndUpdate(
            {token:token},
            {password:hasshedPassword},
            {new:true},
        );
        //return response
        return res.status(200).json({
            success: true,
            message: "Password reset successful",
        });
    }catch(error)
    {
        console.log(error)
        return res.status(401).json({
            success:false,
            message:"Something went wrong while reseting passwprd"
        });
    }
}