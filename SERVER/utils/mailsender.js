const nodemailer = require("nodemailer");
// require("dotenv").config();
const mailSender = async (email,title,body)=>{
    try{
        console.log(email,title,body);
        // console.log        
        let transporter = nodemailer.createTransport({
            // port:465,
            host:process.env.MAIL_HOST,
            auth:{ 
                user:process.env.MAIL_USER,
                pass:process.env.MAIL_PASS,
            },
            // secure:true,
        });
        // console.log("INFO: ",transporter);
        let info = await transporter.sendMail({
            from:'StudyNotion || WizardWorld - by Vaibhav',
            to:`${email}`,
            subject: `${title}`,
            html:`${body}`,
        })
        console.log("Email sended successfully: ");
        return info;
    }catch(error){
        console.log(error.message);
        // return res.status(400).json({
        //     message:"Mail sending mailsender error",
        // })
    }
};

module.exports = mailSender;
