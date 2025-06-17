import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Table, Td, Tr, Thead, Tbody, Th } from 'react-super-responsive-table';
import { COURSE_STATUS } from '../../../../utils/constants';
import { RiDeleteBin6Line } from 'react-icons/ri'; // Using a single delete icon for consistency
import ConfirmationModal from '../../../common/ConfirmationModal';
import { deleteCourse, fetchInstructorCourses } from '../../../../services/operations/courseDetailsAPI';
import { FiEdit2 } from 'react-icons/fi'; // Using FiEdit2 for a modern edit icon
import { HiClock } from 'react-icons/hi';
import { FaCheck } from 'react-icons/fa';
import 'react-super-responsive-table/dist/SuperResponsiveTableStyle.css';
import { setCourse } from '../../../../slices/courseSlice';

const CourseTable = ({ courses, setCourses }) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { token } = useSelector((state) => state.auth);
    const [loading, setLoading] = useState(false);
    const [confirmationModal, setConfirmationModal] = useState(null);

    const handleDeleteCourse = async (courseId) => {
        setLoading(true);
        await deleteCourse({ courseId: courseId }, token);
        const result = await fetchInstructorCourses(token);
        if (result) {
            setCourses(result);
        }
        setConfirmationModal(null);
        setLoading(false);
    };

    return (
        <div className='text-white'>
            {/* Added a responsive container for the table with some padding */}
            <div className='rounded-xl border border-richblack-800 p-4 lg:p-8 overflow-x-auto'>
                <Table className='min-w-full divide-y divide-richblack-700'>
                    <Thead>
                        <Tr className='flex flex-col md:flex-row gap-y-2 md:gap-y-0 md:justify-between rounded-t-md bg-richblack-700'>
                            <Th className='px-4 py-3 text-left text-sm font-medium uppercase text-richblack-100'>Courses</Th>
                            <Th className='px-4 py-3 text-center text-sm font-medium uppercase text-richblack-100'>Duration</Th>
                            <Th className='px-4 py-3 text-center text-sm font-medium uppercase text-richblack-100'>Price</Th>
                            <Th className='px-4 py-3 text-center text-sm font-medium uppercase text-richblack-100'>Actions</Th>
                        </Tr>
                    </Thead>
                    <Tbody className='divide-y divide-richblack-700'>
                        {courses.length === 0 ? (
                            <Tr>
                                <Td className='py-8 text-center text-lg text-richblack-500' colSpan="4">
                                    No Courses Found
                                </Td>
                            </Tr>
                        ) : (
                            courses?.map((course) => (
                                <Tr
                                    key={course._id}
                                    className='flex flex-col md:flex-row md:items-center justify-between border-richblack-800 py-8 px-4 md:px-0'
                                >
                                    <Td className='flex items-center gap-x-4 w-full md:w-[40%]'>
                                        <img
                                            src={course?.thumbnail}
                                            alt={course.courseName}
                                            className='h-[80px] w-[120px] sm:h-[120px] sm:w-[180px] rounded-lg object-cover'
                                        />
                                        <div className='flex flex-col gap-y-1'>
                                            <p className='text-lg font-semibold text-richblack-50'>{course.courseName}</p>
                                            <p className='text-richblack-300 text-sm'>
                                                {/* Truncate description for cleaner look */}
                                                {course.courseDescription.length > 50
                                                    ? `${course.courseDescription.substring(0, 50)}...`
                                                    : course.courseDescription}
                                            </p>
                                            <p className='text-richblack-400 text-xs mt-1'>Category: {course?.category?.name}</p>
                                            <div className='flex items-center gap-x-1 mt-1'>
                                                {course.status === COURSE_STATUS.DRAFT ? (
                                                    <span className='flex items-center gap-x-1 text-pink-200 text-xs font-semibold'>
                                                        <HiClock /> DRAFTED
                                                    </span>
                                                ) : (
                                                    <span className='flex items-center gap-x-1 text-yellow-50 text-xs font-semibold'>
                                                        <FaCheck /> PUBLISHED
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </Td>
                                    <Td className='text-center w-full md:w-[20%] text-richblack-100 text-sm'>
                                        {/* Assuming 'totalDuration' or similar exists, otherwise use a placeholder */}
                                        {course?.totalDuration || '2hr 30min'}
                                    </Td>
                                    <Td className='text-center w-full md:w-[20%] text-lg font-semibold text-richblack-50'>
                                        ₹{course.price}
                                    </Td>
                                    <Td className='flex justify-center gap-x-4 w-full md:w-[20%] mt-4 md:mt-0'>
                                        <button
                                            onClick={() => {
                                                dispatch(setCourse(course));
                                                setLoading(false);
                                                navigate(`/dashboard/edit-course/${course._id}`);
                                            }}
                                            disabled={loading}
                                            title='Edit Course'
                                            className='flex items-center gap-x-1 text-sm text-richblack-300 hover:text-yellow-50 transition-colors duration-200'
                                        >
                                            <FiEdit2 className='text-lg' />
                                            <span className='hidden sm:inline'>Edit</span>
                                        </button>
                                        <button
                                            disabled={loading}
                                            onClick={() => {
                                                setConfirmationModal({
                                                    text1: "Do you want to delete this course?",
                                                    text2: "All data related to this course will be permanently removed. This action cannot be undone.",
                                                    btn1Text: "Delete",
                                                    btn2Text: "Cancel",
                                                    btn1Handler: !loading ? () => handleDeleteCourse(course._id) : () => { },
                                                    btn2Handler: () => setConfirmationModal(null)
                                                });
                                            }}
                                            title='Delete Course'
                                            className='flex items-center gap-x-1 text-sm text-richblack-300 hover:text-pink-200 transition-colors duration-200'
                                        >
                                            <RiDeleteBin6Line className='text-lg' />
                                            <span className='hidden sm:inline'>Delete</span>
                                        </button>
                                    </Td>
                                </Tr>
                            ))
                        )}
                    </Tbody>
                </Table>

                {confirmationModal && <ConfirmationModal modalData={confirmationModal} />}
            </div>
        </div>
    );
};

export default CourseTable;