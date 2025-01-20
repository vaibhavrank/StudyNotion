import React from 'react'
import Logo1 from "../../../assets/TimeLineLogo/Logo1.svg";
import Logo2 from "../../../assets/TimeLineLogo/Logo2.svg";
import Logo3 from "../../../assets/TimeLineLogo/Logo3.svg";
import Logo4 from "../../../assets/TimeLineLogo/Logo4.svg";
import timelineImage from "../../../assets/Images/TimelineImage.png"
const TimeLineSection = () => {


    const timeline = [
        {
            Logo:Logo1,
            heading: "Leadrship",
            Dsecription:"Fully commited to the success compnt",
        },
        {
            Logo:Logo2,
            heading: "Leadrship",
            Dsecription:"Fully commited to the success compnt",
        },
        {
            Logo:Logo3,
            heading: "Leadrship",
            Dsecription:"Fully commited to the success compnt",
        },
        {
            Logo:Logo4,
            heading: "Leadrship",
            Dsecription:"Fully commited to the success compnt",
        }
    ]

  return (
    <div>
        <div className='flex flex-row gap-15 items-center'>
            <div className='w-[45%] flex flex-col gap-5'>
                {
                    timeline.map( (element,index ) =>{
                        return (
                            <div className='flex flex-col items-start'>
                                <div className='flex flex-row gap-6' key={index}>
                                    <div className='w-[50px] h-[50px] bg-white flex items-center'>
                                        <img src={element.Logo} />
                                    </div>
                                    <div>
                                        <h2 className='font-semibold text-bold'> {element.heading}</h2>
                                        <p className='text-base'>{element.Dsecription}</p>
                                    </div>
                                </div>
                                <div className={`${ index!=3 ? " ml-5 h-[50px] w-[3px] border-dashed  border-l-4" : "h-[0px] w-[0px]" }`}></div>
                            </div>
                        )
                    })
                }
            </div>
            <div className='relative shadow-blue-200 '>
                <img src={timelineImage} 
                alt='timeLineimage'
                className='shadow-white object-cover h-[400px] ' />

                <div className='absolute bg-caribbeangreen-700 flex flex-row text-white uppercase py-10
                left-[50%] translate-x-[-50%] translate-y-[-50%] '>
                    <div className='flex flex-row gap-5 items-center border-r border-caribbeangreen-300 px-7'>
                        <p className='text-3xl font-bold '>10</p>
                        <p className='text-caribbeangreen-300 text-sm'>Years of Experience</p>
                    </div>

                    <div className='flex gap-5 items-center px-7'>
                        <p className='text-3xl font-bold '>250</p>
                        <p className='text-caribbeangreen-300 text-sm'>Type of Course</p>
                    </div>

                </div>
            </div>
        </div>
    </div>
  )
}






export default TimeLineSection;