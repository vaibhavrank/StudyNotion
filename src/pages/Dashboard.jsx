import React from 'react'
import { useSelector } from 'react-redux'
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/core/Dashboard/Sidebar';

const Dashboard = () => {
  const {loading:authLoading} = useSelector( (state)=>state.auth);
  const {loading:profileLoading} = useSelector( (state)=>state.profile);

  if(profileLoading||authLoading){
    return (
      <div className='mt-10'>Loading....</div>
    )
  }
  return (
    <div className='relative flex bg-richblack-400'>
      <Sidebar className="h-full overflow-hidden" />
      <div className=' flex-1  h-screen overflow-auto  bg-richblack-900'>
          <div className=' '>
              <Outlet />
          </div>
      </div>
    </div>
  )
}

export default Dashboard