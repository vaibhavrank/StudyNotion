import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { Table,Td,Tr,Thead,Tbody,Th } from 'react-super-responsive-table'
import { COURSE_STATUS } from '../../../../utils/constants'
import { MdEdit, MdEditDocument, MdEditNote, MdEditOff, MdEditRoad } from 'react-icons/md'
import { RiDeleteBack2Fill, RiDeleteBin6Line } from 'react-icons/ri'
import ConfirmationModal from '../../../common/ConfirmationModal'
import { deleteCourse, fetchInstructorCourses } from '../../../../services/operations/courseDetailsAPI'
import { FiEdit2 } from 'react-icons/fi'
import { HiClock } from 'react-icons/hi'
import { FaCheck } from 'react-icons/fa'
import 'react-super-responsive-table/dist/SuperResponsiveTableStyle.css';
import { setCourse } from '../../../../slices/courseSlice'

const CourseTable = ({ courses, setCourses }) => {
    
 const dispatch = useDispatch()
  const navigate = useNavigate()
  const { token } = useSelector((state) => state.auth)
  const [loading, setLoading] = useState(false)
  const [confirmationModal, setConfirmationModal] = useState(null)
  const TRUNCATE_LENGTH = 30
    const handleDeleteCourse = async (courseId)=>{
        setLoading(true);
        await deleteCourse({courseId:courseId},token);
        const result = await fetchInstructorCourses(token);
        console.log("RESULT AFTER DELETING....",result)
        if(result)setCourses(result);
        setConfirmationModal(null);
        setLoading(false);
    }

  return (
    <div className='text-white'>
        <Table >
            <Thead>
                <Tr>
                    <Th>
                        Courses 
                    </Th>
                    <Th>
                        Duration 
                    </Th>
                    <Th>
                        Price 
                    </Th>
                    <Th>
                        Actions 
                    </Th>
                </Tr>
            </Thead>
            <Tbody>
                {
                    courses.length===0 ? (
                        <Tr>
                            <Td>No Course Found</Td>
                        </Tr>
                    )
                    :(
                        courses?.map( (course)=>(
                            <Tr key={course._id} 
                                
                                className="flex gap-x-10 border-richblack-800 p-8"
                            >
                               <Td className='flex gap-x-4'>
                               <img
                                    src={course?.thumbnail}
                                    className='h-[150px] w-[220px] rounded-lg  object-cover'
                                />
                                <div className='flex flex-col '>
                                    <p>{course.courseName}</p>
                                    <p>{course.courseDescription}</p>
                                    <p>Category: {course?.category?.name}</p>
                                    <p>{course.status}</p>
                                    {
                                        course.status===COURSE_STATUS.DRAFT ? (
                                            <p className='text-ink-50'> DRAFTED</p>
                                        )
                                        :(<p className="text-yellow-50">PUBLISHED</p>)
                                    }
                                </div>
                                </Td>
                                <Td>
                                    2hr 30min
                                </Td>
                                <Td className="text-sm font-medium text-richblack-100 mb-5">
                                    ₹{course.price}
                                </Td>
                                <Td className="text-sm font-medium text-richblack-100  ">
                                    <button
                                    onClick={ ()=>{
                                        dispatch(setCourse(course))
                                        setLoading(false);
                                        navigate(`/dashboard/edit-course/${course._id}`)
                                    }}
                                    disabled={loading} 
                                    className='flex gap-x-2 items-center'>
                                        EDIT <MdEditDocument className='text-blue-100' />
                                    </button>
                                    <button
                                    disabled={loading} 
                                    onClick={()=>{
                                        setConfirmationModal({
                                            text1:"Do you want to delete this course?",
                                            text2:"Selected Course will be Deleted and this is irreverisible",
                                            btn1Text:"Delete",
                                            btn2Text:"Cancel",
                                            btn1Handler: !loading?()=> handleDeleteCourse(course._id):()=>{},
                                             btn2Handler:()=>setConfirmationModal(null)
                                        })
                                    }}
                                    className='flex  gap-x-2 items-center'
                                    >
                                     DELETE <RiDeleteBin6Line className='text-[#9e228d]'/>
                                    </button>
                                </Td>
                            </Tr>
                        ))
                    )
                }
            </Tbody>
        </Table>
         
        {
            confirmationModal && <ConfirmationModal modalData={confirmationModal} />
        }
    </div>
  )
}

export default CourseTable