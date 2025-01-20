const mongoose = require("mongoose");
const mailSender = require("../utils/mailsender");
const emailTemplate = require("../mail/templates/emailVerificationTemplate");
require("dotenv").config();

const optSchema = new mongoose.Schema({
    email:{
        type:String,
        required:true,
    },
    otp:
    {
        type:String,
        required:true,
    },
    createdAt:{
        type:Date,
        default:Date.now(),
        expires:5*60,
    }
});

async function sendVerificationEmail(email, otp) {
	// Create a transporter to send emails

	// Define the email options

	// Send the email
	try {
        // console.log("Entered");
        // console.log(email);
		const mailResponse = await mailSender(
			email,
			"Verification Email",
			emailTemplate(otp)
		);
		// console.log("Email sent successfully: ", mailResponse);
	} catch (error) {
		console.log("Error occurred while sending email: ", error);
		throw error;
	}
}

optSchema.pre("save",async function(next){
    // console.log(this.email);
    await sendVerificationEmail(this.email,this.otp);
    next(); 
})

module.exports = mongoose.model("OTP",optSchema);
