import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useSelector } from 'react-redux';
import { createRating } from '../../../../services/operations/courseDetailsAPI';
// import {getValues}
import ReactStars from "react-rating-stars-component";
// import RatingStars from '../../../common/RatingStarts' // Assuming this is an alternative to ReactStars
import IconBtn from '../../../common/IconBtn'; // Ensure this component is styled well

const CourseReviewModal = ({ setReviewModal }) => {
  const { token } = useSelector((state) => state.auth);
  const { user } = useSelector((state) => state.profile);
  const { courseEntireData } = useSelector((state) => state.viewCourse);
  const {
    register,
    handleSubmit,
    setValue,
    getValues,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    setValue("courseExperience", "");
    setValue("courseRating", 0);
  }, [setValue]);

  const onSubmit = async (data) => {
    try {
      // You'll need to dispatch an action here or call the service directly
      // Assuming createRating is an async function that handles API call
      await createRating({
        courseId: courseEntireData._id,
        rating: data.courseRating,
        review: data.courseExperience,
      }, token);
      setReviewModal(false);
    } catch (error) {
      console.error("Error submitting review:", error);
      // Display error message to user
    }
  };

  const ratingChanged = (newRating) => { // Renamed for consistency with ReactStars callback
    setValue("courseRating", newRating);
  };

  return (
    <div className='fixed inset-0 z-[1000] !mt-0 grid place-items-center overflow-auto bg-white bg-opacity-10 backdrop-blur-sm'>
      <div className='w-11/12 max-w-[500px] rounded-lg border border-richblack-400 bg-richblack-800 p-6'>
        {/* Modal Header */}
        <div className='flex items-center justify-between rounded-t-lg bg-richblack-700 p-5'>
          <p className='text-xl font-semibold text-richblack-50'>Add Review</p>
          <button
            onClick={() => setReviewModal(false)}
            className='text-2xl text-richblack-50 transition-all duration-200 hover:text-richblack-25'
          >
            &times; {/* Close icon */}
          </button>
        </div>

        {/* Modal Body */}
        <div className='p-8'>
          <div className='flex items-center gap-x-4 mb-6'>
            <img
              src={user?.image}
              alt='User Avatar'
              className='aspect-square w-[50px] rounded-full object-cover'
            />
            <div>
              <p className='font-semibold text-richblack-50'>{user?.firstName} {user?.lastName}</p>
              <p className='text-sm text-richblack-300'>Posting Publicly</p>
            </div>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className='flex flex-col gap-y-4'>
            {/* Star Rating */}
            <ReactStars
              count={5}
              onChange={ratingChanged}
              size={32} // Slightly larger stars
              activeColor="#ffd700"
              isHalf={true} // Allow half ratings
              emptyIcon={<i className="far fa-star"></i>} // Font Awesome icons for empty
              halfIcon={<i className="fa fa-star-half-alt"></i>} // Font Awesome icons for half
              fullIcon={<i className="fa fa-star"></i>} // Font Awesome icons for full
              classNames="mx-auto" // Center the stars
            />
            {/* Hidden input to store rating value for form submission */}
            <input
              value={setValue("courseRating", getValues("courseRating"))} // Ensure value is set
              {...register("courseRating", { required: true, min: 0.5 })}
              type="hidden"
            />
            {errors.courseRating && <span className='text-pink-200 text-sm'>* Please provide your rating (at least 0.5 stars)</span>}

            {/* Review Textarea */}
            <div className='flex flex-col gap-y-2'>
              <label htmlFor="courseExperience" className='text-sm text-richblack-25'>
                Add Your Experience <sup className='text-pink-200'>*</sup>
              </label>
              <textarea
                id='courseExperience'
                placeholder='Describe your experience with the course'
                {...register("courseExperience", { required: true })}
                className='form-style min-h-[130px] w-full rounded-md bg-richblack-700 p-3 text-richblack-5 resize-y'
              />
              {errors.courseExperience && (
                <span className='text-pink-200 text-sm'>* Please add your experience with the course.</span>
              )}
            </div>

            {/* Action Buttons */}
            <div className='mt-6 flex justify-end gap-x-4'>
              <button
                onClick={() => setReviewModal(false)}
                type="button" // Important for non-submit buttons in a form
                className='cursor-pointer rounded-md bg-richblack-700 py-2 px-5 font-semibold text-richblack-50 transition-all duration-200 hover:bg-richblack-600'
              >
                Cancel
              </button>
              <IconBtn
                text="Save"
                type="submit"
                // Assuming IconBtn handles styling, otherwise add direct classes
                // You might need to adjust IconBtn to accept `disabled` prop if it doesn't already
              />
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CourseReviewModal;