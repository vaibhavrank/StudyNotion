import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { IoIosArrowBack, IoIosArrowDown, IoIosArrowUp } from 'react-icons/io'; // Icons for navigation and accordion
import { MdOutlinePlaylistAddCheck } from 'react-icons/md'; // Icon for mark as complete

const VideoDetailsSideBar = ({ setReviewModal }) => {
  const [activeSection, setActiveSection] = useState(""); // Renamed for clarity: tracks which section is open
  const [activeSubsection, setActiveSubsection] = useState(""); // Tracks the currently playing subsection
  const navigate = useNavigate();
  const { sectionId, subsectionId } = useParams();
  const {
    courseSectionData,
    courseEntireData,
    totalNoOfLectures,
    completedLectures
  } = useSelector((state) => state.viewCourse);
  const location = useLocation();

  useEffect(() => {
    // This effect runs when course data or URL parameters change
    const updateActiveStates = () => {
      if (!courseSectionData || courseSectionData.length === 0) {
        return;
      }

      // Find the current section based on URL
      const currentSection = courseSectionData.find(
        (data) => data._id === sectionId
      );

      // Set the active section (for accordion expansion)
      if (currentSection) {
        setActiveSection(currentSection._id);
      }

      // Set the active subsection (for highlighting the current video)
      setActiveSubsection(subsectionId);
    };

    updateActiveStates();
  }, [courseSectionData, sectionId, subsectionId, location.pathname]);

  return (
    <div className="flex h-full w-[320px] max-w-[350px] flex-col border-r border-richblack-700 bg-richblack-800 text-white">
      {/* Top Section: Buttons and Course Info */}
      <div className="flex flex-col items-center justify-between gap-y-4 border-b border-richblack-700 p-6">
        {/* Buttons */}
        <div className="flex w-full items-center justify-between">
          <button
            onClick={() => {
              navigate("/dashboard/enrolled-courses");
            }}
            className="flex items-center gap-x-2 rounded-md bg-richblack-700 py-2 px-4 text-sm font-medium text-richblack-25 transition-all duration-200 hover:bg-richblack-600 hover:scale-95"
            title="Back to Enrolled Courses"
          >
            <IoIosArrowBack className="text-lg" />
            <span>Back</span>
          </button>
          <button
            onClick={() => {
              setReviewModal(true);
            }}
            className="flex items-center gap-x-2 rounded-md bg-yellow-50 py-2 px-4 text-sm font-medium text-richblack-900 transition-all duration-200 hover:bg-yellow-100 hover:scale-95"
            title="Add a Review"
          >
            Add Review
          </button>
        </div>

        {/* Heading and Lecture Count */}
        <div className="mt-4 w-full">
          <p className="text-xl font-semibold text-richblack-50">{courseEntireData?.courseName}</p>
          <p className="text-richblack-300 text-sm">
            {completedLectures?.length || 0} / {totalNoOfLectures} Lectures
          </p>
        </div>
      </div>

      {/* Course Sections and Subsections */}
      <div className="h-[calc(100vh-5rem)] overflow-y-auto"> {/* Scrollable area for sections */}
        {courseSectionData.length > 0 && courseSectionData?.map((section, index) => (
          <div
            key={index}
            className="cursor-pointer border-b border-richblack-700 last:border-b-0"
          >
            {/* Section Header */}
            <div
              onClick={() => {
                setActiveSection(activeSection === section._id ? null : section._id); // Toggle section visibility
              }}
              className="flex items-center justify-between gap-x-3 bg-richblack-700 px-5 py-4 transition-all duration-200 hover:bg-richblack-600"
            >
              <h3 className="font-semibold text-richblack-50">{section?.sectionName}</h3>
              <span className="text-lg text-richblack-300">
                {activeSection === section._id ? <IoIosArrowUp /> : <IoIosArrowDown />}
              </span>
            </div>

            {/* Subsections (Lessons) */}
            {activeSection === section._id && (
              <div className="bg-richblack-900">
                {section.subSection?.map((topic, subIndex) => (
                  <div
                    key={subIndex}
                    onClick={() => {
                      setActiveSubsection(topic._id);
                      navigate(`/view-course/${courseEntireData?._id}/section/${section?._id}/sub-section/${topic?._id}`);
                    }}
                    className={`flex items-center gap-x-3 py-3 px-8 text-sm transition-all duration-200
                      ${activeSubsection === topic._id
                        ? "bg-yellow-200 text-richblack-900 font-medium"
                        : "text-richblack-50 hover:bg-richblack-700 hover:text-richblack-25"
                      }
                    `}
                  >
                    <input
                      type='checkbox'
                      checked={completedLectures.includes(topic._id)}
                      readOnly={true}
                      className="form-checkbox h-4 w-4 rounded border-richblack-400 bg-richblack-700 text-yellow-50 focus:ring-yellow-500"
                    />
                    <span className="flex-1">{topic.title}</span>
                    {completedLectures.includes(topic._id) && (
                       <MdOutlinePlaylistAddCheck className="text-green-500 text-lg" />
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default VideoDetailsSideBar;