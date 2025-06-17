const express = require("express")
const router = express.Router()
// const { contactUsController } = require("../controllers/ContactUs");
const mailSender = require("../utils/mailSender");
const { contactUsEmail } = require("../mail/templates/contactFormRes");

router.post("/",async (req,res)=>{
    try{
        //send the mail
        const {
            email,
            firstName,
            lastName,
            message,
            phoneNo,
            countryCode
        } = req.body;
        
            console.log(email);
            await mailSender(
                email,
                `Payment received`,
                contactUsEmail(
                    email,
                    firstName,
                    lastName,
                    message,
                    phoneNo,
                    countryCode)
            )
            return res.status(200).json({
                success:true,
                message:"Email sent successfully"
            })
    }catch(error){
        console.log(error)
        return res.status(500).json({
            success:false, 
            message:error.message  
        })
    }
})

module.exports = router  