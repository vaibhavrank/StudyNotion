import toast from "react-hot-toast";
import { studentEndpoints } from "../apis";
import { apiConnector } from "../apiconnector";
// import { handler } from "@tailwindcss/line-clamp";
import rzpLogo from "../../assets/Images/rzp.png"
// import { verifySignature } from "../../../SERVER/controllers/Payments";
import { setPaymentLoading } from "../../slices/courseSlice";
import { resetCart } from "../../slices/cartSlice";
// import { useSelector } from "react-redux";
const {
    COURSE_PAYMENT_API,
    COURSE_VERIFY_API,
    SEND_PAYMENT_SUCCESS_EMAIL_API,
} = studentEndpoints
// const userDetails = useSelector((state)=>state.profile);

function loadScript(src){
    return new Promise( (resolve) =>{
        const script = document.createElement("script");
        script.src = src;
        script.onload = ()=>{
            resolve(true);
        }
        script.onerror = ()=>{
            resolve(false);
        }
        document.body.appendChild(script);
    })
}

export async function buyCourse(token,courses,userDetails,navigate,dispatch) {
    const toastId = toast.loading("Loading...");
    try{
        
        
        
        console.log("BUYCOURSE DATA...............",token,courses,userDetails);
        const res = await loadScript("https://checkout.razorpay.com/v1/checkout.js");
        console.log("HIIII,,,,,",res);
        
        if(!res) {
            toast.error("RazorPay SDK failed to load")
            return;
        }
        console.log("Razorpay SDK  is not failed......",courses);

        const orderResponse = await apiConnector("POST", COURSE_PAYMENT_API, {courses},{
            Authorisation: `Bearer ${token}`,
        })
        console.log("orderResponse called........")
        if(!orderResponse.data.success){
            throw new Error(orderResponse.data.message);
        }
        console.log("Optoin created...........",orderResponse);
        const options = {
            key:process.env.RAZORPAY_KEY,
            currency:orderResponse.data.message.currency,
            amount:orderResponse.data.message.price,
            order_id:orderResponse.data.message.id,
            name:"StudyNotion",
            description:"Thank You for Purchasing the course",
            image:rzpLogo,
            prefill:{
                name:`${userDetails.name}`,
                email:`${userDetails.email}`    
            },
            handler:function(response){
                //send successfull mail
                sendPaymentSuccessEmail(response,orderResponse.data.message.amount,token)
                //verify payment
                verifyPayment({...response,courses},token,navigate,dispatch) ; 
            },
        }
        
        const paymentObject = new window.Razorpay(options);
        paymentObject.open();
        paymentObject.on("payment.failed", function (response) {
            toast.error("Payment Failed");
        });
        toast.dismiss(toastId);

    }catch(error){
        console.log("PAYMENT API ERROR.....",error)
        toast.error("COULT NOT MAKE OAYMERNT");
    }
    toast.dismiss(toastId);
}

async function sendPaymentSuccessEmail(response,amount,token){
    try{
        await apiConnector("POST",SEND_PAYMENT_SUCCESS_EMAIL_API,
            {
                orderId:response.razorpay_order_id ,
                paymentId:response.razorpay_payment_id,
                amount,
            },
            {
                Authorisation: `Bearer ${token}`,
            }
        );

    }catch(error){
        console.log("PAYMENT SUCCESS EMAIL ERROR.........",error)
    }
}


async function verifyPayment (bodyData,token, navigate,dispatch){
    const toastId = toast.loading("Verifynig Payment..");
    dispatch(setPaymentLoading(true));
    try {
        const res = await apiConnector("POST",COURSE_VERIFY_API,bodyData,
            {Authorisation:`Bearer ${token}`}
        )
        if(!res.data.success){
            throw new Error(res.data.message);
        }
        toast.success("Payment Successful,You are added to the course");
        navigate("/dashboard/enrolled-courses");
        dispatch(resetCart());
    } catch (error) {
        console.log("Payment verify Error ")
        toast.error("Could not verify payment")
    }
    toast.dismiss(toastId);
    dispatch(setPaymentLoading(false));
}