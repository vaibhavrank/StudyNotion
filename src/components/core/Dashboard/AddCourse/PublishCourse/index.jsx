import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import IconBtn from '../../../../common/IconBtn';
import { resetCourseState, setCourse, setStep } from '../../../../../slices/courseSlice';
import { COURSE_STATUS } from '../../../../../utils/constants';
import { useNavigate } from 'react-router-dom';
import { editCourseDetails } from '../../../../../services/operations/courseDetailsAPI';

const PublishCourse = () => {

    const {course} = useSelector((state) =>state.course)
    const {token} = useSelector((state) =>state.auth)
    const dispatch = useDispatch();
    const {register, handleSubmit,setValue,formState:{errors},getValues} = useForm();
    const [loading,setLoading] = useState(false);
    const navigate = useNavigate();
    useEffect( ()=>{
        if(course?.status == COURSE_STATUS.PUBLISHED){
            setValue("public",true);
        }
    },[])

    const goToCourses = ()=>{
        dispatch(resetCourseState())
        navigate("/dashboard/my-courses");
    }

    const handleCoursePublish = async ()=>{
         if(course?.status === COURSE_STATUS.PUBLISHED && getValues("public")==true
            || course.status === COURSE_STATUS.DRAFT && getValues("public")==false ){
                //no changes in form no api call
                goToCourses();
                return;
         }

         //if fprm updated
        const formData = new FormData();
        formData.append("courseId",course._id);
        const courseStatus = getValues("public")? COURSE_STATUS.PUBLISHED :COURSE_STATUS.DRAFT;
        formData.append("status",courseStatus);

        setLoading(true);
        const result = await editCourseDetails(formData,token);
        console.log("RESULT AFETER SAVE CHANGES..........",result);
        
        if(result){
            dispatch(setCourse(result));
            goToCourses();
        }
        setLoading(false);
    }

    const onSubmit = ()=>{
        handleCoursePublish();
    }
    const goBack = ()=>{
        dispatch(setStep(2))

    }
  return (
    <div className='rounded-md flex w-full gap-y-3 flex-col items-start justify-center border-[1px] bg-richblack-800 border-richblack-700 '>
        <p>Publish Course</p>
        <form onSubmit={handleSubmit(()=>onSubmit())}>
            <div>
                <label htmlFor='public'>
                    <input 
                        type='checkbox'
                        id='public'
                        {...register("public")}
                        className='rounded h-4 w-4'
                    />
                    <span className='ml-3'>Make this course as Public</span>
                </label>
            </div>
            
            <div className='flex gap-x-3 justify-end'>
                <button 
                    disabled={loading}
                    type='button'
                    onClick={()=>goBack()}
                    className='px-3 py-2 flex items-center bg-white rounded-md'
                >
                    Back
                </button>
                <IconBtn customClasses={"px-3 py-2 bg-yellow-5 rounded-md "} type={"submit"} disabled={loading} text={"Save Changes"} /> 
            </div>
        </form>
    </div>
  )
}

export default PublishCourse