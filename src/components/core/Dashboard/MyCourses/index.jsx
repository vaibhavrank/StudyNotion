import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { fetchInstructorCourses } from '../../../../services/operations/courseDetailsAPI';
import IconBtn from '../../../common/IconBtn';
import CourseTable from './CourseTable';

const MyCourses = () => {
    const { token } = useSelector((state) => state.auth);
    const navigate = useNavigate();
    const [courses, setCourses] = useState([]);

    useEffect(() => {
        const fetchCourse = async () => {
            const result = await fetchInstructorCourses(token);
            if (result) {
                console.log("RESULT AT MY COURSES", result);
                setCourses(result);
            }
        };
        fetchCourse();
    }, []);

    return (
        <div className='text-white p-6 lg:p-8'> {/* Added padding for overall content */}
            <div className='flex justify-between items-center mb-6'> {/* Spacing and alignment for header and button */}
                <h1 className='text-3xl font-semibold text-richblack-50'>My Courses</h1> {/* Larger, bolder heading */}
                <IconBtn
                    text="Add Courses"
                    onClick={() => navigate("/dashboard/add-course")}
                    customClasses="flex items-center gap-x-2 bg-yellow-50 text-richblack-900 font-medium py-2 px-4 rounded-md hover:scale-95 transition-all duration-200" // Styled the button
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                </IconBtn>
            </div>

            {/* Render the CourseTable component with fetched courses */}
            <div className='mt-8'> {/* Add some top margin before the table */}
                {courses ? ( // Check if courses is not null (has been fetched)
                    <CourseTable courses={courses} setCourses={setCourses} />
                ) : (
                    <div className='text-center text-xl text-richblack-200 py-10'>Loading courses...</div> // Loading state
                )}
            </div>
        </div>
    );
};

export default MyCourses;