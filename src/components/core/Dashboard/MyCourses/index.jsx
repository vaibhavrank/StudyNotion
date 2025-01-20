import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom';
import { fetchInstructorCourses } from '../../../../services/operations/courseDetailsAPI';
import IconBtn from '../../../common/IconBtn';
import CourseTable from './CourseTable';

const MyCourses = () => {
    
    const {token} = useSelector((state)=>state.auth);
    const navigate = useNavigate();
    const [courses,setCourses] = useState([]);
    
    useEffect( ()=>{
        const fetchCourse = async ()=>{
            const result = await fetchInstructorCourses(token);
            if(result){
                console.log("RESULT AT MY COURSES",result)
                setCourses(result);
            }
        }
        fetchCourse();
    },[]);


    
  return (
    <div className='text-white'>
        <div>
            <h1>My Courses</h1>
            <IconBtn
                text="Add Courses"
                onClick={()=>navigate("/dashboard/add-course")} 
            >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-richblack-900" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round"  strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
        </IconBtn >
        </div>
        <div>
            {courses && <CourseTable courses={courses} setCourses={setCourses} />}
            </div>
    </div>
  )
}

export default MyCourses