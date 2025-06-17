const {instance} = require("../config/razorpay");
const Course = require("../models/Course");
const User = require("../models/User");
const mailSender = require("../utils/mailSender");
require("dotenv").config()
const {courseEnrollmentEmail} = require("../mail/templates/courseEnrollmentEmail");
const crypto = require("crypto")
const {paymentsuccessEmail} = require("../mail/templates/paymentSuccessEmail");
const { encode } = require("punycode");




//initiates the order of the razorpay payment website
exports.createPayment = async(req,res)=>{
  
  const {courses} = req.body;
  const useId = req.user.id;
  if(courses.length === 0 ){
    return res.json({success:false,message:"Please Provide Course Id"});
  }
  let totalAmount= 0;
  for(const course_id of courses){
    let course;
    try{
      course = await Course.findById(course_id);
      if(!course){
        return res.status(200).json({
          success:false,
          message:"Could not Find the Course",
        })
      }
      // const uid = new mongoose.Types.ObjectId(useId);
      if(course.studentEnrolled.includes(useId)){
        return res.status(200 ).json({
          success:false,
          message:`You have aldready Enrolled in ${course.courseName} course.`
        })
      }
      totalAmount+=course.price;
      
    }catch(err){
      console.log("ERROR AT CALCULATE TOTAL AMOUNT........",err);
      return res.status(500).json({
        success:false,
        message:"Internal Server Error",
        error:err.message
      })
    }
  }
  const currency="INR";
  const options = {
    amount:totalAmount*100,
    currency,
    receipt:Math.random(Date.now()).toString(),
  }
  console.log("option created:::::::::",options);

  //create order
  try{
    const paymentResponse = await instance.orders.create(options);
    console.log("payment",paymentResponse);
    return res.json({
      success:true,
      message:paymentResponse,
    })
  }catch(error){
    console.log("ERROR AT CALCULATE ORDER initialization........",error);
    return res.status(500).json({
      success:false,
      message:"Internal Error:Could not initiate order of payment",
      error:error.message
    })
  } 
}

//verify signature of razorpay and server
exports.verifySignature = async (req,res) => {
    // const webhookSecret = process.env.WEB_HOOK_SECRET;
    const razorpay_order_id = req.body?.razorpay_order_id;
    const razorpay_payment_id = req.body?.razorpay_payment_id;
    const razorpay_signature = req.body?.razorpay_signature;
    const courses = req.body.courses;
    const userId = req.user.id;
    if(!razorpay_order_id || !razorpay_payment_id
      ||!razorpay_signature ||!courses){
        return res.status(404).json({
          success:false,
          message:"Payment Failed due to no Information..."
        });
      }
    
    const body = razorpay_order_id +  "|" + razorpay_payment_id;
    const expectedSignature = crypto.createHmac("sha256",process.env.REZORPAY_SECRET)
    .update(body.toString())
    .digest("hex");
    
    if(expectedSignature==razorpay_signature){
      //enroll the student
      await enrollStudents(courses,userId,res);
      //return res
      return res.status(200).json({
        success:true,
        message:"Payment verified"
      })
    }
    return res.status(200).json({sucess:false,message:"Payment Failed"});
}


const enrollStudents = async (courses,userId,res)=>{
  if(!courses||!userId){
    return res.status(404).json(
      {
        success:false,
        message:"Please Provide the data for useId and Course"
      }
    )
  }

  for(const courseId of courses){
    try {
      const enrollmentCourse = await Course.findByIdAndUpdate(courseId,{
        $push:{studentEnrolled:userId},
        },
        {new:true}  
      );
      if(!enrollmentCourse){
      return res.status(404).json({
      success:true,
      message:"Course Not Found",
      })
      }

      const studentEnrolled = await User.findByIdAndUpdate(userId,
      {$push:{courses:courseId}},
      {new:true}
      )
      if(!studentEnrolled){
      return res.json({
      success:false,
      message:"Student not Found or Course is not added at use Schema",
      })
      }
      const emailResponse =  mailSender(
      studentEnrolled.email,
      `Successfully Enrolled into ${enrollmentCourse.courseName}`,
      courseEnrollmentEmail(enrollmentCourse.courseName,`${studentEnrolled.firstName}`)
      ) 


    } catch (error) {
      return res.status(500).json({
        success:false,
        message:"Internl server Error",
        error:error.message
      })
    }

  }
}


exports.sendPaymentSuccessEmail = async(req, res) =>{
  const {orderId,paymentId, amount} = req.body;
  const userId = req.user.id;
  if(!paymentId||!amount||!orderId||!userId) {
    return res.status(400).json({
      success:false,
      message:"Plases provide full information"
    })
  }
  try {
    const enroolledStudent = await User.findById(userId);
    await mailSender(
      enroolledStudent.email,
      `Payment received`,
      paymentsuccessEmail(`${enroolledStudent.firstName}`,amount/100,orderId,paymentId)
    )
  } catch (error) {
    return res.status(500).json({
      sucess:false,
      message:"Could not sent email"
    })
  }
}












//capture the payment and initiate the razorpay order
// exports.capturePayment = async (req,res) =>{
//     //get valid userId and courseId
//     const {course_id} = req.body;
//     const userId= req.user.id;
    
