import React ,{useEffect, useState}from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { Outlet, useParams } from 'react-router-dom';
import { getFullDetailsOfCourse } from '../services/operations/courseDetailsAPI';
import { setCompletedLectures, setCourseSectionData, setEntireCourseData, setTotalNoOfLectures } from '../slices/viewCourseSlice';
import CourseReviewModal from '../components/core/Dashboard/ViewCourse/CourseReviewModal';
import VideoDetailsSideBar from '../components/core/Dashboard/ViewCourse/VideoDetailsSideBar';

const ViewCourse = () => {

    const [reviewModal,setReviewModal] = useState(false);
    const {courseId} = useParams();
    const {sectionId} = useParams();
    const {token} = useSelector((state)=>state.auth);
    const dispatch = useDispatch();
    useEffect( ()=>{
        console.log("REVIEW MODAL CHANGE......",reviewModal);
    },[reviewModal]);
    useEffect( ()=>{
        const setCourseSpecificDetails = async ()=>{
            const courseData = await getFullDetailsOfCourse(courseId,token);
            dispatch(setCourseSectionData(courseData?.courseDetails?.courseSection));
            dispatch(setEntireCourseData(courseData?.courseDetails));
            console.log("COMPLETES LECTURES..........",courseData.completedVideos);
            dispatch(setCompletedLectures(courseData?.completedVideos));
            let lectures = 0;
            courseData?.courseDetails?.courseSection?.forEach( (sec)=>{
                lectures+=sec.subSection.length;
            })
            dispatch(setTotalNoOfLectures(lectures));

        }
        setCourseSpecificDetails();
    },[])

    
  return (
    <>
        <div className='flex'>
             <VideoDetailsSideBar  className="h-full w-[20%]  text-white" setReviewModal={setReviewModal}  />
            <div className=''>
                <Outlet />
            </div>
            
        </div>
        {console.log("reviewModal:", reviewModal)}
        {reviewModal && <CourseReviewModal  className="z-50"
        setReviewModal={setReviewModal} /> }
        
    </>
   
  )
}

export default ViewCourse