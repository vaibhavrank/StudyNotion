import React, { useEffect, useState } from 'react'
import { apiConnector } from '../../services/apiconnector';
import { ratingsEndpoints } from '../../services/apis';
import toast from 'react-hot-toast';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import ReactStars from "react-rating-stars-component";
// import RatingStars from './RatingStarts';
import {FaStar} from "react-icons/fa"
const ReviewSlider = () => {
    const [review,setReview] = useState([]);
    const [loading,setLoading] = useState(false);
    const {REVIEWS_DETAILS_API} = ratingsEndpoints
    useEffect(() => {
        const fetchReview = async () => {
            const toastId = toast.loading("Loading...");
            setLoading(true)
            try {
                const res = await apiConnector("GET", REVIEWS_DETAILS_API);
                console.log("GET REVIEW API RESPONSE............", res);
                if (!res) {
                    toast.error("Review fetching failed.......", { id: toastId });
                } else {
                    toast.success("Reviews fetched successfully.", { id: toastId });
                    // Handle success - set reviews
                    setReview(res.data.data);
                }
            } catch (error) {
                console.log("FETCH API ERROR.....", error);
                toast.error("Review fetching failed.......", { id: toastId });
            }
            setLoading(false);
            toast.dismiss(toastId);
        };

        fetchReview();
    }, []);


  return (
        <div>
            {review.length === 0 ? (
                <p>No reviews found</p>
            ) : (
                <Swiper
                    spaceBetween={50}
                    slidesPerView={3}
                    onSlideChange={() => console.log('slide change')}
                    onSwiper={(swiper) => console.log(swiper)}
                >

                    {
                        review.map((review,index) =>(
                            <SwiperSlide
                            
                            key={index} >
                                <div>
                                    <img src={review.user.image} className='aspect-square w-[75px] rounded-full object-cover' />
                                    <p>{review.user.firstName} {review.user.lastName}</p>
                                    <ReactStars
                                    count={5}
                                    size={20}
                                    value={review.rating}
                                    edit={false}
                                    activeColoe="#ffd700"
                                    fullIcon={<FaStar/>}
                                    emptyIcon={<FaStar />}

                                    /><span>{review.rating}</span>
                                    <p>{review.course?.courseName}</p>
                                    <p>{review.review}</p>
                                </div>
                            </SwiperSlide>
                        ))
                    }
                </Swiper>
            )
        }
    </div>
  )
}

export default ReviewSlider