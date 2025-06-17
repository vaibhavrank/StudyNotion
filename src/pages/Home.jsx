
import React from "react";
import { FaArrowRight } from "react-icons/fa";
import { Link } from "react-router-dom";
import CTAButton from "../components/core/HomePage/Button";
import { HighlightText } from "../components/core/HomePage/HighlightText";
import Banner from "../assets/Images/banner.mp4"
import CodeBlocks  from "../components/core/HomePage/CodeBlocks";
import TimeLineSection from "../components/core/HomePage/TimeLineSection";
import { LearningLanguageSection } from "../components/core/HomePage/LearningLanguageSection";
import InstructorSection from "../components/core/HomePage/InstructorSection"
import ExploreMore from "../components/core/HomePage/ExploreMore";
import RatingSlider from "../components/core/Rating/RatingStars"
import { useDispatch } from 'react-redux';
import { setProgress } from "../slices/loadingBarSlice"
import Footer from "../components/common/Footer";
const Home = ()=>{
    const dispatch = useDispatch();
    return(
        <div>
            
            {/**section1 */}
 
            <div className="relative mx-auto flex flex-col w-11/12 items-center
            text-white justify-between">

                <Link onClick={()=>{dispatch(setProgress(100))}}  to={"/signup"}>
                    <div className=' group mt-16 p-1 mx-auto rounded-full bg-richblack-800
                    shadow-sm shadow-white hover:shadow-none
                     font-bold transition-all duration-200 hover: scale-95 w-fit max-w-maxContent'>
                        <div className='flex flex-row items-center gap-2 rounded-full px-10 py-[5px]
                         transition-all duration-200 group-hover:bg-richblack-900'>
                            <p>Become an Instructor</p><FaArrowRight/>
                        </div>
                    </div>
                </Link>
                <div className="text-center text-4xl font-semibold mt-7">
                    Empower Your Future with 
                    <HighlightText text={"Coding Skills"} /> 
                </div>
                <div className="mt-4  w-[80%] text-center text-lg font-bold text-richblack-300">
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Harum, ad temporibus. Possimus soluta officiis recusandae. 
                Error ducimus tempora, libero esse et, quia reiciendis pariatur soluta mod 
                </div>
                <div className="flex flex-row flex-wrap justify-center gap-7 mt-8">
                      <CTAButton active={true} linkto="/signup">
                        Learn More
                      </CTAButton>
                      <CTAButton active={false} linkto="/login">
                        Book a Demo
                      </CTAButton>
                </div>
                <div className='mx-3 my-12 shadow-2xl shadow-blue-200 w-[70%] relative'>
                    <div className='grad2 -top-10 w-[800px]'></div>
                    <video className='video'
                        muted
                        loop
                        autoPlay
                        playsInline
                    >
                    <source src={Banner} type="video/mp4" />
                    </video>
                </div>
                {/**Code Section 1*/}
                <div className="w-[80%] ">
                    <CodeBlocks 
                        position={"lg:flex-row "}
                        heading={
                            <div className="text-4xl font-semibold">
                                Unlock Your
                                <HighlightText text={"Coding Potential"} />
                                with our online courses
                            </div>
                        }
                        subheading={
                            "Lorem ipsum dolor sit amet consectetur adipisicing elit. Modi facilis soluta magnam a possimus cupiditate! Voluptatem temporibus fugit tempora error"
                        }
                        ctabtn1={
                            {
                                btnText:"Try it yourself",
                                linkto:"/signup",
                                active: true
                            }
                        }
                        ctabtn2={
                            {
                                btnText:"Learn More",
                                linkto:"/loging",
                                active: false
                            }
                        }
                        codeblock={`<!DOCTYPE html>\n<html>\n<head>\n<title>Demo title </title>\n</head>\n</html>`}
                        backgroundGradient={"grad2"}
                    />
                </div>
                {/**Code Section 2 */}
                <div className="w-[80%] ">
                    <CodeBlocks 
                        position={"lg:flex-row-reverse "}
                        heading={
                            <div className="text-4xl font-semibold">
                                Unlock Your
                                <HighlightText text={"Coding Potential"} />
                                with our online courses
                            </div>
                        }
                        subheading={
                            "Lorem ipsum dolor sit amet consectetur adipisicing elit. Modi facilis soluta magnam a possimus cupiditate! Voluptatem temporibus fugit tempora error"
                        }
                        ctabtn1={
                            {
                                btnText:"Try it yourself",
                                linkto:"/signup",
                                active: true
                            }
                        }
                        ctabtn2={
                            {
                                btnText:"Learn More",
                                linkto:"/login",
                                active: false
                            }
                        }
                        codeblock={`<!DOCTYPE html>\n<html>\n<head>\n<title>Demo title </title>\n</head>\n</html>`}
                        backgroundGradient={"grad"}
                    />
                </div>
                {/**Explore More Section */}
                <div>
                    <ExploreMore />
                </div>
            </div>

            {/**section 2 */}

            <div className="bg-pure-greys-5 text-richblack-700">
                <div className="homepage_bg  h-[310px]">
                    

                    <div className="w-11/12 max-w-maxContent flex flex-col item-center 
                    justify-between gap-5 mx-auto">
                        <div className="h-[150px]">
                            
                        </div>
                        <div className="flex flex-row flex-wrap justify-center gap-7 mx-auto text-white">
                            <CTAButton active={true} linkto={"/signup"}>
                                <div className="flex items-center gap-3">
                                Explore Full Catalog
                                <FaArrowRight />
                                </div>
                            </CTAButton>
                            <CTAButton active={false} linkto={"/login"} >
                                <div>
                                Learn More
                                </div>
                            </CTAButton>
                        </div>
                    </div>
                    

                </div>

                <div className='mx-auto w-11/12 max-w-maxContent flex flex-col items-center justify-between gap-7'>

                    <div className='flex md:flex-row flex-col justify-between gap-7 mb-10 -mt-10'>
                        <div className='text-4xl font-semibold'>
                            Get the skills you need for a
                            <HighlightText text={"job that is in demand"} />
                        </div>

                        <div className='flex flex-col gap-10  items-start'>
                        <div className='text-[16px]'>
                        The modern StudyNotion is the dictates its own terms. Today, to be a competitive specialist requires more than professional skills.
                        </div>
                        <CTAButton active={true} linkto={"/signup"}>
                            <div>
                                Learn more
                            </div>
                        </CTAButton>
                        </div>

                    </div>
                
                

                    <TimeLineSection className="w-full" />

                    <LearningLanguageSection />

                </div>
            </div>


            {/**section 3*/}

            <div className='w-11/12 mx-auto max-w-maxContent flex-col items-center justify-between gap-8 first-letter bg-richblack-900 text-white'>

            <InstructorSection />

            {/* Review Slider here */}
            </div>
            <div className=' pb-16 mt-24 bg-white z-50 text-black'>
                <h2 className='text-center text-2xl md:text-4xl font-semibold pt-14 text-black mb-5'>Reviews from other learners</h2>
                <RatingSlider />
            </div>
            {/**section 4*/}
            <Footer />
            {/**section 5*/}
        </div>
    )
}

export default Home;