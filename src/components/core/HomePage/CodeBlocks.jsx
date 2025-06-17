import React from 'react'
import { TypeAnimation } from 'react-type-animation';
import CTAButton from "./Button";
// import { HighlightText } from './HighlightText';
import { FaArrowRight } from 'react-icons/fa';
 const CodeBlocks = ({
    position, heading, subheading, ctabtn1,ctabtn2, codeblock, backgroundGradient, codeColor
}) => {
  return (
    <div className={`flex flex-col sm:flex-row ${position} my-20 mx-auto justify-between gap-10 max-w-full px-4 md:px-8 lg:px-16`}>

        {/* Section 1 */}
        <div className='w-full sm:w-[50%] flex flex-col gap-8'>
            {heading}
            <div className='text-richblack-300 font-bold'>
                {subheading}
            </div>

            <div className='flex gap-7 mt-7 flex-wrap'>
            <CTAButton active={ctabtn1.active} linkto={ctabtn1.linkto} >
                <div className='flex gap-2 items-center'>
                    {ctabtn1.btnText}
                    <FaArrowRight />
                </div>
            </CTAButton>
            <CTAButton active={ctabtn2.active} linkto={ctabtn2.linkto} >
                <div className='flex gap-2 items-center'>
                    {ctabtn2.btnText}
                </div>
            </CTAButton>
            </div>
        </div>
        {/*section 2 */ }
        <div className='h-fit flex flex-row text-10[px] w-full py-4 sm:w-[80%] md:w-[60%] lg:w-[500px] overflow-x-auto'>
            {/**HW BG GRADIENT */}
            <div className='text-center flex flex-col w-[10%] text-richblack-400 font-inter font-bold'>
                {Array.from({ length: 11 }, (_, i) => <p key={i}>{i + 1}</p>)}
            </div>
            <div className={`w-[90%] flex flex-col gap-2 font-bold font-mono ${codeColor} pr-2 relative`}>
            <div className={` ${backgroundGradient}`}></div>
           <TypeAnimation
            sequence={[codeblock, 2000, ""]}
            repeat={Infinity}
            cursor={true}
           
            style = {
                {
                    whiteSpace: "pre-line",
                    display:"block",
                    overflowX:"hidden",
                    fontSize:"16px",
                }
            }
            omitDeletionAnimation={true}
           />
        </div>
        </div>
    </div>
  )
}

export default CodeBlocks;
