import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Outlet, useParams } from 'react-router-dom';
import { getFullDetailsOfCourse } from '../services/operations/courseDetailsAPI';
import { setCompletedLectures, setCourseSectionData, setEntireCourseData, setTotalNoOfLectures } from '../slices/viewCourseSlice';
import CourseReviewModal from '../components/core/Dashboard/ViewCourse/CourseReviewModal';
import VideoDetailsSideBar from '../components/core/Dashboard/ViewCourse/VideoDetailsSideBar';
import { IoIosArrowBack } from 'react-icons/io'; // For back button icon

const ViewCourse = () => {
  const [reviewModal, setReviewModal] = useState(false);
  const { courseId } = useParams();
  const { token } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  // Fetch course details on component mount
  useEffect(() => {
    const setCourseSpecificDetails = async () => {
      try {
        // You might want to add a loading state here if the fetch takes time
        const courseData = await getFullDetailsOfCourse(courseId, token);
        if (courseData) {
          dispatch(setCourseSectionData(courseData?.courseDetails?.courseSection));
          dispatch(setEntireCourseData(courseData?.courseDetails));
          dispatch(setCompletedLectures(courseData?.completedVideos || [])); // Ensure it's an array

          let lectures = 0;
          courseData?.courseDetails?.courseSection?.forEach((sec) => {
            lectures += sec.subSection.length;
          });
          dispatch(setTotalNoOfLectures(lectures));
        }
      } catch (error) {
        console.error("Error fetching course details:", error);
        // Handle error, e.g., show an error message to the user
      }
    };
    setCourseSpecificDetails();
  }, [courseId, token, dispatch]);

  return (
    <>
      <div className='relative flex min-h-[calc(100vh-3.5rem)]'> {/* min-h for full viewport height */}
        <VideoDetailsSideBar setReviewModal={setReviewModal} />
        <div className='h-[calc(100vh-3.5rem)] flex-1 overflow-auto'> {/* Main content area, takes remaining width */}
          <div className='mx-auto w-full p-6'> {/* Padding inside the main content */}
            <Outlet />
          </div>
        </div>
      </div>

      {reviewModal && <CourseReviewModal setReviewModal={setReviewModal} />}
    </>
  );
};

export default ViewCourse;