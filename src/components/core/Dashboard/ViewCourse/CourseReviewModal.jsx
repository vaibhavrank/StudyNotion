import React, { useEffect } from 'react'
import { useForm } from 'react-hook-form';
import { useSelector } from 'react-redux'
import ReactStars from "react-rating-stars-component";
import RatingStars from '../../../common/RatingStarts'
import { createRating } from '../../../../services/operations/courseDetailsAPI';
import IconBtn from '../../../common/IconBtn';
const CourseReviewModal = ({setReviewModal}) => {
  const {token} = useSelector((state)=>state.auth);
  const {user} =  useSelector((state)=>state.profile);
  const {courseEntireData} = useSelector( (state)=>state.viewCourse);
  const {
    register,
    handleSubmit,
    getValues,
    setValue,
    formState: {errors},

  } = useForm();

  useEffect( ()=>{
    setValue("courseExperience","");
    setValue("courseRating",0);

  },[]);
  const onSubmit = async (data)=>{
    // console.log("RATINF DATA.............",data.courseRating)
    try {
      await createRating({
          courseId: courseEntireData._id,
          rating: data.courseRating,
          review: data.courseExperience,
      }, token);
      setReviewModal(false);
  } catch (error) {
      console.error("Error submitting review:", error);
  }
  }


  const ratingChange = (newRating) => {
    setValue("courseRating",newRating);
  };
  return (
    <div className='text-white'>
      <div>
        {/* Modal Header */}
        <div>
          <p>Add Review</p>
          <button
          onClick={() => setReviewModal(false)}>Close</button>

        </div>

        {/* Modal body */}
        <div>
          <div>
            <img 
              src={user.image}
              alt='user Image'
              className='aspect-square w-[50px] rounded-full object-cover'

            />
            <div>
              <p>{user?.firstName} {user?.lastName }</p>
              <p>Posting Publicly</p>
            </div>

          </div>
          
          <form
          onSubmit={handleSubmit(onSubmit)}
          >
          
          <ReactStars 
            count={5}
            onChange={ratingChange}
            size={24}
            activeColor="#ffd700"

          />
          <input value={getValues().courseRating} {...register("courseRating", { required: true })} type="hidden" />
          {errors.courseRating && <span className='text-pink-200 text-[11px]'>* Please provide your rating</span>}
          <div>
            <label htmlFor="courseExperience">
              Add Your Experince
            </label>
            <textarea 
            id='courseExperience'
            placeholder='Add Your Experience'
            {...register("courseExperience",{required:true})}
            className='form-style min-h-[130px] rounded-full'
            />
            {
              errors.courseExperience && (
                <span>Please add your Experince</span>
              )
            }
          </div>
          {/* <Cancel and save button */}
          <div className='flex gap-x-5'>
            <button
              onClick={() => {setReviewModal(false)
                console.log("Cancel called..........")
              }}
            >Cancel</button>




            <button
              // text="Save"
              type={"submit"}
            >Save</button>
          </div>

          </form>

        </div>
      </div>
    </div>
  )
}

export default CourseReviewModal