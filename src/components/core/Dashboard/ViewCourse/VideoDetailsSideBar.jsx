import React, { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom';
import IconBtn from '../../../common/IconBtn';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
const VideoDetailsSideBar = ({setReviewModal}) => {
  const [activeStatus,setActiveStatus] = useState("");
  const [videobarActive,setVideobarActive] = useState("");
  const navigate = useNavigate();
  const {sectionId,subsectionId} = useParams();
   const{
    courseSectionData,
    courseEntireData,
    totalNoOfLectures,
    completedLectures
   } = useSelector((state)=>state.viewCourse);
   const location = useLocation();
  useEffect( ()=>{
   ;(()=>{
      if(!courseSectionData.length){
        // console.log("COURSESECTION DATA IS ARRAY OF SIZZE 0..................");
        return;
      }else{
        const currentSectionIndex = courseSectionData.findIndex(
          (data)=> data._id==sectionId
        )
        const currentSubSectionIndex = courseSectionData?.[currentSectionIndex]?.subSection
        .findIndex((data)=>data._id==subsectionId)
        const activeSubsectionId = courseSectionData[currentSectionIndex]?.subSection?.
        [currentSubSectionIndex]?._id;
        // setcurrent section here
        // set current subsection here
        setActiveStatus(courseSectionData[currentSectionIndex]?._id);
        setVideobarActive(String(activeSubsectionId).trim());
        // console.log(videobarActive);
        // console.log(activeStatus);
      }
   })() 
  },[courseSectionData,courseEntireData,location.pathname]);
  return (
    <div className="text-white ">
      {/* for buttons and heading */}
      <div>
        {/* for button  */}
        <div>
          <button
            onClick={()=>{
              navigate("/dashboard/enrolled-courses"); 
            }}
          >
            Back
          </button>
          <button
          onClick={()=>{
            setReviewModal(true);
          }}
          >Add Review</button>
            
        </div>
        {/* for heading */}
        <div>
          <p>{courseEntireData?.courseName}</p>
          <p>{completedLectures?.length}/{totalNoOfLectures}</p>
            
        </div>
      </div>  

      {/* for nested view section and sub sections */}
      <div className='w-full'>
        {
          courseSectionData.length && courseSectionData?.map((section,index)=>(
            <div
              onClick={()=>{
                setActiveStatus(section._id)
                console.log(activeStatus);
              }}
              key={index}
            >
              {/* section  */}
              <div>
                <div>
                  {section?.sectionName}
                </div> 
              </div>
              {/* sub sections  */}
              <div>
                
                {
                  activeStatus===section._id && (
                    <div>
                      {
                        section.subSection?.map((topic,index)=>(
                            <div className={`flex gap-5 p-5 ${ videobarActive === topic._id ? "bg-yellow-200 text-richblack-900" : "bg-richblack-900 text-white"}`}
                            key={index} 
                            onClick={
                              ()=> {
                                  setVideobarActive(topic._id)
                                  navigate(`/view-course/${courseEntireData?._id}/section/${section?._id}/sub-section/${topic?._id}`)  
                                  
                              }
                          
                          }

                            >
                              <input type='checkbox'
                              checked={completedLectures.includes(topic._id)}
                              readOnly={true}  />
                              <span>{topic.title}</span>
                            </div>

                        ))
                      }
                    </div>
                  )
                }
              </div>
            </div>
          ))
        }
      </div>
    </div>
  )
}

export default VideoDetailsSideBar