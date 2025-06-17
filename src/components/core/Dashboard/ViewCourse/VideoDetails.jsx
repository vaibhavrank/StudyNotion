import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router';
import { useSelector, useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';
import { Player, BigPlayButton, LoadingSpinner, ControlBar, PlaybackRateMenuButton, ForwardControl, ReplayControl, CurrentTimeDisplay, TimeDivider } from 'video-react';
import { BiSkipPreviousCircle, BiSkipNextCircle } from 'react-icons/bi';
import { MdOutlineReplayCircleFilled } from 'react-icons/md';
import { markLectureAsComplete } from '../../../../services/operations/courseDetailsAPI';
import { setCompletedLectures } from '../../../../slices/viewCourseSlice';

// Import video-react CSS (ensure this path is correct based on your setup)
import 'video-react/dist/video-react.css'; 

const VideoDetails = () => {
  const { courseId, sectionId, subsectionId } = useParams();
  const dispatch = useDispatch();
  const { token } = useSelector(state => state.auth);
  const { user } = useSelector(state => state.profile);
  const { courseSectionData, courseEntireData, completedLectures } = useSelector(state => state.viewCourse);
  const navigate = useNavigate();
  const playerRef = useRef(null);

  const [videoData, setVideoData] = useState(null); // Initialize with null
  const [videoEnd, setVideoEnd] = useState(false);
  const [loading, setLoading] = useState(false); // Consider using for fetching video URL if needed

  useEffect(() => {
    const findVideoData = () => {
      if (!courseSectionData || courseSectionData.length === 0) {
        return;
      }
      setLoading(true); // Indicate that video data is being found/set
      const filteredSection = courseSectionData.find(
        (section) => String(section?._id).trim() === String(sectionId).trim()
      );

      const filteredSubsection = filteredSection?.subSection?.find((subsection) => subsection._id === subsectionId);

      setVideoData(filteredSubsection);
      setVideoEnd(false); // Reset video end state when new video loads
      setLoading(false); // Done finding video data
    };
    findVideoData();
  }, [courseSectionData, sectionId, subsectionId]);

  const isLastLecture = () => {
    const currentSectionIndex = courseSectionData?.findIndex((section) => section._id === sectionId);
    const currentSubsectionIndex = courseSectionData[currentSectionIndex]?.subSection.findIndex((subsection) => subsection._id === subsectionId);

    if (currentSubsectionIndex === courseSectionData[currentSectionIndex]?.subSection?.length - 1 && currentSectionIndex === courseSectionData?.length - 1) {
      return true;
    }
    return false;
  };

  const isFirstLecture = () => {
    const currentSectionIndex = courseSectionData?.findIndex((section) => section._id === sectionId);
    const currentSubsectionIndex = courseSectionData[currentSectionIndex]?.subSection.findIndex((subsection) => subsection._id === subsectionId);

    if (currentSubsectionIndex === 0 && currentSectionIndex === 0) {
      return true;
    }
    return false;
  };

  const goToNextLecture = () => {
    const currentSectionIndex = courseSectionData?.findIndex((section) => section._id === sectionId);
    const currentSubsectionIndex = courseSectionData[currentSectionIndex]?.subSection.findIndex((subsection) => subsection._id === subsectionId);

    if (currentSubsectionIndex === courseSectionData[currentSectionIndex]?.subSection.length - 1) {
      // Last subsection in current section, move to next section's first subsection
      if (currentSectionIndex < courseSectionData.length - 1) {
        const nextSectionId = courseSectionData[currentSectionIndex + 1]?._id;
        const nextSubsectionId = courseSectionData[currentSectionIndex + 1]?.subSection[0]._id;
        navigate(`/view-course/${courseId}/section/${nextSectionId}/sub-section/${nextSubsectionId}`);
      }
    } else {
      // Not the last subsection, move to next subsection in current section
      const nextSectionId = courseSectionData[currentSectionIndex]._id;
      const nextSubsectionId = courseSectionData[currentSectionIndex].subSection[currentSubsectionIndex + 1]._id;
      navigate(`/view-course/${courseId}/section/${nextSectionId}/sub-section/${nextSubsectionId}`);
    }
  };

  const goToPreviousLecture = () => {
    const currentSectionIndex = courseSectionData?.findIndex((section) => section._id === sectionId);
    const currentSubsectionIndex = courseSectionData[currentSectionIndex]?.subSection.findIndex((subsection) => subsection._id === subsectionId);

    if (currentSubsectionIndex === 0) {
      // First subsection in current section, move to previous section's last subsection
      if (currentSectionIndex > 0) {
        const previousSectionId = courseSectionData[currentSectionIndex - 1]._id;
        const previousSubsectionId = courseSectionData[currentSectionIndex - 1]?.subSection[courseSectionData[currentSectionIndex - 1].subSection.length - 1]._id;
        navigate(`/view-course/${courseId}/section/${previousSectionId}/sub-section/${previousSubsectionId}`);
      }
    } else {
      // Not the first subsection, move to previous subsection in current section
      const previousSectionId = courseSectionData[currentSectionIndex]?._id;
      const previousSubsectionId = courseSectionData[currentSectionIndex]?.subSection[currentSubsectionIndex - 1]._id;
      navigate(`/view-course/${courseId}/section/${previousSectionId}/sub-section/${previousSubsectionId}`);
    }
  };

  const handleLectureCompletion = async () => {
    if (loading) return; // Prevent multiple calls
    setLoading(true);
    try {
      const res = await markLectureAsComplete({
        userId: user._id, // Assuming user._id is needed
        courseId: courseId,
        subSectionId: subsectionId,
      }, token);

      if (res.success) { // Assuming API returns success boolean
         // Dispatch only if not already completed
        if (!completedLectures.includes(videoData._id)) {
            dispatch(setCompletedLectures([...completedLectures, videoData._id]));
        }
      } else {
        console.error("Failed to mark lecture as complete:", res.message);
      }
    } catch (error) {
      console.error("Error marking lecture as complete:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='flex flex-col gap-5 p-4 text-white w-full'>
      {
        !videoData || loading ? (
          <div className='flex justify-center items-center h-[400px]'>
            <div className='custom-loader'></div> {/* Ensure custom-loader CSS is defined */}
          </div>
        ) : (
          <div className='w-full aspect-video rounded-lg overflow-hidden'>
            <Player
              ref={playerRef}
              src={videoData.videoUrl}
              aspectRatio="16:9"
              fluid={true}
              autoPlay={true} // Auto-play the video
              onEnded={() => setVideoEnd(true)}
            >
              <BigPlayButton position="center" />
              <LoadingSpinner />
              <ControlBar>
                {/* <PlaybackRateMenuButton rates={[2, 1.5, 1, 0.75, 0.5]} order={7.1} /> More practical speeds */}
                {/* <ReplayControl seconds={10} order={7.2} /> Replay 10 seconds */}
                {/* <ForwardControl seconds={10} order={7.3} /> Forward 10 seconds */}
                {/* <CurrentTimeDisplay order={4.1} /> */}
                {/* <TimeDivider order={4.2} /> */}
              </ControlBar>

              {/* Overlay for "Mark as Completed" / Navigation Buttons */}
              {videoEnd && (
                <div className='absolute inset-0 flex flex-col items-center justify-center bg-black bg-opacity-75 z-20 gap-4'>
                  {!completedLectures.includes(videoData._id) && (
                    <button
                      onClick={handleLectureCompletion}
                      className='bg-yellow-50 text-richblack-900 font-bold py-2 px-5 rounded-md transition-all duration-200 hover:scale-95'
                      disabled={loading}
                    >
                      {loading ? "Marking..." : "Mark as Completed"}
                    </button>
                  )}

                  <div className='flex gap-x-4'>
                    {!isFirstLecture() && (
                      <button
                        onClick={goToPreviousLecture}
                        className='flex items-center gap-x-2 text-richblack-25 py-2 px-4 rounded-md bg-richblack-700 hover:bg-richblack-600 transition-all duration-200'
                      >
                        <BiSkipPreviousCircle className="text-xl" /> Previous
                      </button>
                    )}

                    <button
                      onClick={() => { playerRef.current.seek(0); playerRef.current.play(); setVideoEnd(false); }}
                      className='flex items-center gap-x-2 text-richblack-25 py-2 px-4 rounded-md bg-richblack-700 hover:bg-richblack-600 transition-all duration-200'
                    >
                      <MdOutlineReplayCircleFilled className="text-xl" /> Replay
                    </button>

                    {!isLastLecture() && (
                      <button
                        onClick={goToNextLecture}
                        className='flex items-center gap-x-2 text-richblack-25 py-2 px-4 rounded-md bg-richblack-700 hover:bg-richblack-600 transition-all duration-200'
                      >
                        Next <BiSkipNextCircle className="text-xl" />
                      </button>
                    )}
                  </div>
                </div>
              )}
            </Player>
          </div>
        )
      }

      {/* Video title and description */}
      <div className='mt-5'>
        <h1 className='text-3xl font-bold text-richblack-50 mb-2'>{videoData?.title}</h1>
        <p className='text-richblack-200 leading-relaxed'>{videoData?.description}</p>
      </div>
    </div>
  );
};

export default VideoDetails;