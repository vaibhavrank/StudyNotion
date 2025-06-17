import React, { useState, useEffect } from 'react';
import { getInstructorDashboard } from '../../../../services/operations/profileAPIs';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import InstructorChart from './InstructorChart';

const Instructor = () => {
    const [dashboardData, setDashboardData] = useState([]);
    const { token } = useSelector((state) => state.auth);
    const dispatch = useDispatch();
    const { user } = useSelector((state) => state.profile);
    const [loading, setLoading] = useState(false);
    const [totalAmount, setTotalAmount] = useState(0);
    const [totalStudents, setTotalStudents] = useState(0);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            const res = await getInstructorDashboard(token, dispatch);
            if (res) {
                setDashboardData(res.courses);
                setTotalAmount(res.totalAmount);
                setTotalStudents(res.totalStudents);
            }
            setLoading(false);
        };
        fetchData();
    }, []);

    return (
        <div className='p-6 lg:p-8 text-white min-h-[calc(100vh-3.5rem)] overflow-y-auto'> {/* Added padding and min-height for better layout */}
            {/* Header Section */}
            <div className='mb-8'>
                <h1 className='text-3xl font-bold text-richblack-50 mb-2'>Hi {user.firstName} 👋</h1>
                <p className='text-richblack-300 text-lg'>Let's start something new today.</p>
            </div>

            {/* Main Content Area */}
            {loading ? (
                <div className='grid min-h-[calc(100vh-10rem)] place-items-center'> {/* Centered loading */}
                    <div className='spinner'></div> {/* Assuming you have a CSS spinner or replace with a loading component */}
                    <p className='text-lg text-richblack-200 mt-4'>Loading dashboard data...</p>
                </div>
            ) : (
                dashboardData?.length > 0 ? (
                    <div className='flex flex-col gap-8'>
                        {/* Chart and Statistics Section */}
                        <div className='flex flex-col lg:flex-row gap-6'>
                            {/* Chart */}
                            <div className='flex-1 lg:h-[400px]  '> {/* Added flex-1 and height for chart container */}
                                <InstructorChart courses={dashboardData} />
                            </div>

                            {/* Statistics Card */}
                            <div className='min-w-[280px] rounded-md bg-richblack-800  p-6 shadow-sm flex flex-col justify-between gap-y-4'>
                                <p className='text-lg font-semibold text-richblack-50 mb-2'>Statistics</p>
                                <div className='flex flex-col gap-y-2'>
                                    <div className='flex justify-between items-center text-richblack-200'>
                                        <p className='text-sm'>Total Courses:</p>
                                        <p className='text-2xl font-bold text-richblack-50'>{dashboardData?.length}</p>
                                    </div>
                                    <div className='flex justify-between items-center text-richblack-200'>
                                        <p className='text-sm'>Total Students:</p>
                                        <p className='text-2xl font-bold text-richblack-50'>{totalStudents}</p>
                                    </div>
                                    <div className='flex justify-between items-center text-richblack-200'>
                                        <p className='text-sm'>Total Income:</p>
                                        <p className='text-2xl font-bold text-richblack-50'>₹{totalAmount}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Your Courses Section */}
                        <div className='rounded-md bg-richblack-800 p-6 shadow-sm'>
                            <div className='flex justify-between items-center mb-6'>
                                <h2 className='text-lg font-semibold text-richblack-50'>Your Courses</h2>
                                <Link to="/dashboard/my-courses" className='text-yellow-50 text-sm font-medium hover:underline'>
                                    View All
                                </Link>
                            </div>
                            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'> {/* Responsive grid for courses */}
                                {dashboardData.slice(0, 3).map((course) => (
                                    <div key={course._id} className='flex flex-col bg-richblack-700 rounded-md overflow-hidden shadow-md transition-all duration-200 hover:scale-[1.02]'>
                                        <img
                                            src={course.thumbnail}
                                            alt={course.courseName}
                                            className='h-[180px] w-full object-cover rounded-t-md'
                                        />
                                        <div className='p-4 flex flex-col gap-y-2'>
                                            <p className='text-lg font-semibold text-richblack-50'>{course.courseName}</p>
                                            <div className='flex items-center gap-x-3 text-sm text-richblack-300'>
                                                <p>Students: <span className='font-medium text-richblack-50'>{course.totalStudentsEnrolled}</span></p>
                                                <span className='w-[1px] h-4 bg-richblack-600'></span> {/* Divider */}
                                                <p>Price: <span className='font-medium text-richblack-50'>₹{course.price}</span></p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className='flex flex-col items-center justify-center min-h-[calc(100vh-10rem)]'>
                        <p className='text-2xl text-richblack-200 mb-4'>You haven't created any courses yet.</p>
                        <Link
                            to={"/dashboard/add-course"}
                            className='bg-yellow-50 text-richblack-900 font-medium py-2 px-4 rounded-md hover:scale-95 transition-all duration-200'
                        >
                            Create Your First Course
                        </Link>
                    </div>
                )
            )}
        </div>
    );
};

export default Instructor;