import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import RatingStars from '../../common/RatingStarts';
import GetAvgRating from '../../../utils/avgRating'
// import RatingStars from 'react-rating-stars-component'
const Course_Card = ({course,Height}) => {
    const [avgReviewCount,setAvgReviewCount] = useState(0);
    useEffect(()=>{
        const count = GetAvgRating(course.ratingAndReviews);
        setAvgReviewCount(count);
    },[course])
  return (
    <div>
        <Link to={`/courses/${course._id}`} >
            <div>
                <div>
                    <img
                    src={course?.thumbnail}
                    alt="course Thumbnaol"
                    className={`${Height} w-full rounded-xl object-cover    `}
                    />
                </div>
                <div>
                    <p>{course?.courseName}</p>
                    <p>{course?.instructor?.firstName}{course?.instructor?.lastName}</p>
                    {/* <p>{course?.catagory?.name}</p> */}
                    <div>
                        <span>{avgReviewCount || 0}</span>
                        <RatingStars
                            Review_Count={course?.ratingAndReview[0]?.rating }
                        />
                        
                        <span>{course?.ratingAndReview[0]?.rating }</span>
                    </div>
                    <p>{course.price}</p>
                </div>
            </div>
        </Link>
    </div>
  )
}

export default Course_Card