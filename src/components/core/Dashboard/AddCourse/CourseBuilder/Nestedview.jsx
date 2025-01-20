import React, { useEffect, useState } from 'react'
import { RxDropdownMenu } from 'react-icons/rx'
import { useDispatch, useSelector } from 'react-redux'
import { MdEdit } from 'react-icons/md'
import {setCourse} from "../../../../../slices/courseSlice"
import { RiDeleteBin6Line } from 'react-icons/ri'
import ConfirmationModal from '../../../../common/ConfirmationModal'
import { BiSolidDownArrow } from 'react-icons/bi'
import { AiOutlinePlus } from 'react-icons/ai'
import SubSectionModal from "./SubSectionModal"
import { deleteSection,deleteSubSection } from '../../../../../services/operations/courseDetailsAPI'


const Nestedview = ({handleChangeEditSection,courseData}) => {
    let {course} =useSelector((state) =>state.course)

    if(courseData!=null){
        course = courseData;
    }
    const {token} = useSelector((state) =>state.auth)
    const dispatch = useDispatch();
    
    const [addSubSection, setAddSubSection] = useState(null);
    const [viewSubSection, setViewSubSection] = useState(null);
    const [editSubSection, setEditSubSection] = useState(null);
    
    const [confirmationModal,setConfirmationModal] = useState(null);
    
    
    const handleDeleteSection = async (sectionId)=>{
        const result= await deleteSection({
            sectionId,courseId:course._id,token
        })
        if(result){
            // const updatedCourseSection = course.courseSection.map((section)=>
            //     section._id ==sectionId ? result:section
            // )
            // const updatedCourse = {...course,courseSection:updatedCourseSection};
            console.log("ACTUAL COURSE",course,"\nUPDATED COURSE",result);
            dispatch(setCourse(result))

        }
        setConfirmationModal(null);
    }
    // useEffect( ()=>{
    //     dispatch(setCourse(course));
    // },[course])
    const handleDeleteSubSection = async (sectionId,subSectionId)=>{
        const result = await deleteSubSection({subSectionId,sectionId,token});

        if(result){
            const updatedCourseSection = course.courseSection.map((section)=>
                section._id ==sectionId ? result:section 
            )
            const updatedCourse = {...course,courseSection:updatedCourseSection};
            dispatch(setCourse(updatedCourse));

        }
        setConfirmationModal(null);
    }

  return (
    <div>
        <div className='rounded-lg bg-richblack-700 p-6 px-8'>
            {course?.courseSection?.map( (section)=>(
                <details key={section._id}>
                    <summary className='flex items-center  justify-between gap-x-3 border-b-2'>
                        <div className='flex   items-center  gap-x-3'>
                            <RxDropdownMenu  />
                            <p>{section.sectionName}</p>

                        </div>
                        <div className='flex items-center gap-x-3'>
                            <button 
                            onClick={()=>handleChangeEditSection(section._id,section.sectionName)}
                            >
                                <MdEdit />
                            </button>
                            <button
                            onClick={()=>{
                                setConfirmationModal({
                                    text1:"Delete the Section",
                                    text2:"This will delete all the section and it video lectures",
                                    btn1Text:"Delete",
                                    btn2Text:"Cancel",
                                    btn1Handler: ()=> handleDeleteSection(section._id),
                                    btn2Handler:()=>setConfirmationModal(null)
                                })
                            }}
                            >
                                <RiDeleteBin6Line />
                            </button>
                            <span >|</span>
                            <BiSolidDownArrow />
                        </div>
                    </summary>
                    <div>
                        {
                            section.subSection.length > 0 && section.subSection.map( (data)=>(
                                <div
                                    key={data?._id}
                                    onClick={()=>setViewSubSection(data)}
                                    className='flex items-center justify-between gap-x-3 border-b-2'
                                >
                                    <div className='flex items-center gap-x-3'>
                                        <RxDropdownMenu />
                                        <p>{data.title}</p>
                                    </div>
                                    <div 
                                        onClick={(e)=>e.stopPropagation()}
                                    className='flex items-center gap-x-3'>
                                        <button
                                            onClick={()=>setEditSubSection( {...data,sectionId:section._id} )}
                                        >
                                            <MdEdit />
                                        </button>
                                        <button
                                         onClick={()=>setConfirmationModal({
                                            text1:"Delete the Sub Section",
                                            text2:"Selected lecture will be Deleted",
                                            btn1Text:"Delete",
                                            btn2Text:"Cancel",
                                            btn1Handler: ()=> handleDeleteSubSection(section._id,data._id),
                                            btn2Handler:()=>setConfirmationModal(null)
                                        })}
                                        ><RiDeleteBin6Line /></button>
                                    </div>

                                </div>
                            ))
                        }
                        {
                        !courseData == true&&<button
                        onClick={()=>setAddSubSection(section._id)}
                        className={`mt-4 flex items-center gap-x-2 text-yellow-5 `}
                        >
                            <AiOutlinePlus />
                            <p>Add Course</p>
                        </button>
                        }
                    </div>

                </details>
            ) )}
        </div>
        {
            addSubSection ? (<SubSectionModal
                modalData={addSubSection}
                setModalData = {setAddSubSection}
                add={true} view={false} edit={false}
                />)
            : viewSubSection ? (<SubSectionModal 
                modalData={viewSubSection}
                setModalData = {setViewSubSection}
                add={false} view={true} edit={false}
            />) 
            : editSubSection ? (<SubSectionModal
                modalData={editSubSection}
                setModalData = {setEditSubSection}
                add={false} view={false} edit={true}
                />)
             : <div></div>
        }
        {
            confirmationModal ?
            <ConfirmationModal
            modalData={confirmationModal}
            />
            : (<div></div>)
        }
    </div>
  )
}

export default Nestedview