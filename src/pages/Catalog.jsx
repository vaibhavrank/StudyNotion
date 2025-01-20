import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom'
import { apiConnector } from '../services/apiconnector';
import { categories } from '../services/apis';
import { getCatalogPageData } from '../services/operations/pageAndComponentData';
import CourseSlider from '../components/core/Catalog/CourseSlider';
import Course_Card from '../components/core/Catalog/Course_Card';
  
const Catalog = () => {
    const {catalogName} = useParams();
    const [catalogPageData,setCatalogPagedata] = useState(null)
    const [categoryId,setCatagoryId] = useState("");
    console.log("Catagory Name.........",catalogName);
    
    useEffect(() => {
        const getCategories = async () => {
          try {
            const res = await apiConnector("GET", categories.CATEGORIES_API);
            console.log("RESULT AT ALL CATEGORY........", res);
            const category = res?.data?.allCatagory?.find(
              (ct) => ct.name.toLowerCase() === catalogName.toLowerCase()
            );
    
            if (category) {  
              setCatagoryId(category._id);
              // console.log("RESULT AT ID..........", category._id);
            }
          } catch (error) {
            console.error("Error fetching categories:", error);
          }
        };
    
        getCategories();
      }, [catalogName]);
    
        useEffect(() => {
          const getCategoryDetails = async () => {
            if (!categoryId) return;
      
            try {
              const res = await getCatalogPageData(categoryId);
              // console.log("PRINTING RESULT OF PAGE DATA......", catalogPageData,"\nRESULT: ",res);
              setCatalogPagedata(res);
            } catch (error) {
              console.error("Error fetching category details:", error);
            }
          };
      
          getCategoryDetails();
              console.log("UPDATED CATLOG PAGE DATA..........",catalogPageData);
        }, [categoryId]);

    return (
        <div className='text-white'>
            <div>
                <p>{`Home / Catalog / `}
                    <span>{catalogPageData?.selectedCatagory?.name}</span>
                </p>
                <p>{catalogPageData?.selectedCatagory?.name}</p>
                <p>{catalogPageData?.selectedCatagory?.description}</p>
            </div>
            <div>
                {/* section1 */}
                <div>
                    <div>Course to get started</div>
                    <div className='flex gap-x-3'>
                        <p>Most Popular</p>
                        <p>New</p>
                    </div>  
                    <CourseSlider Courses={catalogPageData?.selectedCatagory?.courses} />
                </div>

                {/* section2 */}
                <div><div>Top Courses in {catalogPageData?.selectedCatagory?.name}</div>
                    <p>Top courses</p>
                    <div>
                        <CourseSlider Courses={catalogPageData?.differentCatagory[0]?.courses} />
                    </div>                
                </div>

                {/* section3 */}
                <div>
                    <div>Frequently Bought</div>
                    <div className="py-8">

                        <div className="grid grid-cols-1 lg:grid-cols-2">
                            {
                                catalogPageData?.mostSellingCourses?.slice(0,4).map( (course,index) =>(
                                  <Course_Card key={index} course={course}  Height={"400px"} />
                                ))
                            }
                        </div>
                    </div>
                </div>
                
            </div>
        </div>
    )
}

export default Catalog