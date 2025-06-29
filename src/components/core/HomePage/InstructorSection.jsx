import React from 'react'
import instructor from "../../../assets/Images/Instructor.png"
import { HighlightText } from './HighlightText'
import { FaArrowRight } from 'react-icons/fa'
import CTAButton from "../HomePage/Button"
const InstructorSection = () => {
  return (
    <div className='mt-16'>
        <div className=' flex flex-col md:flex-row gap-20 items-center'>
            <div className=''>
                <img src={instructor} 
                alt="Instructor image" 
                className='shadow-white'
                />

            </div>
            <div className='flex flex-col items-center gap-10'>
                <div className='text-4xl font-semibold w-[50%]'>
                    Become an 
                    <HighlightText text={"Instructor"} />
                </div>
                <p className='font-medium text-[16px] w-[80%] text-richblack-300'>
                    Instructors from around the world teach millions of students on StudyNotion.
                    We provide the tools and skills to teach what you love.
                </p>
                <div className='w-fit'>
                    <CTAButton active={true} linkto={"/signup"} >
                        <div className='flex flex-row gap-2 items-center'>
                            Start Learning Today
                            <FaArrowRight />
                        </div>
                    </CTAButton>
                </div>
            </div>
        </div>
    </div>
  )
}

export default InstructorSection;