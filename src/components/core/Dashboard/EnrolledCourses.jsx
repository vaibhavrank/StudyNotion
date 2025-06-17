import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getUserCourses } from '../../../services/operations/profileAPIs';
import ProgressBar from "@ramonak/react-progress-bar";
import { Table, Thead, Tbody, Tr, Th, Td } from 'react-super-responsive-table';
import 'react-super-responsive-table/dist/SuperResponsiveTableStyle.css'; // Ensure this is imported
import { useNavigate } from 'react-router-dom';
import { GiNotebook } from 'react-icons/gi'; // Example icon for "no courses"

const EnrolledCourses = () => {
    const { token } = useSelector((state) => state.auth);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [enrolledCourses, setEnrolledCourses] = useState(null);
    const [loading, setLoading] = useState(true); // Add loading state

    useEffect(() => {
        const fetchEnrolledCourses = async () => {
            setLoading(true); // Start loading
            try {
                const response = await getUserCourses(token, dispatch);
                // Ensure response.courses is an array or default to empty array
                setEnrolledCourses(response?.courses || []); 
            } catch (error) {
                console.error("Error fetching enrolled courses:", error);
                setEnrolledCourses([]); // Set to empty array on error
            } finally {
                setLoading(false); // End loading
            }
        };
        fetchEnrolledCourses();
    }, [token, dispatch]); // Added dispatch to dependency array as it's used inside useEffect

    // --- Loading State ---
    if (loading) {
        return (
            <div className='grid min-h-[calc(100vh-3.5rem)] place-items-center'>
                <div className='spinner'></div> {/* Assuming you have a CSS spinner class */}
            </div>
        );
    }

    return (
        <div className='mx-auto w-11/12 max-w-[1000px] py-10'>
            <h1 className='mb-14 text-3xl font-medium text-richblack-5'>
                Enrolled Courses
            </h1>

            {!enrolledCourses || enrolledCourses.length === 0 ? (
                <div className='grid h-[10vh] w-full place-content-center text-richblack-100 text-center gap-y-4'>
                    <GiNotebook className='text-6xl mx-auto text-richblack-200' />
                    <p className='text-lg font-medium'>
                        You haven't enrolled in any courses yet.
                    </p>
                    <p className='text-richblack-300'>
                        Explore our <span className='text-yellow-50 font-semibold cursor-pointer' onClick={() => navigate('/catalog')}>catalog</span> to find your next learning journey!
                    </p>
                </div>
            ) : (
                <div className='my-8'>
                    <Table className='min-w-full rounded-xl border border-richblack-800 bg-richblack-800'>
                        <Thead>
                            <Tr className='flex gap-x-10 rounded-t-md border-b border-richblack-700 px-6 py-2'>
                                <Th className='flex-1 text-left text-sm font-medium uppercase text-richblack-100'>Course Name</Th>
                                <Th className='text-left text-sm font-medium uppercase text-richblack-100 w-[150px]'>Duration</Th>
                                <Th className='text-left text-sm font-medium uppercase text-richblack-100 w-[250px]'>Progress</Th>
                            </Tr>
                        </Thead>
                        <Tbody>
                            {enrolledCourses.map((course) => (
                                <Tr
                                    key={course._id}
                                    className='flex gap-x-10 border-b border-richblack-700 px-6 py-8 transition-all duration-200 hover:bg-richblack-700 cursor-pointer'
                                    onClick={() => {
                                        // Ensure courseSectionData and subSection exist before navigating
                                        const firstSection = course?.courseSection?.[0];
                                        const firstSubSection = firstSection?.subSection?.[0];

                                        if (firstSection && firstSubSection) {
                                            navigate(
                                                `/view-course/${course._id}/section/${firstSection._id}/sub-section/${firstSubSection._id}`
                                            );
                                        } else {
                                            // Handle case where course has no sections/subsections or incomplete data
                                            console.warn("Course has no viewable content or incomplete data:", course);
                                            // Optionally, navigate to a course overview page or show an alert
                                            navigate(`/courses/${course._id}`); // Example: navigate to a generic course detail page
                                        }
                                    }}
                                >
                                    <Td className='flex flex-1 gap-x-4'>
                                        <img
                                            src={course.thumbnail}
                                            alt="Course Thumbnail"
                                            className='h-[52px] w-[90px] rounded-lg object-cover'
                                        />
                                        <div className='flex flex-col gap-1'>
                                            <p className='font-semibold text-richblack-5'>{course.courseName}</p>
                                            <p className='text-xs text-richblack-300'>{course.courseDescription.substring(0, 50)}...</p> {/* Truncate description */}
                                        </div>
                                    </Td>
                                    <Td className='text-sm text-richblack-100 w-[150px]'>
                                        {/* Convert totalDuration to a more readable format if it's seconds */}
                                        {course?.totalDuration ? `${Math.floor(course.totalDuration / 60)}m ${course.totalDuration % 60}s` : 'N/A'}
                                    </Td>
                                    <Td className='w-[250px]'>
                                        <div className='flex flex-col gap-y-2'>
                                            <p className='text-sm text-richblack-5'>Progress: {course?.progressPercentage || 0}%</p>
                                            <ProgressBar
                                                completed={course?.progressPercentage || 0}
                                                height='8px'
                                                isLabelVisible={false} // Hide numeric label on bar for cleaner look
                                                bgColor="#FFD60A" // Yellow color
                                                baseBgColor="#2C333F" // Dark background for the empty part
                                                borderRadius="4px"
                                                className='w-full'
                                            />
                                        </div>
                                    </Td>
                                </Tr>
                            ))}
                        </Tbody>
                    </Table>
                </div>
            )}
        </div>
    );
};

export default EnrolledCourses;