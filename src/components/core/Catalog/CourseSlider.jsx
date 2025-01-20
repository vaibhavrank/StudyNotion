import React from 'react'
import {Swiper,SwiperSlide} from 'swiper/react'
import "swiper/css"
import "swiper/css/free-mode"
import "swiper/css/pagination"
import {FreeMode,Pagination,Autoplay, Navigation} from 'swiper/modules'
import Course_Card from './Course_Card'

const CourseSlider = ({Courses}) => {
  return (
    <div>
      {
        Courses?.length ? (
          
            <Swiper
            slidesPerView={1}
            spaceBetween={200}
            pagination={true}
            navigation={true}
            modules={[Autoplay,Pagination,Navigation]}
            // loop={true}
            autoplay={{
              delay:2500,
              disableOnInteraction:false }
            }
            breakpoints={{
              1024:{slidesPerView:3}
            }}
            className='mySwiper'
            dynamicBullets={true}
            >
              {
                Courses?.map( (course,index) =>(
                  <SwiperSlide key={index}
                  
                  >
                    <Course_Card course={course} Height={"h-[250px]"} />
                  </SwiperSlide>
                ))
              }
                 

            </Swiper>
          
        ) 
        : (
          <p>NoCourse Found</p>
        )
      }
    </div>
  )
}

export default CourseSlider