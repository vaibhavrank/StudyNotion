import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { apiConnector } from '../services/apiconnector';
import { categories } from '../services/apis';
import { getCatalogPageData } from '../services/operations/pageAndComponentData';
import CourseSlider from '../components/core/Catalog/CourseSlider';
import Course_Card from '../components/core/Catalog/Course_Card';
// Assuming you have a loading spinner component, otherwise remove or create one
// import LoadingSpinner from '../components/common/LoadingSpinner';

const Catalog = () => {
  const { catalogName } = useParams();
  const [catalogPageData, setCatalogPageData] = useState(null);
  const [categoryId, setCategoryId] = useState('');
  const [activeCourseFilter, setActiveCourseFilter] = useState('mostPopular'); // Renamed for clarity
  const [loading, setLoading] = useState(true); // Added loading state

  useEffect(() => {
    const getCategories = async () => {
      setLoading(true); // Start loading
      try {
        const res = await apiConnector('GET', categories.CATEGORIES_API);
        const category = res?.data?.allCatagory?.find(
          (ct) => ct.name.toLowerCase() === catalogName.toLowerCase()
        );

        if (category) {
          setCategoryId(category._id);
        } else {
          console.warn(`Category "${catalogName}" not found.`);
          setCatalogPageData({
            selectedCatagory: { name: 'Category Not Found', description: 'The category you are looking for does not exist.' },
            differentCatagory: [],
            mostSellingCourses: []
          });
        }
      } catch (error) {
        console.error('Error fetching categories:', error);
        setCatalogPageData({
          selectedCatagory: { name: 'Error', description: 'Could not load category information.' },
          differentCatagory: [],
          mostSellingCourses: []
        });
      } finally {
        setLoading(false); // End loading
      }
    };

    getCategories();
  }, [catalogName]);

  useEffect(() => {
    const getCategoryDetails = async () => {
      if (!categoryId) return;
      setLoading(true); // Start loading for category details
      try {
        const res = await getCatalogPageData(categoryId);
        setCatalogPageData(res);
      } catch (error) {
        console.error('Error fetching category details:', error);
        setCatalogPageData({
          selectedCatagory: { name: 'Error', description: 'Could not load course details.' },
          differentCatagory: [],
          mostSellingCourses: []
        });
      } finally {
        setLoading(false); // End loading
      }
    };

    getCategoryDetails();
  }, [categoryId]);

  // Loading state
  if (loading || catalogPageData === null) {
    return (
      <div className='flex justify-center items-center h-screen'>
        <div className='custom-loader'></div> {/* Ensure custom-loader CSS is defined */}
      </div>
    );
  }

  // Displaying courses based on activeCourseFilter
  const displayedCourses = activeCourseFilter === 'mostPopular'
    ? catalogPageData?.selectedCatagory?.courses
    : [...(catalogPageData?.selectedCatagory?.courses || [])].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  return (
    <div className='w-full max-w-6xl mx-auto px-4 py-8 lg:py-12'>
      {/* Category Header Section */}
      <div className='text-white mb-10'>
        <p className='text-sm text-richblack-300 mb-2'>
          Home / Catalog / <span className='text-yellow-50'>{catalogPageData?.selectedCatagory?.name}</span>
        </p>
        <h1 className='text-4xl font-bold mb-3'>{catalogPageData?.selectedCatagory?.name}</h1>
        <p className='text-lg text-richblack-200'>{catalogPageData?.selectedCatagory?.description}</p>
      </div>

      {/* Courses to get started Section */}
      <div className='mb-12'>
        <h2 className='text-3xl font-semibold text-white mb-6'>Courses to get started</h2>
        <div className='flex gap-x-6 mb-8 border-b border-richblack-700 pb-2'>
          <button
            onClick={() => setActiveCourseFilter('mostPopular')}
            className={`px-4 py-2 text-lg font-medium transition-all duration-200
              ${activeCourseFilter === 'mostPopular' ? 'border-b-2 border-yellow-25 text-yellow-25' : 'text-richblack-200 hover:text-richblack-50 hover:border-yellow-100'}`}
          >
            Most Popular
          </button>
          <button
            onClick={() => setActiveCourseFilter('new')}
            className={`px-4 py-2 text-lg font-medium transition-all duration-200
              ${activeCourseFilter === 'new' ? 'border-b-2 border-yellow-25 text-yellow-25' : 'text-richblack-200 hover:text-richblack-50 hover:border-yellow-100'}`}
          >
            New
          </button>
        </div>
        {displayedCourses && displayedCourses.length > 0 ? (
          <CourseSlider Courses={displayedCourses} />
        ) : (
          <p className="text-white text-center text-lg mt-4">No courses available in this category yet.</p>
        )}
      </div>

      {/* Top Courses in Category Section */}
      {catalogPageData?.differentCatagory && catalogPageData.differentCatagory.length > 0 && (
        <div className='mb-12'>
          <h2 className='text-3xl font-semibold text-white mb-6'>
            Top Courses in {catalogPageData?.differentCatagory[0]?.name || 'Related Categories'}
          </h2>
          {catalogPageData.differentCatagory[0]?.courses && catalogPageData.differentCatagory[0].courses.length > 0 ? (
            <CourseSlider Courses={catalogPageData?.differentCatagory[0]?.courses} />
          ) : (
            <p className="text-white text-center text-lg mt-4">No top courses available in related categories.</p>
          )}
        </div>
      )}

      {/* Frequently Bought Section */}
      {catalogPageData?.mostSellingCourses && catalogPageData.mostSellingCourses.length > 0 && (
        <div className='mb-12'>
          <h2 className='text-3xl font-semibold text-white mb-6'>Students also bought</h2> {/* Changed heading for better clarity */}
          <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8'>
            {catalogPageData.mostSellingCourses.slice(0, 4).map((course, index) => (
              <Course_Card
                key={index}
                course={course}
                Width={'w-full'}
                Height={'h-[200px]'}
                // === IMPORTANT CHANGE FOR TEXT COLOR ===
                // This class will likely set all text within Course_Card to white.
                // You might need to adjust based on your Course_Card's internal structure.
                className="text-white hover:scale-105 transition-transform duration-200 ease-in-out cursor-pointer shadow-lg hover:shadow-yellow-500/30"
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Catalog;