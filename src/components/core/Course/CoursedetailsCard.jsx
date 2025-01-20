import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom';
import { addToCart } from '../../../slices/cartSlice';
import copy from 'copy-to-clipboard';
import toast from 'react-hot-toast';
import { ACCOUNT_TYPE } from '../../../utils/constants';
const CoursedetailsCard = ({course,setConfirmationModal,handleBuyCourse}) => {
    const {user} = useSelector((state)=>state.profile);
    const {token} = useSelector((st)=>st.auth);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const {
        thumbnail:ThumbnailImage,
        price:CurrentPrice
    } = course



    const handleshare = ()=>{
        copy(window.location.href);
        toast.success("Link Copied To Clipboard")
    }
    //add to cart
    const handelAddToCart = () => {
        if(token){
            if(user.accountType==ACCOUNT_TYPE.INSTRUCTOR){
                toast.error("You are an instructor You Cant Buy a Course.")
                return;
            }
        dispatch(addToCart(course));
        console.log("handelAddToCart -> courseId", course._id)
        }
        else{
            setConfirmationModal({
                text1:"You are not logged in",
                text2:"Please login to add to cart",
                btn1Text:"Login",
                btn2Text:"Cancel",
                btn1Handler: ()=> navigate("/login"),
                btn2Handler:()=>setConfirmationModal(null)
            })
        }
    }
    return (
    <div className='text-white'>
        <img 
        src={ThumbnailImage}
        alt="thumnailimage"
        className='max-h-[300px] min-h-[100px] w-[400px] rounded-xl'
        />
        <div>
            Rs. {CurrentPrice}
        </div>
        <div>
            <button
                onClick={
                    user && course?.studentsEnrolled?.includes(user?._id)
                    ? ()=>navigate("/dashboard/enrolled-courses")
                    :handleBuyCourse
                }
            >
                {
                    user && course?.studentsEnrolled?.includes(user?._id) ? "Go to Course" :
                    "Buy Now"
                }
            </button>
            {
                (!course?.studentsEnrolled?.includes(user?._id)) && <button
                onClick={handelAddToCart} 
                >
                    Add to Cart
                </button>
            }
        </div>
        
    </div>
  )
}

export default CoursedetailsCard