import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form';
import IconBtn from '../../../../common/IconBtn';
import { GrAddCircle } from 'react-icons/gr';
import { useDispatch, useSelector } from 'react-redux';
import { BiRightArrow } from 'react-icons/bi';
import { setCourse, setEditCourse, setStep } from '../../../../../slices/courseSlice';
import toast from 'react-hot-toast';
import { createSection, updateSection } from '../../../../../services/operations/courseDetailsAPI';
import Nestedview from './Nestedview';

const CourseBuilderForm = () => {
    const {register,
        handleSubmit,
        setValue,
        getValues,
        formState: { errors }} = useForm();
    const [editSection,setEditSection] = useState(null);
    const dispatch = useDispatch();
    const {course} = useSelector( (state)=>state.course );
    const [loading , setLoading] = useState(false);
    const {token} = useSelector( (state)=>state.auth);
    const cancelEdit = ()=>{
        setEditSection(false);
    }
    const goBack = ()=>{
        
        dispatch(setEditCourse(true));
        dispatch(setStep(1));
    }
    const goToNext = ()=>{
        if(!course.courseSection.length===0){
            toast.error("please add atleast one section")
            return;
        }
        if(course.courseSection.some( (section) =>section.subSection.length==0)){
            toast.error("Please add atleast one lecture in each section")
            return ;
        }
        dispatch(setStep(3));

    }
    const onSubmit = async (data)=>{
        console.log("ONSUBMIT CREATE SECTION DATA.......",data)
        setLoading(true);
        let result;
        if(editSection){
            result = await updateSection(
                {
                    sectionName:data.sectionName,
                    sectionId: editSection,
                    courseId:course._id,

                },token
            )
        }else{
            
            result = await createSection( 
                {
                    sectionName: data.sectionName,
                    courseId: course._id,
                },token
            )
        }

        //update values
        if(result){
            dispatch(setCourse(result));
            setEditSection(null);
            setValue("sectionName","");
        }
        //setLoading false
        setLoading(false);
    }
    const handleChangeEditSection = (sectionId,sectionName)=>{
        if(editSection==sectionId){
            setEditSection(null);
            setValue("sectionName", "");
            return;
          }
          setEditSection(sectionId);
          setValue("sectionName", sectionName);
    }
    return (
    <div className='text-white'>
        {/* Second step me apka swagat hai */}
        <p>Course Builder</p>
        <form onSubmit={handleSubmit(onSubmit)}>
            <div>
                <label htmlFor='sectionName'>Section Name<sup>*</sup> </label>
                <input  
                    id='sectionName'
                    placeholder='Add Section Name'
                    {...register("sectionName",{required:true})}
                    className='w-full text-black'
                />
                {errors.sectionName && (
                    <span>Section Name is Required</span>
                )}
            </div>
            <div className='mt-10 flex gap-4 items-center'>
                <IconBtn
                    type={"submit"}
                    text={editSection ? "Edit Section Name" : "Create Section"}
                    outline={true}
                    customClasses={"text-yellow-5 flex flex-row items-center border-yellow-5 border-[2px] rounded-md px-2 py-2"} 
                >
                    <GrAddCircle className='text-yellow-5' size={20} />
                </IconBtn>
                {
                    editSection && (
                        <button 
                            type='button'
                            onClick={cancelEdit}
                            value={"Cancel Edit"}
                            className='text-sm underline text-richblack-5'
                        >Cancel Edit</button>
                    )
                }
                
            </div>
        </form>
        {
            (course.courseSection.length>0)&& <Nestedview  handleChangeEditSection={()=>handleChangeEditSection}/>
            
        }
        <div className='flex justify-end gap-x-3 mt-10'>
            <button 
            onClick={()=>{
                    dispatch(setEditCourse(true));
                    dispatch(setStep(1));
                }
            }
            className='rounded-md cursor-pointer flex items-center'>
                Back
            </button>
            <IconBtn text={"Next"}
             customClasses={"bg-yellow-50 font-semibold text-black flex justify-center px-3 py-2 items-center"}
              onClick={goToNext} >
                <BiRightArrow />
            </IconBtn>
        </div>
    </div>
  )
}

export default CourseBuilderForm