import React, { useState } from 'react'
import { HomePageExplore } from '../../../data/homepage-explore';
import { HighlightText } from './HighlightText';
import CourseCard from './CourseCard';
const ExploreMore = () => {

    const tabsName = [
        "Free",
        "New to coding",
        "Most popular",
        "Skills paths",
        "Career paths"
    ]
    const [currentTab, setcurrentTab] = useState(tabsName[0]);
    const [courses,setcourses] = useState(HomePageExplore[0].courses);
    const [currenrCard,setcurrentCard] = useState(HomePageExplore[0].courses[0].heading);
    const setMycards = (value)=>{
        setcurrentTab(value);
        const result = HomePageExplore.filter((course)=>course.tag==value);
        setcourses(result[0].courses);
        setcurrentCard(result[0].courses[0].heading);
    }
  return (
    <div className='relative h-auto flex flex-col items-center px-4 md:px-8 lg:px-16'>
        <div className='text-2xl md:text-3xl lg:text-4xl font-semibold text-center'>
            Unlock the
            <HighlightText text={"Power of Code"} />
        </div>
        
        
        <p className='text-center text-richblack-300 text-sm md:text-base lg:text-lg font-semibold mt-3'>
            Learn to build anything you imagine
        </p>

        <div className='md:hidden mt-5 px-1 py-1 flex flex-row flex-wrap justify-center rounded-full bg-richblack-800 mb-5 border-richblack-100'>
            {
                tabsName.map((element,index) =>{
                    return (
                     <div
                     className={`text-sm md:text-[16px] flex flex-row items-center gap-2
                     ${currentTab==element ? "bg-richblack-900 text-richblack-5 font-medium"
                     :"text-richblack-200"} rounded-full transition-all duration-200 hover:bg-richblack-900 hover:text-richblack-5
                     px-4 md:px-7 py-2 cursor-pointer`}
                     key={index}
                     onClick={ () => setMycards(element)}
                     >
                            {element}
                     </div>
                    )
                })
            }
        </div>
        <div className='translate-y-24 flex flex-wrap justify-center items-center gap-6 sm:gap-9 w-full'>
            {
                courses.map((element, index) =>{
                    return(
                        <CourseCard 
                        key={index}
                        data = {element}
                        currenrCard = {currenrCard}
                        setcurrentCard = {setcurrentCard}
                        />
                    )
                })
            }
        </div>
    </div>
  )
}

export default ExploreMore;
