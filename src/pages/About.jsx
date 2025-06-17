import React from 'react';
import { HighlightText } from '../components/core/HomePage/HighlightText';
import BannerImage1 from "../assets/Images/aboutus1.webp";
import BannerImage2 from "../assets/Images/aboutus2.webp";
import BannerImage3 from "../assets/Images/aboutus3.webp";
import Quote from "../components/core/AboutPage/Quote";
import FoundingStory from "../assets/Images/FoundingStory.png";
import StatsComponent from '../components/core/AboutPage/Stats';
import LearningGrid from '../components/core/AboutPage/LearningGrid';
import ContactFormSection from '../components/core/AboutPage/ContactFormSection';
import ReviewSlider from '../components/common/ReviewSlider';

const About = () => {
  return (
    <div className='mx-auto text-white'>
      <section className='bg-richblack-700'>
        <div className='relative mx-auto flex w-11/12 max-w-maxContent flex-col justify-between gap-10 text-center text-white'>
          <header className='mx-auto py-20 text-4xl font-semibold lg:w-[70%]'>
            Driving Innovation in Online Education for a 
            <HighlightText text={"Brighter Future"} />
            <p className='mx-auto mt-3 text-center text-base font-medium text-richblack-300 lg:w-[95%]'>
              Studynotion is at the forefront of driving innovation in online education. We're passionate about creating a brighter future by offering cutting-edge courses, leveraging emerging technologies, and nurturing a vibrant learning community.
            </p>
          </header>
          <div className='sm:h-[70px] lg:h-[150px]'></div>
          <div className='hidden md:grid absolute bottom-0 left-[50%]  w-[100%] translate-x-[-50%] translate-y-[30%] opacity-100 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 lg:gap-5'>
            <img className='w-full' src={BannerImage1} alt="Banner 1" />
            <img className='w-full' src={BannerImage2} alt="Banner 2" />
            <img className='w-full' src={BannerImage3} alt="Banner 3" />
          </div>
        </div>
      </section>

      <section className='border-b border-richblack-700'>
        <div className='mx-auto flex w-11/12 max-w-maxContent flex-col justify-between gap-10 text-richblack-500'>
          <div className='h-[100px]'></div>
          <Quote />
        </div>
      </section>

      <section>
        <div className='mx-auto flex w-11/12 max-w-maxContent flex-col justify-between gap-10 text-richblack-500'>
          <div className='flex flex-col items-center gap-10 lg:flex-row justify-between'>
            <div className='my-24 flex lg:w-[50%] flex-col gap-10'>
              <h1 className='bg-gradient-to-br from-[#833AB4] via-[#FD1D1D] to-[#FCB045] bg-clip-text text-4xl font-semibold text-transparent lg:w-[70%]'>Our Founding Story</h1>
              <p className='text-base font-medium text-richblack-300 lg:w-[95%]'>
                Our e-learning platform was born out of a shared vision and passion for transforming education...
              </p>
            </div>
            <div className='w-full md:w-[50%]'>
              <img className='hidden sm:grid mb-5 w-full shadow-[0_0_20px_0] shadow-[#FC6767]' src={FoundingStory} alt="Founding Story" />
            </div>
          </div>
        </div>
      </section>

      <StatsComponent />  

      <section className='mx-auto p-2 flex flex-col items-center justify-between gap-5 mb-[140px]'>
        <LearningGrid />
        <ContactFormSection />
      </section>

      <section>
        <div className='mb-10 mt-3 px-3 mx-auto w-screen'>
          <h2 className='text-center text-4xl font-semibold mt-8 text-richblack-5 mb-5'>Reviews from other learners</h2>
          <ReviewSlider />
        </div>
      </section>
    </div>
  );
}

export default About;
