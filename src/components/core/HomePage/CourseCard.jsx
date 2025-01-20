import React from 'react'
import {  IoTrendingUp } from 'react-icons/io5'
import { MdAccountTree } from 'react-icons/md'
import { HighlightText } from './HighlightText'

const CourseCard = ({data,currenrCard, setcurrentCard}) => {

  return (
    <div className={`flex flex-col  w-[400px] h-[300px] justify-around   p-5 gap-1 transition-al duration-200 hover:scale-95
         ${currenrCard===data.heading? "bg-richblack-5 text-richblack-400 shadow-[12px_12px_0px] shadow-[#FFD60A]"
         :"bg-richblack-700 text-richblue-100"}`} 
     onMouseOver={()=>setcurrentCard(data.heading)}
     >
        <p className='text-yellow-50 font-semibold text-2xl '>{data.heading} </p>
        <p >{data.description }</p>
        <div className='w-full h-0 border-dashed border-t-2'></div>
        <div className='flex flex-row gap-3 justify-around'>
            <div className='flex items-center gap-3'>
                <IoTrendingUp />
                <p>{data.level}</p>
            </div>

            <div className='flex items-center gap-3 '>
                <MdAccountTree />
                <p>{data.lessionNumber} Lessions</p>
            </div>
        </div>
    </div>
  )
}

export default CourseCard