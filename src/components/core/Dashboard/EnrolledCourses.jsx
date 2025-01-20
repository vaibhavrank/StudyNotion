import React, { useEffect,useState } from 'react'
import { getUserCourses } from '../../../services/operations/profileAPIs';
import { useDispatch, useSelector } from 'react-redux';
import ProgressBar from "@ramonak/react-progress-bar";
import { Table, Thead, Tbody, Tr, Th, Td } from 'react-super-responsive-table'
import { useNavigate } from 'react-router-dom';
// import Thead from 'lucide-react'
const EnrolledCourses = ()=>{
    const {token} = useSelector((state)=> state.auth);
    const dispatch = useDispatch();
    const navigate = useNavigate()
    const [enrolledCourses,setenrolledCourses] = useState(null);
    const getUserEnrolledCourses = async ()=>{
        try{
            const response = await getUserCourses(token,dispatch);
            console.log(response.courses);
            setenrolledCourses(response.courses);
            console.log("DATA.........",enrolledCourses,response.courses);
        }catch(error){
            console.log("Unable to fetch enrolled courses" ,error)
        }
    }
    useEffect( ()=> {
        getUserEnrolledCourses();
    },[])



    return(
        <div className='text-white w-[80%] flex flex-col px-3 gap-y-3 m-auto'>


                <div>
                    Enrolled Courses
                </div>
                <div className='flex flex-col gap-y-3'>{
                    !enrolledCourses ? ( <div>Loading...</div>)
                    : !enrolledCourses.length ? (<p>You havent enrolled in any course yet</p>) 
                    : (
                        <div className='flex flex-col gap-x-3'> 
                            
                            <Table>
                                <Thead className='justify-around  overflow-auto custom-scrollbar'>
                                    <Tr className='border-t-2 rounded-t-lg  bg-richblack-500 '>
                                        {/* <Th></Th> */}
                                        <Th>Course Name</Th>
                                        <Th>duration</Th>
                                        <Th>  Progress  </Th>
                                    </Tr>
                                </Thead>
                                <Tbody>
                                {
                                enrolledCourses.map( (course,index) =>(
                                    <Tr
                                    onClick={()=>{
                                                console.log(`/view-course/${String(course?._id).trim()}/section/${String(course?.courseSection?.[0]?._id).trim()}/sub-section/${String(course?.courseSection?.[0]?.subSection?.[0]?._id).trim()}`)
                                                navigate(`/view-course/${String(course?._id).trim()}/section/${String(course?.courseSection?.[0]?._id).trim()}/sub-section/${String(course?.courseSection?.[0]?.subSection?.[0]?._id).trim()}`);
                                            }}
                                    key={index} className='border-b-white'  >
                                        {/* <div key={index} className='flex justify-around gap-x-3'> */}
                                            <Td className='flex ml-10   gap-x-2'>
                                                <img className='h-[65px] overflow-hidden w-[135px]'  src={course.thumbnail} alt="thmbl" />
                                                <div>
                                                    <p>{course.courseName}</p>
                                                    <p>{course.courseDescription}</p>
                                                </div>
                                            </Td>
                                            <Td className='text-center'>
                                                {course?.totalDuration||0}s
                                            </Td>
                                            <Td className=' align-middle place-items-center' >
                                                <p>Progress: {course?.progressPercentage} &#38;</p>
                                                <ProgressBar  labelClassName="text-[0px]" height='10px' completed={course?.progressPercentage} className='text-[0px] h-[10px] w-[200px]  '/>
                                            </Td>
                                        {/* </div> */}
                                        {/* <div className='h-[1px]  w-full bg-white'></div> */}
                                    </Tr>
                                ))
                            }
                                </Tbody>
                            </Table>

                        </div>

                    )
                }
                </div>

        </div>
    )
}

export default EnrolledCourses;