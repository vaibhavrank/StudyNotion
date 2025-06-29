import React from 'react'
import { HighlightText } from './HighlightText'
import know_your_progress from "../../../assets/Images/Know_your_progress.png"
import compare_with_others from "../../../assets/Images/Compare_with_others.png"
import plan_your_lession from "../../../assets/Images/Plan_your_lessons.png"
import CTAButton from "../HomePage/Button"
export const LearningLanguageSection = () => {
  return (
    <div className='mt-[130px] mb-24 '>

      <div className='flex flex-col gap-5 items-center'>
        <div className='text-4xl font-semibold text-center'>
          Your swiss Kinfe for
          <HighlightText text={" Learning any language" } />
        </div>
        <div className='text-center text-richblack-600 mx-auto text-base mt-3 w-[70%]'>
        Using spin making learning multiple languages easy. with 20+ 
        languages realistic voice-over, progress tracking, custom schedule and more.
        </div>
        <div className='flex flex-col lg:flex-row items-center justify-center mt-5'>
          <img 
            src={know_your_progress}
            alt='KnowYourProgressImage'
            className='object-contain md:-mr-32 ' 
           />
          <img 
            src={compare_with_others}
            alt='compareWithOtehrs'
            className='object-contain'  
          />
          <img 
            src={plan_your_lession}
            alt='PlanWithOthers'
            className='object-contain md:-ml-48' 
          />

        </div>

        <div className='w-fit'>
          <CTAButton  active={true} linkto={"/signup"} >
            <div>Learn More</div>
          </CTAButton>
          
        </div>

      </div>
    </div>
  )
}
