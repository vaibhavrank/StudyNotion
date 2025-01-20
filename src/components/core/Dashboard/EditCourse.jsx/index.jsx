import React, { useEffect,useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch,useSelector } from "react-redux";
import RenderSteps from "../AddCourse/RenderSteps";
import { getFullDetailsOfCourse } from "../../../../services/operations/courseDetailsAPI";
import { setCourse, setEditCourse } from "../../../../slices/courseSlice";
export default function EditCourse(){
    const {course} = useSelector((state) =>state.course)
    const {token} = useSelector((state) =>state.auth)
    const dispatch = useDispatch();
    const [loading,setLoading] = useState(false);
    const {courseId} = useParams();

    useEffect(()=>{
        const populteCourseDetails = async ()=>{
            setLoading(true);
            const result = await getFullDetailsOfCourse(courseId,token);
            console.log("RESULT AT EDIT COURSE............",result);
            if(result?.courseDetails){
                dispatch(setEditCourse(true));
                dispatch(setCourse(result.courseDetails));

            }
            setLoading(false);
        }
        populteCourseDetails();
    },[])  
    if(loading){
        return(
            <div className="text-white">Loading...</div>
        )
    }
    return(
        <div>
            {
                course ? (<RenderSteps /> ) : (<p>Course Not Found</p>)
            }
        </div>
    )
}