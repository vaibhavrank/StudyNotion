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
    <div className='relative h-auto    flex flex-col items-center'>
        <div className='text-4xl font-semibold text-center'>
            Unlock the
            <HighlightText text={"Power of Code"} />
        </div>
        
        
        <p className='text-center text-richblack-300 text-lg font-semibold mt-3'>
            Learn to buid anythng you imagine
        </p>

        <div className='mt-5  px-1 py-1  flex flex-row rounded-full bg-richblack-800 mb-5 border-richblack-100'>
            {
                tabsName.map((element,index) =>{
                    return (
                     <div
                     className={`text-[16px] flex flex-row items-center gap-2
                     ${currentTab==element ? "bg-richblack-900 text-richblack-5 font-medium"
                     :"text-richblack-200"} rounded-full transition-all duration-200 hover:bg-richblack-900 hover:text-richblack-5
                     px-7 py-2`}
                     key={index}
                     onClick={ () => setMycards(element)}
                     >
                            {element}
                     </div>
                     
                    )
                })
            }
        </div>
        <div className=' translate-y-24 flex flex-row items-center  gap-9 flex-wrap  w-full  '>
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

export default ExploreMore