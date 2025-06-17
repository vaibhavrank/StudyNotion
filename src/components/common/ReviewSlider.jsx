import React, { useEffect, useState } from 'react'
import { apiConnector } from '../../services/apiconnector';
import { ratingsEndpoints } from '../../services/apis';
import toast from 'react-hot-toast';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay,Pagination,Navigation } from 'swiper/modules';
import 'swiper/css';
// import './slider.css'
import "swiper/css/free-mode"
import "swiper/css/pagination"
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
                // console.log("GET REVIEW API RESPONSE............", res);
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
    const pagination = {
        clickable: true,
        renderBullet: function (index, className) {
          return '<span class="' + className + '">' + (index + 1) + '</span>';
        },
      };

  return (
        <div className='flex flex-wrap text-white'>
            {review.length === 0 ? (
                <p>No reviews found</p>
            ) : (
                <Swiper
                    spaceBetween={50}
                    slidesPerView={5}
                    pagination={pagination}
                    navigation={true}
                    modules={[Autoplay,Pagination,Navigation]}
                    // onSlideChange={() => console.log('slide change')}
                    // onSwiper={(swiper) => console.log(swiper)}
                    autoplay={{
                        delay:2500,
                        disableOnInteraction:false }
                        }
                        breakpoints={{
                            0:{slidesPerView:1},
                            320: { slidesPerView: 1 },  // For very small screens
                            400: { slidesPerView: 2 },  // For mobile screens
                            768: { slidesPerView: 3 },  // For tablets
                            1024: { slidesPerView: 5 }  // For larger screens
                        }}
                    className='mySwiper'
                    // dynamicBullets={true}
                    
                >
                    <style>{`
                        
                        .swiper-pagination-bullet {
                        width: 20px;
                        height: 20px;
                        text-align: center;
                        line-height: 20px;
                        font-size: 12px;
                        color: richblack-25;
                        opacity: 1;
                        background: rgba(0, 0, 0, 0.2);
                        }

                        .swiper-pagination-bullet-active {
                        color: #fff;
                        background: #007aff;
                        }

                    `}</style>
                    {
                        review.map((review,index) =>(
                            <SwiperSlide
                            
                            key={index} >
                                <div className='mx-auto flex flex-col items-center'>
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