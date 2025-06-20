const express = require("express");
const app = express();

const userRoutes = require("./routes/User");
const profileRoutes = require("./routes/Profile");
const paymentRoutes = require("./routes/Payments");
const courseRoutes = require("./routes/Course");
const contactRoute = require("./routes/Contact")
const dotenv = require("dotenv");
const connect = require("./config/database");
const cors = require("cors");
const {cloudinaryConnect} = require("./config/cloudinary");
const fileUpload = require("express-fileupload");
const cookieParser = require("cookie-parser");

dotenv.config();
const PORT = process.env.PORT||4000;

//database connect    
    
connect();

//middleware
app.use(express.json());
app.use(cookieParser());
app.use(
    cors({

        origin:"https://study-notion-36vyoqy93-vaibhav-ranks-projects.vercel.app",
        credentials:true,
    })
); 
app.use(
    fileUpload({  
        useTempFiles:true,
        tempFileDir:"/tmp",
    })
);
//cloudinar connection
cloudinaryConnect();

//routes
app.use("/api/v1/auth",userRoutes);
app.use("/api/v1/profile",profileRoutes);
app.use("/api/v1/course",courseRoutes);
app.use("/api/v1/payment",paymentRoutes);
app.use("/api/v1/contact",contactRoute);

//default route
app.get("/",(req,res)=>{
    return res.json({
        success:true,
        message:"Your server is Up and runnig....!",
    })
});



//activate the server
app.listen(PORT, ()=>{
    console.log(`App is runnig at ${PORT}`);
});

 
