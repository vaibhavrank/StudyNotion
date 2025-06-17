// import logo from './logo.svg';
import { Outlet, Route, Routes } from 'react-router-dom';
import './App.css';
import Home from './pages/Home';
import Login from './pages/Login.jsx';
import Signup from './pages/Signup.jsx';
import Navbar from './components/common/Navbar.jsx';
import Error from './pages/Error.jsx';
import OpenRoute from "./components/core/Auth/OpenRoute.jsx"
import PrivateRoute from "./components/core/Auth/PrivateRoute.jsx"
import ForgotPassword from './pages/ForgotPassword.jsx';
import UpdatePassword from './pages/UpdatePassword.jsx';
import VerifyEmail from './pages/VerifyEmail.jsx';
import About from './pages/About.jsx';
import Cart from './components/core/Dashboard/Cart/index.jsx'
import Dashboard from './pages/Dashboard.jsx';
import MyProfile from './pages/MyProfile.jsx';
import Settings from './components/core/Dashboard/Setting.jsx';
import EnrolledCourses from './components/core/Dashboard/EnrolledCourses.jsx';
import CourseInformationForm from './components/core/Dashboard/AddCourse/CourseInformation/CourseInformationForm.jsx'
import AddCourse from './components/core/Dashboard/AddCourse/index.jsx';
import MyCourses from './components/core/Dashboard/MyCourses/index.jsx';
import { ACCOUNT_TYPE } from './utils/constants.js';
import { useSelector } from 'react-redux';
import EditCourse from './components/core/Dashboard/EditCourse.jsx/index.jsx';
import Catalog from './pages/Catalog.jsx';
import CourseDetails from './pages/CourseDetails.jsx';
import ViewCourse from './pages/ViewCourse.jsx';
import VideoDetails from './components/core/Dashboard/ViewCourse/VideoDetails.jsx';
import Instructor from './components/core/Dashboard/InstructorDashboard/Instructor.jsx';
import ContactUsForm from './components/contactUs/ContactUsForm.jsx';
import ContactUs from './pages/ContactUs.jsx';
function App() {
  const {user} = useSelector((state) => state.profile)
  return (

    <div className='w-screen h-full overflow-hidden  bg-richblack-900 flex flex-col font-inter'>
      <Navbar />
      <div>
        <Outlet />
      </div>
      {/* <Footex */}
      <Routes >
        <Route path='/' element={<Home />} />
        <Route
          path="/login"
          element={
            <OpenRoute>
              <Login />
            </OpenRoute>
          }
        />

        <Route
          path="/signup"
          element={
            <OpenRoute>
              <Signup />
            </OpenRoute>
          }
        />
        <Route
          path="/forgot-password"
          element={
            <OpenRoute>
              <ForgotPassword />
            </OpenRoute>
          }
        />
        
        <Route
          path="/update-password/:id"
          element={
            <OpenRoute>
              <UpdatePassword />
            </OpenRoute>
          }
        />
         <Route
          path="/verify-email"
          element={
            <OpenRoute>
              <VerifyEmail />
            </OpenRoute>
          }
        />
        {/* <Route path='/forgor-password' element */}
        <Route element={
            <PrivateRoute >
              <Dashboard />
            </PrivateRoute>
           }
        >
          <Route path='/dashboard/my-profile' element={<MyProfile  /> } />
          <Route path='/dashboard/settings' element={<Settings /> } />
          {
            user?.accountType === ACCOUNT_TYPE.STUDENT &&(
              <>
                <Route path='/dashboard/cart'element={<Cart />} />
                <Route path='/dashboard/enrolled-courses'element={< EnrolledCourses />} />                
              </>
            )
          }{
            user?.accountType === ACCOUNT_TYPE.INSTRUCTOR &&(
              <>
                <Route path='/dashboard/my-courses' element={<MyCourses  /> } />
                <Route path='/dashboard/add-course'element={< AddCourse />} />
                <Route path='/dashboard/edit-course/:courseId' element={<EditCourse />} />    
                <Route path={'/dashboard/instructor'} element={<Instructor />} />
              </>
            )
          }
          {/* <Route path='*' element={<Error />} /> */}
        
        </Route>

        <Route
          element={
            <PrivateRoute>
              <ViewCourse />
            </PrivateRoute>
          }
        >
          {user?.accountType === ACCOUNT_TYPE.STUDENT && (
            <>
              <Route
                path="/view-course/:courseId/section/:sectionId/sub-section/:subsectionId"
                element={<VideoDetails />}
              />
            </>
          )}
        </Route>
        <Route path='/catalog/:catalogName' element={<Catalog /> } />
        <Route path='/courses/:courseId' element={<CourseDetails /> } />
        <Route path="/about" element={<About />} />
        <Route path='/contact' element={<ContactUs />} />
        <Route path='*' element={<Error />} />
      </Routes>
    </div>
  );
}

export default App;