//     //valid courseID
//     //validation
//     if(!course_id){
//         return res.json({
//             success:false,
//             message:'Please provide valid course Id',
//         })
//     };
//     // valid course Detail
//     let course;
//     try{
//         course = await Course.findById(course_id);
//         if(!course){
//             return res.json({
//                 success:false,
//                 message:'course could not found!!',
//             });
//         }
//         //user aldready the paid or not
//         const uid = new mongoose.Types.ObjectId(userId);
//         if(course.studentEnrolled.includes(uid)){
//             return res.json({
//                 success:false,
//                 message:'Student aldready enrolled for this course',
//             });
//         }
//         //order create
//         const currency = "INR";
//         const amount = course.price;

//         const options = {
//             amount: amount*100,
//             currency,
//             receipt:Math.random(Date.now()).toString(),
//             notes:{
//                 courseId:course_id,
//                 userId,
//             },
//         };

//         try{
//             //initiate teh payment using raxorpay
//             const paymentResponse  = await instance.orders.create(options);
//             res.status(200).json({
//                 success:true,
//                 coueseName:course.courseName,
//                 courseDEscription:course.courseDescription,
//                 thumbnail: course.thumnail,
//                 orderId: paymentResponse.offer_id,
//                 currency: paymentResponse.currency,
//                 amount: paymentResponse.amount,
//             })
//         }catch(error){
//             return res.json({
//                 success:false,
//                 message:'could not initiate order',
//             });
//         }
//     }catch(error){
//         return res.json({
//             success:false,
//             message:error.message,
//         })
//     }
    
// };

// //verify signature of razorpay and server
// exports.verifySignature = async (req,res) => {
//     const webhookSecret = "12345678";

//     const signature = req.headers("x-razorpay-signature");
//     crypto.createHmac("sha256",webhookSecret);
//     shasum.update(JSON.stringify(req.vody));
//     const digest = shasum.digest("hex");
//     if(signature==digest){
//         const {courseId,userID} = req.body.payload.payment.entity.notes;
//         try{
//             //fulfill the action
//             //find the course and enrll the student
//             const enrolledCourse = await Course.findOneAndUpdate(
//                 {_id:courseId},
//                 { $push:{studentEnrolled:userID}},
//                 { new:true},
//             );
//             if(!enrolledCourse){
//                 return res.status(500).json({
//                     success:false,
//                     messagge:'Course not found',
//                 });
//             }

  //             //update teh student's course
//             const enrolledstudent = await User.findOneAndUpdate(
//                 {_id:userID},
//                 {$pus:{courses:courseId}},
//                 {new:true},
//             );
//             //confirmation mail send krna hai
//             const emailResponse = await mailSender(
//                 enrolledstudent.email,
//                 "Congratulations from Codehelp",
//                 "Congratulation , you are onboarde into new codehelp courese"
//             )
//             return res.status(200).json({
//                 success:true,
//                 message:"Signature Varified and course Added",
//             });

//         }catch(error){
//             return res.json({
//                 success:false,
//                 message:'Please provide valid course Id',
//             }); 
//         }
//     }
// }



// // Send Payment Success Email
// exports.sendPaymentSuccessEmail = async (req, res) => {
//     const { orderId, paymentId, amount } = req.body
  
//     const userId = req.user.id
  
//     if (!orderId || !paymentId || !amount || !userId) {
//       return res
//         .status(400)
//         .json({ success: false, message: "Please provide all the details" })
//     }
  
//     try {
//       const enrolledStudent = await User.findById(userId)
  
//       await mailSender(
//         enrolledStudent.email,
//         `Payment Received`,
//         paymentSuccessEmail(
//           `${enrolledStudent.firstName} ${enrolledStudent.lastName}`,
//           amount / 100,
//           orderId,
//           paymentId
//         )
//       )
//     } catch (error) {
//       return res
//         .status(400)
//         .json({ success: false, message: "Could not send email" })
//     }
//   }
  
//   // enroll the student in the courses
//   const enrollStudents = async (courses, userId, res) => {
//     if (!courses || !userId) {
//       return res
//         .status(400)
//         .json({ success: false, message: "Please Provide Course ID and User ID" })
//     }
  
//     for (const courseId of courses) {
//       try {
//         // Find the course and enroll the student in it
//         const enrolledCourse = await Course.findOneAndUpdate(
//           { _id: courseId },
//           { $push: { studentsEnroled: userId } },
//           { new: true }
//         )
  
//         if (!enrolledCourse) {
//           return res
//             .status(500)
//             .json({ success: false, error: "Course not found" })
//         }
  
//         const courseProgress = await CourseProgress.create({
//           courseID: courseId,
//           userId: userId,
//           completedVideos: [],
//         })
//         // Find the student and add the course to their list of enrolled courses
//         const enrolledStudent = await User.findByIdAndUpdate(
//           userId,
//           {
//             $push: {
//               courses: courseId,
//               courseProgress: courseProgress._id,
//             },
//           },
//           { new: true }
//         )
  
//         // Send an email notification to the enrolled student
//         const emailResponse = await mailSender(
//           enrolledStudent.email,
//           `Successfully Enrolled into ${enrolledCourse.courseName}`,
//           courseEnrollmentEmail(
//             enrolledCourse.courseName,
//             `${enrolledStudent.firstName} ${enrolledStudent.lastName}`
//           )
//         )
  
//       } catch (error) {
//         console.log(error)
//         return res.status(400).json({ success: false, error: error.message })
//       }
//     }
//   }