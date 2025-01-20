import React,{useState,useEffect} from 'react'
import { getInstructorDashboard } from '../../../../services/operations/profileAPIs';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import InstructorChart from './InstructorChart';
const Instructor = () => {
    const [dashboardData,setDashboardData] = useState([]);
    const {token} = useSelector( (state)=>state.auth);
    const dispatch = useDispatch();
    const {user} = useSelector((state)=>state.profile);
    const [loading,setLoading] = useState(false);
    const [totalAmount,setTotalAmount] = useState(0);
    const [totalStudents,setTotalStudents] = useState(0);
    useEffect( ()=>{

        const fetchData = async ()=>{
            setLoading(true);
            const res = await getInstructorDashboard(token, dispatch);
            // console.log("REPSONSE ...............",res);
            setDashboardData(res.courses);
            setTotalAmount(res.totalAmount)
            setTotalStudents(res.totalStudents)
            setLoading(false);
            console.log(dashboardData?.slice(0,3));
        }
        fetchData();
    },[])
    
   
    
  return (
    <div className='text-white flex items-center  flex-col  '>
        <div className=''>
            <h1>{user.firstName}👋</h1>
            <p>Let's start something New</p>
        </div>
        <div className='w-[80%]'>
            {
                loading ? (<p>Loading ...</p>) 
                :(
                    dashboardData?.length> 0 ?(
                        <div>
                            <div className='flex justify-center gap-x-4'>
                                <InstructorChart courses={dashboardData}/>
                                <div className='bg-richblack-300 items-center justify-center mt-16 flex flex-col gap-y-2  w-[150px] m-1'>
                                    <p>Statstics</p>
                                    <div className='place-items-center'>
                                        <p>Total Courses</p>
                                        <p>{dashboardData?.length}</p>
                                    </div>

                                    <div className='place-items-center'>
                                        <p>Total Students</p>
                                        <p>{totalStudents}</p>
                                    </div>
                                    <div className='place-items-center'>
                                        <p>Total Amount</p>
                                        <p>{totalAmount}</p>
                                    </div>
                                </div>
                            </div>
                            <div className='w-full flex-wrap'>
                                {/* Render 3 course */}
                                <div>
                                    <p>Your Courses</p>
                                    <Link to="/dashboard/my-courses" >View All</Link>

                                </div>
                                <div className='flex gap-x-3'>
                                    {
                                        dashboardData.slice(0,3).map((course)=>(
                                            <div>
                                                <img src={course.thumbnail} height={"200px"} width={"300px"}/>
                                                <div>
                                                    <p>{course.courseName}</p>
                                                    <p>Students: {course.totalStudentsEnrolled}</p>
                                                    <span>|</span>
                                                    <p>Rs {course.price}</p>

                                                </div>
                                            </div>
                                        ))
                                    }
                                </div>
                            </div>
                        </div>
                    ):(
                        <div>
                            <p>You have Not created Any Course Yet</p>
                            <Link to={"/dashboad/addCourse"} >Create a Course</Link>
                        </div>
                    )
                )
            }
        </div>

    </div>
  )
}

export default Instructor